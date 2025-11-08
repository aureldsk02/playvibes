"use client";

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Better Auth doesn't require a provider wrapper in the current version
  // The client handles state management internally
  return <>{children}</>;
}