---
description: Deploy the auth-service to Vercel production using the CLI
---

# SKILL: Deploy to Vercel

## CONTEXT

This skill deploys the `auth-service` (BetterAuth JWT server) to Vercel production.

**Project details:**
- Vercel project: `physical-ai-auth`
- Production URL: `https://physical-ai-auth-three.vercel.app`
- Config: `vercel.json` at repo root (builds `auth-service/index.js` via `@vercel/node`)
- Vercel does NOT auto-deploy on git push — manual CLI deploy is required

**Deployment request:** $ARGUMENTS

## YOUR ROLE

Act as a deployment engineer. Run the Vercel CLI commands, verify the deployment, and report the result clearly.

## EXECUTION STEPS

### Step 1: Check Vercel CLI availability

```bash
npx vercel --version
```

If not available, it will be downloaded automatically via npx.

### Step 2: Verify login status

```bash
npx vercel whoami
```

If output is `Error: The specified token is not valid` → run login:

```bash
npx vercel login
```

This opens a browser. Wait for "Congratulations! You are now signed in." message.

### Step 3: Deploy to production

```bash
cd /c/Users/User/Documents/hackathon1
npx vercel --prod --yes
```

**Flags:**
- `--prod` → deploys to production (aliases `physical-ai-auth-three.vercel.app`)
- `--yes` → skips all confirmation prompts

Wait for the output to show:
```
Aliased: https://physical-ai-auth-three.vercel.app
```

### Step 4: Verify deployment

Test health endpoint:

```bash
curl -s https://physical-ai-auth-three.vercel.app/health
```

Expected response: `{"status":"ok"}`

Test auth endpoint:

```bash
curl -s -o /dev/null -w "HTTP: %{http_code}" https://physical-ai-auth-three.vercel.app/api/auth/get-session
```

Expected: `HTTP: 200`

## OUTPUT FORMAT

Report results like this:

```
✅ Vercel deployment complete

🔧 Service: physical-ai-auth (auth-service)
🌐 URL: https://physical-ai-auth-three.vercel.app
📦 Built: auth-service/index.js → @vercel/node

✓ /health → 200 {"status":"ok"}
✓ /api/auth/get-session → 200
```

## TROUBLESHOOTING

**`Error: The specified token is not valid`**
→ Run `npx vercel login` and authenticate in the browser.

**`FUNCTION_INVOCATION_FAILED` (500) after deploy**
→ Check that these env vars are set in Vercel dashboard (Settings → Environment Variables):
  - `NEON_DATABASE_URL`
  - `BETTER_AUTH_SECRET`
  - `BETTER_AUTH_URL` → must be `https://physical-ai-auth-three.vercel.app` (NOT localhost)

**Build succeeds but old code is still running**
→ The deploy might not have aliased yet. Wait 30 seconds and retest.
→ Or check Vercel dashboard → Deployments to confirm the new deploy is "Production".

**`vercel.json` config warning about unused build settings**
→ This is expected. The `builds` key in `vercel.json` overrides dashboard settings — ignore this warning.

## NOTES

- GitHub push does NOT trigger Vercel auto-deploy for this project (no GitHub integration configured)
- Always run this skill after making changes to `auth-service/`
- The `.vercelignore` excludes `docs/`, `src/`, `backend/`, `node_modules/` etc. — only `auth-service/` and `vercel.json` are deployed
