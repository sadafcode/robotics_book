require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { betterAuth } = require("better-auth");
const { toNodeHandler } = require("better-auth/node");

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

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
  });
}

module.exports = app;
