---
description: Initialize a new Docusaurus documentation site with proper configuration and structure
---

# SKILL: Initialize Docusaurus Project

## CONTEXT

The user needs to set up a new Docusaurus documentation site for a technical book, guide, or documentation project. This skill handles the complete initialization including:

- Installing Docusaurus with the latest stable version
- Configuring project metadata and settings
- Setting up the proper directory structure
- Creating initial configuration files
- Preparing for GitHub Pages deployment

**Project name:** $ARGUMENTS (or use default if not provided)

## YOUR ROLE

Act as a Docusaurus architect with expertise in:
- Static site generation and documentation frameworks
- React-based documentation systems
- Project scaffolding and configuration
- Documentation site architecture

## EXECUTION STEPS

### Step 1: Verify Prerequisites

Check that Node.js and npm are installed:

```bash
node --version
npm --version
```

Requirements:
- Node.js >= 18.0
- npm >= 9.0

### Step 2: Initialize Docusaurus Project

Create a new Docusaurus project using the official scaffolding tool:

```bash
npx create-docusaurus@latest $PROJECT_NAME classic --typescript
```

If the user prefers JavaScript, omit the `--typescript` flag.

### Step 3: Configure `docusaurus.config.js`

Navigate to the project directory and update the configuration:

```javascript
// @ts-check
const config = {
  title: '$PROJECT_TITLE',
  tagline: '$PROJECT_TAGLINE',
  favicon: 'img/favicon.ico',

  // GitHub Pages deployment config
  url: 'https://$GITHUB_USERNAME.github.io',
  baseUrl: '/$REPO_NAME/',

  organizationName: '$GITHUB_USERNAME',
  projectName: '$REPO_NAME',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/$GITHUB_USERNAME/$REPO_NAME/tree/main/',
        },
        blog: false, // Disable blog for book-focused sites
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: '$PROJECT_TITLE',
      logo: {
        alt: '$PROJECT_TITLE Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/$GITHUB_USERNAME/$REPO_NAME',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} $PROJECT_TITLE. Built with Docusaurus.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
  },
};

module.exports = config;
```

### Step 4: Set Up Directory Structure

Create the recommended directory structure for a technical book:

```bash
mkdir -p docs/chapters
mkdir -p docs/resources
mkdir -p static/img
mkdir -p static/diagrams
```

### Step 5: Create Initial Index Document

Create `docs/intro.md`:

```markdown
---
id: intro
title: Introduction
sidebar_position: 1
---

# Welcome to $PROJECT_TITLE

$PROJECT_DESCRIPTION

## What You'll Learn

- Topic 1
- Topic 2
- Topic 3

## Prerequisites

- Prerequisite 1
- Prerequisite 2

## How to Use This Documentation

Navigate through the chapters using the sidebar on the left. Each chapter builds upon the previous one.
```

### Step 6: Initialize Git Repository

```bash
cd $PROJECT_NAME
git init
git add .
git commit -m "Initial Docusaurus setup for $PROJECT_TITLE"
```

### Step 7: Install Dependencies and Test

```bash
npm install
npm run start
```

Verify the site runs locally at `http://localhost:3000`.

## OUTPUT STRUCTURE

Present results in this format:

```
✅ Docusaurus project initialized: $PROJECT_NAME

📁 Project structure:
   ├── docs/
   │   ├── intro.md
   │   ├── chapters/
   │   └── resources/
   ├── static/
   ├── src/
   ├── docusaurus.config.js
   └── sidebars.js

🔧 Configuration:
   - URL: https://$GITHUB_USERNAME.github.io/$REPO_NAME/
   - Deployment: GitHub Pages (gh-pages branch)
   - Theme: Classic with custom CSS

🚀 Next steps:
   1. Add chapter files using create_chapter_file skill
   2. Configure sidebar navigation
   3. Customize theme and branding
   4. Deploy to GitHub Pages

✓ Local dev server: npm run start
✓ Build command: npm run build
✓ Deploy command: npm run deploy
```

## PLACEHOLDERS TO REPLACE

Ask the user for these values if not provided in $ARGUMENTS:

- `$PROJECT_NAME`: Directory/project name (kebab-case)
- `$PROJECT_TITLE`: Display title for the site
- `$PROJECT_TAGLINE`: Short tagline/subtitle
- `$PROJECT_DESCRIPTION`: Brief description for intro page
- `$GITHUB_USERNAME`: GitHub organization or username
- `$REPO_NAME`: Repository name

## ERROR HANDLING

**If Node.js version is incompatible:**
- Display version error with clear message
- Provide link to Node.js download page
- Suggest using nvm for version management

**If npx create-docusaurus fails:**
- Check internet connection
- Verify npm registry access
- Try with `--skip-install` flag and manual `npm install`

**If port 3000 is already in use:**
- Suggest alternative port: `npm run start -- --port 3001`

## QUALITY CHECKS

Before completing:
- [ ] `npm run build` completes without errors
- [ ] All configuration placeholders are replaced
- [ ] Directory structure matches expected layout
- [ ] Git repository is initialized with initial commit
- [ ] Local dev server starts successfully
- [ ] Documentation is accessible at localhost

## TONE

Be clear, systematic, and educational. Explain what each step accomplishes and why it matters for the overall documentation site structure.
