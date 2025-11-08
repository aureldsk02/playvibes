"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserProfile } from "@/components/auth/user-profile";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { signInWithSpotify } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Menu, X, Music } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Browse", href: "/browse" },
  { name: "Manage", href: "/manage" },
  { name: "Saved", href: "/saved" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              <Music className="w-8 h-8 text-primary" />
              <span className="hidden sm:block">PlayVibes</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Auth + Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Desktop Auth */}
            <div className="hidden sm:block">
              <AuthGuard fallback={<SignInButton />}>
                <UserProfile />
              </AuthGuard>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-border mt-4">
                <AuthGuard fallback={<SignInButton />}>
                  <UserProfile />
                </AuthGuard>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
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
      size="sm"
      className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
    >
      <svg
        className="w-4 h-4 mr-2"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
      Sign in
    </Button>
  );
}