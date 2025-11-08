import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has a Spotify account connected
    const spotifyAccount = await db
      .select({
        id: accounts.id,
        providerAccountId: accounts.providerAccountId,
        accessToken: accounts.accessToken,
        refreshToken: accounts.refreshToken,
        expiresAt: accounts.expiresAt,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, session.user.id),
          eq(accounts.provider, "spotify")
        )
      )
      .limit(1);

    const isConnected = spotifyAccount.length > 0 && !!spotifyAccount[0].accessToken;
    
    return NextResponse.json({
      isConnected,
      spotifyId: isConnected ? spotifyAccount[0].providerAccountId : undefined,
      hasValidToken: isConnected && spotifyAccount[0].expiresAt 
        ? spotifyAccount[0].expiresAt > Math.floor(Date.now() / 1000) 
        : false,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking Spotify status:", error);
    return NextResponse.json(
      { error: "Failed to check Spotify connection status" },
      { status: 500 }
    );
  }
}