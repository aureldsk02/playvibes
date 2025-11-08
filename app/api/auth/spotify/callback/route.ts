import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Spotify OAuth error:", error);
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}?error=spotify_auth_failed`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}?error=missing_parameters`
      );
    }

    // Verify state parameter (should be user ID)
    const userId = state;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}?error=invalid_state`
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.BETTER_AUTH_URL}/api/auth/callback/spotify`,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Failed to exchange code for tokens:", tokenResponse.statusText);
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}?error=token_exchange_failed`
      );
    }

    const tokens = await tokenResponse.json();

    // Get Spotify user info
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error("Failed to get Spotify user info:", userResponse.statusText);
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}?error=user_info_failed`
      );
    }

    const spotifyUser = await userResponse.json();

    // Update user with Spotify ID
    await db
      .update(users)
      .set({
        spotifyId: spotifyUser.id,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Check if account already exists
    const existingAccount = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, userId),
          eq(accounts.provider, "spotify")
        )
      )
      .limit(1);

    const accountData = {
      userId,
      provider: "spotify",
      providerAccountId: spotifyUser.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
      tokenType: tokens.token_type,
      scope: tokens.scope,
    };

    if (existingAccount.length) {
      // Update existing account
      await db
        .update(accounts)
        .set(accountData)
        .where(eq(accounts.id, existingAccount[0].id));
    } else {
      // Create new account
      await db.insert(accounts).values({
        id: nanoid(),
        ...accountData,
      });
    }

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.BETTER_AUTH_URL}?spotify_connected=true`
    );
  } catch (error) {
    console.error("Error in Spotify callback:", error);
    return NextResponse.redirect(
      `${process.env.BETTER_AUTH_URL}?error=callback_failed`
    );
  }
}