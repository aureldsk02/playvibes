"use client";

import { useEffect } from "react";
import "@/lib/error-handler";

export function GlobalErrorInitializer() {
  useEffect(() => {
    // The global error handler is initialized when imported
    // This component just ensures it's loaded on the client side
    console.log("Global error handler initialized");
  }, []);

  return null;
}