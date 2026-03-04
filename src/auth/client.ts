import { createAuthClient } from "better-auth/react";

const AUTH_TOKEN_KEY = "ba_token";

export const saveAuthToken = (token: string) => {
  if (typeof window !== "undefined") localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Create auth client only on client-side
export const authClient = typeof window !== "undefined"
  ? createAuthClient({
      baseURL: window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : "https://physical-ai-auth-three.vercel.app",
      fetchOptions: {
        onRequest: (ctx) => {
          const token = getAuthToken();
          if (token) {
            ctx.headers.set("Authorization", `Bearer ${token}`);
          }
        },
      },
    })
  : null as any;

export const { signIn, signUp, signOut, useSession } = authClient || {};
