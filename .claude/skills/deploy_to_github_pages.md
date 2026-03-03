---
description: Deploy Docusaurus documentation site to GitHub Pages with proper configuration
---

# SKILL: Deploy to GitHub Pages

## CONTEXT

The user wants to deploy their Docusaurus documentation site to GitHub Pages for public hosting. This skill handles:

- GitHub Pages configuration in Docusaurus
- GitHub Actions workflow setup for automated deployment
- Manual deployment using Docusaurus deploy command
- Custom domain configuration (if needed)
- Troubleshooting common deployment issues

**Deployment request:** $ARGUMENTS (repository details, deployment preferences)

## YOUR ROLE

Act as a DevOps and deployment specialist with expertise in:
- GitHub Pages hosting and configuration
- CI/CD workflows with GitHub Actions
- Docusaurus build and deployment processes
- DNS and custom domain setup
- Troubleshooting deployment failures

## EXECUTION STEPS

### Step 1: Verify GitHub Repository Setup

Ensure the repository is properly configured:

```bash
# Check if git is initialized
git status

# Verify remote repository
git remote -v
```

Requirements:
- Repository must exist on GitHub
- Local repository must be connected to GitHub remote
- You have push access to the repository

If not set up:
```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Configure Docusaurus for GitHub Pages

Update `docusaurus.config.js` with GitHub Pages settings:

```javascript
const config = {
  // ... other config

  // GitHub Pages deployment config
  url: 'https://$USERNAME.github.io',
  baseUrl: '/$REPO_NAME/',

  organizationName: '$USERNAME', // GitHub org/user name
  projectName: '$REPO_NAME', // Repo name
  deploymentBranch: 'gh-pages', // Branch for deployment
  trailingSlash: false,

  // ... rest of config
};
```

**Important notes:**
- For user/organization site (`username.github.io`): set `baseUrl: '/'`
- For project site: set `baseUrl: '/repo-name/'`
- `organizationName` must match GitHub username or org exactly (case-sensitive)

### Step 3: Choose Deployment Method

Present two options to the user:

#### Option A: Automated Deployment (GitHub Actions - Recommended)

**Advantages:**
- Automatic deployment on every push to main
- No need to build locally
- Consistent deployment environment
- Easy to maintain

**Important Configuration:**
- Ensure GitHub Actions workflow triggers on the correct branch (main, master, or gh-pages)
- Verify repository is public for public GitHub Pages access
- Check that the workflow file is properly configured for your default branch

#### Option B: Manual Deployment (Docusaurus CLI)

**Advantages:**
- Simple one-command deployment
- Works from local machine
- No CI/CD configuration needed
- Good for quick updates

Ask user preference if not specified in $ARGUMENTS.

### Step 4a: Set Up Automated Deployment (GitHub Actions)

Create GitHub Actions workflow file:

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
    # Trigger on file changes in these paths
    paths-ignore:
      - '.github/**'
      - 'README.md'

  # Allows manual workflow trigger from Actions tab
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Fetch all history for git info

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build website
        run: npm run build

      - name: Upload Build Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Configure GitHub Pages settings:**

1. Go to repository Settings → Pages
2. Under "Build and deployment":
   - Source: "GitHub Actions"
3. Save changes

**Commit and push the workflow:**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

The site will automatically deploy on this push.

### Step 4b: Set Up Manual Deployment

For manual deployment using Docusaurus CLI:

**Configure authentication:**

Set up SSH key or use HTTPS with personal access token:

```bash
# For HTTPS (requires GitHub personal access token)
git remote set-url origin https://$TOKEN@github.com/$USERNAME/$REPO_NAME.git

# For SSH (recommended)
git remote set-url origin git@github.com:$USERNAME/$REPO_NAME.git
```

**Set Git user information:**

```bash
# Set global git config (if not already set)
git config --global user.name "$YOUR_NAME"
git config --global user.email "$YOUR_EMAIL"
```

**Deploy command:**

```bash
# Set environment variables for deployment
GIT_USER=$USERNAME npm run deploy
```

Or add to `package.json`:

```json
{
  "scripts": {
    "deploy": "docusaurus deploy"
  }
}
```

Then deploy with:

```bash
GIT_USER=$USERNAME npm run deploy
```

**What this does:**
1. Builds the site (`npm run build`)
2. Pushes build output to `gh-pages` branch
3. GitHub Pages serves from `gh-pages` branch

### Step 5: Configure GitHub Pages Source

If using manual deployment:

1. Go to repository Settings → Pages
2. Under "Build and deployment":
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` / `/ (root)`
3. Save changes

### Step 6: Verify Deployment

Wait 2-5 minutes for GitHub Pages to deploy, then:

**Check deployment status:**
- Go to repository → Actions tab
- Verify workflow ran successfully (if using Actions)
- Or check Settings → Pages for deployment URL
- Ensure repository is set to "Public" for GitHub Pages access

**Test the deployed site:**

Visit: `https://$USERNAME.github.io/$REPO_NAME/`

Check:
- [ ] Site loads correctly
- [ ] Navigation works
- [ ] All pages are accessible
- [ ] Images and assets load
- [ ] Links are not broken
- [ ] Base URL is correct (no 404s)
- [ ] Repository is public (for public access)

### Step 7: Set Up Custom Domain (Optional)

If user wants a custom domain:

**Add CNAME file:**

Create `static/CNAME`:
```
docs.yourdomain.com
```

**Configure DNS:**

