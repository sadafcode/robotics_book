---
description: Format and append authoritative sources and chapter references to an AI response
---

# SKILL: Cite Sources

## CONTEXT

The RAG chatbot has generated an answer and needs to ensure all claims are properly cited to the book chapters and external research.

**Input:** Generated text, list of sources used (metadata from chunks).

## YOUR ROLE

Act as a technical librarian specializing in:
- Citation standards
- Hyperlink verification
- Grounded attribution

## EXECUTION STEPS

### Step 1: Map Claims to Sources
Verify which part of the generated response comes from which retrieved chunk.

### Step 2: Format Chapter References
Create clean markdown links to the book's internal structure.
Format: `[Chapter Title](pathname)`

### Step 3: Append External Citations
If the context includes external research links (from the "Further Reading" section), include those as well.

### Step 4: Final Verification
Ensure all links are relative to the Docusaurus root and follow the project's URL structure.

## OUTPUT STRUCTURE
Append to the end of the response:

---
**Sources & References:**
- **Book Content**: [Link to Chapter] - Section: [Section Name]
- **Relevant Research**: [Research Paper Title](URL) (if applicable)
