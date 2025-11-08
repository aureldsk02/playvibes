import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { spotifyAPI } from "@/lib/spotify";

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

    // Get a valid access token (this will refresh if needed)
    const accessToken = await spotifyAPI.getValidAccessToken(session.user.id);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Failed to refresh Spotify token. Please reconnect your account." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Token refreshed successfully",
      hasValidToken: true,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}