import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://physical-ai-auth-server.onrender.com",
});

export const { signIn, signUp, signOut, useSession } = authClient;