Add DNS records at your domain provider:
- For subdomain: `CNAME` record pointing to `$USERNAME.github.io`
- For apex domain: `A` records pointing to GitHub Pages IPs:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

**Update Docusaurus config:**

```javascript
const config = {
  url: 'https://docs.yourdomain.com',
  baseUrl: '/',
  // ... rest of config
};
```

**Configure in GitHub:**
- Go to Settings → Pages
- Under "Custom domain", enter your domain
- Enable "Enforce HTTPS" (after DNS propagates)

### Step 8: Set Up Deployment Script (Convenience)

Create a deployment script for easier manual deployments:

`scripts/deploy.sh`:
```bash
#!/bin/bash

set -e # Exit on error

echo "🚀 Deploying to GitHub Pages..."

# Set git user (replace with your details)
git config user.name "$GIT_USER_NAME"
git config user.email "$GIT_USER_EMAIL"

# Build and deploy
npm run build
GIT_USER=$GIT_USER npm run deploy

echo "✅ Deployment complete!"
echo "🔗 Site will be live at: https://$USERNAME.github.io/$REPO_NAME/"
echo "⏱️  Allow 2-5 minutes for changes to propagate"
```

Make executable:
```bash
chmod +x scripts/deploy.sh
```

Add to `.gitignore`:
```
# Build output
build/
.docusaurus/
```

## OUTPUT STRUCTURE

Present results in this format:

```
✅ GitHub Pages deployment configured

🔧 Configuration:
   - Repository: $USERNAME/$REPO_NAME
   - Deployment method: [GitHub Actions | Manual]
   - Branch: gh-pages
   - URL: https://$USERNAME.github.io/$REPO_NAME/

📋 Deployment status:
   ✓ docusaurus.config.js updated
   ✓ [GitHub Actions workflow created | Deploy command configured]
   ✓ Git repository connected
   ✓ Build completed successfully

🌐 Live site: https://$USERNAME.github.io/$REPO_NAME/
   (Allow 2-5 minutes for deployment to complete)

📚 Documentation:
   - GitHub Pages: https://pages.github.com/
   - Docusaurus deployment: https://docusaurus.io/docs/deployment

🔄 Deployment commands:
   [Automated] - Push to main branch triggers deployment
   [Manual] - Run: GIT_USER=$USERNAME npm run deploy

✓ Site builds without errors
✓ GitHub Pages configured correctly
✓ Deployment tested successfully
```

## TROUBLESHOOTING GUIDE

**If deployment fails with 404:**
- Check `baseUrl` in `docusaurus.config.js` matches repo name
- Verify GitHub Pages is enabled in repository settings
- Ensure `gh-pages` branch exists and contains build output
- Check URL format: `https://username.github.io/repo-name/` (trailing slash)
- Verify GitHub Actions workflow triggers on the correct branch (main, master, or gh-pages)
- Ensure repository is set to "Public" for public access

**If GitHub Actions workflow fails:**
- Check Actions tab for specific error messages
- Verify Node.js version in workflow matches local version
- Ensure `npm ci` can install all dependencies
- Check build logs for missing files or broken links
- Verify the workflow triggers on the correct branch (not just 'main' or 'master')

**If assets (images, CSS) don't load:**
- Verify `baseUrl` is set correctly
- Check asset paths use relative URLs, not absolute
- Ensure assets are in `static/` directory
- Clear browser cache and hard reload

**If custom domain doesn't work:**
- Verify DNS records are correct and propagated (use `dig` or online DNS checker)
- Check `static/CNAME` file exists and contains correct domain
- Wait up to 24 hours for DNS propagation
- Verify HTTPS is not enforced before DNS propagates

**If deployment succeeds but site shows old version:**
- Clear GitHub Pages cache by making a trivial commit
- Check if `gh-pages` branch has latest build
- Try hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R)
- Wait a few minutes for GitHub CDN to update

**If site still shows 404 after successful build:**
- Go to repository Settings → Pages
- Temporarily change source to another branch, save
- Change back to the correct branch (gh-pages) with correct directory (/ root), save
- This forces GitHub Pages to refresh configuration
- Wait 5-10 minutes for changes to propagate

## ERROR HANDLING

**If Git user not configured:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**If authentication fails:**
- For HTTPS: Create GitHub personal access token with `repo` scope
- For SSH: Set up SSH key and add to GitHub account
- Verify remote URL is correct

**If build fails:**
- Run `npm run build` locally to see detailed errors
- Check for broken links or invalid frontmatter
- Verify all imported assets exist
- Fix errors and redeploy

## QUALITY CHECKS

Before completing:
- [ ] `docusaurus.config.js` has correct GitHub Pages settings
- [ ] Repository is connected to GitHub remote
- [ ] Repository is set to "Public" (required for public GitHub Pages access)
- [ ] Deployment workflow/command is set up
- [ ] GitHub Actions workflow triggers on correct branch (main, master, or gh-pages)
- [ ] `npm run build` completes without errors
- [ ] GitHub Pages is enabled in repository settings
- [ ] Live site is accessible at expected URL
- [ ] All pages and assets load correctly
- [ ] Navigation works on deployed site

## AUTOMATION BENEFITS

When using GitHub Actions:
- ✅ Automatic deployment on every push
- ✅ No local build artifacts
- ✅ Consistent deployment environment
- ✅ Deployment history in Actions tab
- ✅ Rollback capability via git history
- ✅ No need to manage credentials locally

## TONE

Be systematic and reassuring. Deployment can be tricky, so provide clear instructions, explain what each step does, and offer comprehensive troubleshooting guidance.
