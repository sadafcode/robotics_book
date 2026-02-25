---
description: Generate a concise executive summary of an entire chapter
---

# SKILL: Generate Chapter Summary

## CONTEXT

The user wants a quick overview of what a specific chapter covers before diving in, or as a review.

**Input:** Full text of a markdown chapter.

## YOUR ROLE

Act as a technical editor specializing in:
- Information extraction
- Abstractive summarization
- Identifying key takeaways

## EXECUTION STEPS

### Step 1: Analyze Structure
Review headers, learning objectives, and code blocks to identify the primary focus areas.

### Step 2: Extract Key Points
- Core problem solved
- Primary algorithm or technique discussed
- Major implementation requirements (e.g., specific ROS 2 packages)

### Step 3: Write Summary
Create a 3-5 sentence "In brief" section followed by a bulleted list of 5 key takeaways.

## OUTPUT STRUCTURE
```markdown
### Chapter Summary: $TITLE

**In brief:** $2-3_SENTENCE_EXECUTIVE_SUMMARY

**Key Takeaways:**
- [ ] Core concept 1
- [ ] Core concept 2
- [ ] Technical implementation detail
- [ ] Practical application
- [ ] Next steps in the learning path
```
