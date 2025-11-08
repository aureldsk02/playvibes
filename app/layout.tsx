import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { PlaybackProvider } from "@/components/playback/playback-provider";
import { GlobalPlayer } from "@/components/playback/global-player";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { GlobalErrorInitializer } from "@/components/global-error-initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlayVibes - Share Your Music",
  description: "A social platform for sharing and discovering Spotify playlists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://sdk.scdn.co/spotify-player.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalErrorInitializer />
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <PlaybackProvider>
                {children}
                <GlobalPlayer />
              </PlaybackProvider>
            </AuthProvider>
            <Toaster />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
