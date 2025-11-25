import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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

    // Generate Spotify OAuth URL
    const spotifyAuthUrl = new URL("https://accounts.spotify.com/authorize");

    const baseUrl = process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const params = {
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      response_type: "code",
      redirect_uri: `${baseUrl}/api/auth/callback/spotify`,
      scope: [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "streaming",
        "user-read-playback-state",
        "user-modify-playback-state",
      ].join(" "),
      state: session.user.id, // Use user ID as state for security
    };

    Object.entries(params).forEach(([key, value]) => {
      spotifyAuthUrl.searchParams.append(key, value);
    });

    return NextResponse.json({
      authUrl: spotifyAuthUrl.toString(),
    });
  } catch (error) {
    console.error("Error generating Spotify auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Redirect to Spotify OAuth
    const spotifyAuthUrl = new URL("https://accounts.spotify.com/authorize");

    const baseUrl = process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const params = {
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      response_type: "code",
      redirect_uri: `${baseUrl}/api/auth/callback/spotify`,
      scope: [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "streaming",
        "user-read-playback-state",
        "user-modify-playback-state",
      ].join(" "),
      state: session.user.id,
    };

    Object.entries(params).forEach(([key, value]) => {
      spotifyAuthUrl.searchParams.append(key, value);
    });

    return NextResponse.redirect(spotifyAuthUrl.toString());
  } catch (error) {
    console.error("Error initiating Spotify OAuth:", error);
    return NextResponse.json(
      { error: "Failed to initiate Spotify connection" },
      { status: 500 }
    );
  }
}