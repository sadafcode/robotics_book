import "dotenv/config";
import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import { betterAuth } from "better-auth";
import { toNodeHandler } from "better-auth/node";

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  trustedOrigins: ["http://localhost:3000", "https://sadafcode.github.io"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
});

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  "https://sadafcode.github.io",
];

// CORS must come before the BetterAuth handler
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Mount BetterAuth handler (Express v5 uses *splat syntax)
app.all("/api/auth/*splat", toNodeHandler(auth));

// express.json() after BetterAuth handler per docs
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
  });
}

export default app;
