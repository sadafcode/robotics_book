---
description: Create a properly formatted markdown chapter file with frontmatter and structure
---

# SKILL: Create Chapter File

## CONTEXT

The user needs to add a new chapter to their Docusaurus documentation site. This skill creates a well-structured markdown file with:

- Proper frontmatter for Docusaurus integration
- Consistent heading hierarchy
- Code block formatting
- Cross-reference support
- Sidebar positioning

**Chapter details:** $ARGUMENTS (chapter title, topic, position)

## YOUR ROLE

Act as a technical documentation specialist with expertise in:
- Markdown formatting and best practices
- Docusaurus frontmatter configuration
- Technical content structure
- Documentation navigation design

## EXECUTION STEPS

### Step 1: Parse Chapter Requirements

Extract from $ARGUMENTS:
- **Chapter title**: The display name for this chapter
- **Chapter ID**: Kebab-case identifier (auto-generate from title if not provided)
- **Sidebar position**: Numeric order in sidebar (or auto-increment)
- **Category**: Optional grouping (e.g., "Getting Started", "Advanced Topics")
- **Description**: Optional short description for metadata

### Step 2: Determine File Location

Based on category and organization:

```
docs/
  ├── intro.md (position: 1)
  ├── chapter-01-topic.md (position: 2)
  ├── chapter-02-topic.md (position: 3)
  └── chapters/
      ├── advanced/
      │   └── chapter-name.md
      └── basics/
          └── chapter-name.md
```

**Naming convention:**
- Use kebab-case: `chapter-name.md`
- For numbered chapters: `01-chapter-name.md`, `02-chapter-name.md`
- Keep filenames descriptive but concise

### Step 3: Generate Chapter Frontmatter

Create YAML frontmatter at the top of the file:

```yaml
---
id: $CHAPTER_ID
title: $CHAPTER_TITLE
sidebar_label: $SIDEBAR_LABEL
sidebar_position: $POSITION
description: $DESCRIPTION
tags: [$TAG1, $TAG2, $TAG3]
---
```

**Field guidelines:**
- `id`: Unique identifier, kebab-case, used in URLs and cross-references
- `title`: Full display title shown at top of page
- `sidebar_label`: Shorter label for sidebar (optional, defaults to title)
- `sidebar_position`: Numeric order (lower numbers appear first)
- `description`: Brief summary for SEO and previews (1-2 sentences)
- `tags`: Keywords for categorization and search

### Step 4: Create Chapter Structure Template

Generate the base structure:

```markdown
---
id: $CHAPTER_ID
title: $CHAPTER_TITLE
sidebar_position: $POSITION
description: $DESCRIPTION
---

# $CHAPTER_TITLE

$CHAPTER_INTRODUCTION (1-2 paragraphs introducing the chapter topic and what readers will learn)

## Overview

Brief overview of what this chapter covers:
- Key point 1
- Key point 2
- Key point 3

## Main Content Sections

### Section 1: $SECTION_TITLE

Content here...

```$LANGUAGE
// Code example with proper syntax highlighting
const example = "code block";
```

:::note
Use admonitions for important callouts
:::

### Section 2: $SECTION_TITLE

Content here...

## Key Takeaways

- Main point 1
- Main point 2
- Main point 3

## Next Steps

What readers should do next or which chapter to read next.

See also:
- [Related Chapter](./related-chapter.md)
- [Another Topic](./another-topic.md)
```

### Step 5: Add Chapter-Specific Enhancements

Based on chapter topic, add relevant features:

**For code-heavy chapters:**
```markdown
```jsx title="src/components/Example.jsx"
import React from 'react';

export default function Example() {
  return <div>Example</div>;
}
```
```

**For comparison content:**
```markdown
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="js" label="JavaScript">
    ```js
    console.log('Hello');
    ```
  </TabItem>
  <TabItem value="ts" label="TypeScript">
    ```ts
    console.log('Hello' as string);
    ```
  </TabItem>
</Tabs>
```

**For warnings/tips:**
```markdown
:::tip Pro Tip
This is a helpful tip for advanced users.
:::

:::warning Important
Pay attention to this critical information.
:::

:::danger Warning
This could cause problems if not handled correctly.
:::
```

### Step 6: Write the Chapter File

**CRITICAL**: You MUST use the **Write** tool to save the content to the filesystem. Simply describing the file or using bash commands to create empty files is insufficient.

1. Create the directory structure if missing using bash `mkdir -p`.
2. Use the **Write** tool with the full path and the complete synthesized content.

```bash
# Example for organized chapters
mkdir -p docs/module-name
```


### Step 7: Update Sidebar Configuration (if manual)

If using manual sidebar configuration in `sidebars.js`:

```javascript
module.exports = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '$CATEGORY_LABEL',
      items: [
        '$CHAPTER_ID',
        // ... other chapters
      ],
    },
  ],
};
```

### Step 8: Validate Chapter

Run validation checks:

```bash
# Build the site to check for errors
npm run build

# Start dev server to preview
npm run start
```

Check for:
- No broken links
- Proper sidebar rendering
- Code blocks render with syntax highlighting
- Frontmatter is correctly parsed

## OUTPUT STRUCTURE

Present results in this format:

```
✅ Chapter created: $CHAPTER_TITLE

📄 File: docs/$PATH/$CHAPTER_ID.md
📍 Sidebar position: $POSITION
🏷️  Tags: $TAG1, $TAG2, $TAG3

📖 Chapter structure:
   - Introduction
   - X main sections
   - Y code examples
   - Key takeaways
   - Cross-references

🔗 Navigation:
   - Previous: [Previous Chapter Title](link)
   - Next: [Next Chapter Title](link)

✓ Frontmatter validated
✓ Markdown syntax verified
✓ Build completes successfully

🚀 Preview at: http://localhost:3000/docs/$CHAPTER_ID
```

## PLACEHOLDERS TO COLLECT

Ask the user if not provided in $ARGUMENTS:

- `$CHAPTER_TITLE`: Full chapter title
- `$CHAPTER_ID`: Unique identifier (or auto-generate from title)
- `$POSITION`: Sidebar position number
- `$DESCRIPTION`: Brief chapter description
- `$CATEGORY`: Optional category/section grouping
- `$TAGS`: Array of relevant tags

## AUTO-GENERATION RULES

**For chapter ID:**
```javascript
// Convert title to kebab-case ID
const generateId = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};
```

**For sidebar position:**
- If not specified, find highest existing position and add 1
- Suggest positions in increments of 10 to allow easy insertion later

## ERROR HANDLING

**If file already exists:**
- Warn user and ask if they want to overwrite
- Suggest using a different ID or filename
- Offer to backup existing file

**If frontmatter validation fails:**
- Display specific validation errors
- Provide corrected frontmatter
- Explain what each field should contain

**If build fails after adding chapter:**
- Show build error output
- Check for common issues: broken links, invalid frontmatter, syntax errors
- Provide specific fix recommendations

## QUALITY CHECKS

Before completing:
- [ ] File created in correct location
- [ ] Frontmatter contains all required fields
- [ ] Heading hierarchy is proper (h1 -> h2 -> h3)
- [ ] Code blocks have language identifiers
- [ ] Internal links use relative paths
- [ ] `npm run build` succeeds
- [ ] Chapter appears in sidebar at correct position

## TONE

Be instructive and detail-oriented. Explain markdown best practices and Docusaurus-specific features that enhance the chapter.
