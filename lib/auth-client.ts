import { createAuthClient } from "better-auth/react";

// Auto-detect base URL for production if not explicitly set
const getBaseURL = () => {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }

  // In browser, use current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Fallback for SSR
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;

// Helper function to sign in with Spotify
export const signInWithSpotify = () => {
  return signIn.social({
    provider: "spotify",
    callbackURL: "/",
  });
};