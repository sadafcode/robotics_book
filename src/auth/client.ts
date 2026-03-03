import { createAuthClient } from "better-auth/react";

// Create auth client only on client-side
export const authClient = typeof window !== "undefined"
  ? createAuthClient({
      baseURL: window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : "https://physical-ai-auth-three.vercel.app",
    })
  : null as any;

export const { signIn, signUp, signOut, useSession } = authClient || {};
