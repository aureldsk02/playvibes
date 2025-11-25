"use client";


import { AuthGuard } from "@/components/auth/auth-guard";
import { signInWithSpotify } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Hero Section */}
      <main className="container-responsive py-12 sm:py-16 lg:py-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Share Your Music,
            </span>
            <br />
            <span className="text-foreground">Discover New Vibes</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            Connect your Spotify account and share your favorite playlists with the world.
            Discover new music through community-curated collections and connect with fellow music lovers.
          </p>

          <div className="mt-10 sm:mt-12">
            <AuthGuard
              fallback={
                <div className="space-y-6 animate-slide-up">
                  <SignInButton />
                  <p className="text-sm text-muted-foreground">
                    Sign in with Spotify to start sharing your playlists
                  </p>
                </div>
              }
            >
              <div className="glass rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto animate-scale-in">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Welcome to PlayVibes!
                </h2>
                <p className="text-muted-foreground mb-8 text-base sm:text-lg">
                  You&apos;re successfully authenticated. Start exploring the features below.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <FeatureCard
                    title="Share Playlists"
                    description="Make your playlists public for others to discover"
                    gradient="from-purple-500/10 to-purple-600/10"
                    textColor="text-purple-700 dark:text-purple-300"
                    delay="0s"
                  />
                  <FeatureCard
                    title="Discover Music"
                    description="Browse playlists by genre, mood, and activity"
                    gradient="from-blue-500/10 to-blue-600/10"
                    textColor="text-blue-700 dark:text-blue-300"
                    delay="0.1s"
                  />
                  <FeatureCard
                    title="Connect & Engage"
                    description="Like, comment, and save your favorite playlists"
                    gradient="from-green-500/10 to-green-600/10"
                    textColor="text-green-700 dark:text-green-300"
                    delay="0.2s"
                  />
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="animate-bounce-in">
                    <a href="/browse">Start Browsing</a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                    <a href="/manage">Manage Playlists</a>
                  </Button>
                </div>
              </div>
            </AuthGuard>
          </div>
        </div>
      </main>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  gradient: string;
  textColor: string;
  delay: string;
}

function FeatureCard({ title, description, gradient, textColor, delay }: FeatureCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} p-6 rounded-xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in`}
      style={{ animationDelay: delay }}
    >
      <h3 className={`font-semibold text-lg mb-2 ${textColor}`}>{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}



function SignInButton() {
  const handleSignIn = async () => {
    try {
      await signInWithSpotify();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
    >
      <svg
        className="w-4 h-4 mr-2"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      Sign in with Spotify
    </Button>
  );
}
