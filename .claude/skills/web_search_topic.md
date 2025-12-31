---
description: Conduct comprehensive web research on Physical AI topics from authoritative sources
---

# SKILL: Web Search for Physical AI Topics

## CONTEXT

The user needs authoritative, up-to-date research on a Physical AI topic for creating technical documentation. This skill systematically searches multiple source types to gather:

- Academic papers and preprints (arXiv, IEEE, ACM)
- Technical blogs and articles from AI research labs
- Open-source implementations and GitHub repositories
- Official framework documentation
- Industry case studies and real-world applications

**Research topic:** $ARGUMENTS (topic name, specific focus areas, depth level)

## YOUR ROLE

Act as a research librarian and domain expert specializing in:
- Physical AI, robotics, and embodied intelligence
- Machine learning and computer vision
- Academic literature search and evaluation
- Technical content curation and source verification
- Current trends in AI research (as of 2025)

## EXECUTION STEPS

### Step 1: Parse Research Requirements

Extract from $ARGUMENTS:
- **Primary topic**: Core subject to research (e.g., "sensor fusion", "transformer models in robotics")
- **Scope**: Specific aspects to focus on (algorithms, implementations, applications)
- **Depth level**: Introductory, intermediate, or advanced
- **Recency requirement**: Prefer sources from last 2-3 years unless foundational
- **Framework preference**: ROS, PyTorch, TensorFlow, Isaac Sim, etc.

### Step 2: Identify Authoritative Source Categories

Plan searches across these source types:

**1. Academic Research:**
- arXiv.org (cs.RO, cs.CV, cs.AI, cs.LG)
- IEEE Xplore
- ACM Digital Library
- Google Scholar
- Conference proceedings (ICRA, IROS, CoRL, NeurIPS, CVPR)

**2. Research Lab Publications:**
- OpenAI Research
- DeepMind Publications
- Meta AI Research (FAIR)
- Google AI Blog
- NVIDIA Research
- UC Berkeley BAIR
- Stanford AI Lab
- MIT CSAIL

**3. Technical Documentation:**
- ROS 2 Documentation
- PyTorch/TensorFlow official docs
- NVIDIA Isaac Sim/Gym docs
- OpenCV documentation
- Robot Operating System Wiki

**4. Open Source & GitHub:**
- Popular repositories related to topic
- Code implementations of papers
- Framework examples and tutorials
- Community projects

**5. Technical Blogs & Tutorials:**
- Towards Data Science
- The Gradient
- Distill.pub
- Papers with Code
- Individual researcher blogs

### Step 3: Execute Systematic Web Searches

Conduct targeted searches using the WebSearch tool:

**Search 1: Academic papers and recent research**
```
Query: "$TOPIC Physical AI 2024 2025 arXiv paper"
```

**Search 2: Implementation and tutorials**
```
Query: "$TOPIC implementation ROS2 PyTorch tutorial"
```

**Search 3: Research lab publications**
```
Query: "$TOPIC OpenAI DeepMind Meta AI research"
```

**Search 4: Framework-specific documentation**
```
Query: "$TOPIC $FRAMEWORK official documentation"
```

**Search 5: Real-world applications**
```
Query: "$TOPIC robotics application case study industry"
```

**Search 6: GitHub implementations**
```
Query: "$TOPIC GitHub implementation code example"
```

### Step 4: Evaluate Source Quality

For each source found, assess:

**Academic Papers:**
- [ ] Published in reputable venue or arXiv with citations
- [ ] Authors affiliated with known institutions
- [ ] Clear methodology and reproducible results
- [ ] Recent (within 2-3 years) or foundational/seminal work

**Code Repositories:**
- [ ] Active maintenance and recent commits
- [ ] Good documentation and README
- [ ] Stars/forks indicating community validation
- [ ] License clearly specified

**Blog Posts/Tutorials:**
- [ ] Author has relevant credentials
- [ ] Technical depth and accuracy
- [ ] Working code examples provided
- [ ] References to primary sources

**Official Documentation:**
- [ ] Current version (not deprecated)
- [ ] Matches framework version being documented
- [ ] Comprehensive API coverage

### Step 5: Extract Key Information

From each high-quality source, extract:

**For Papers:**
- Title, authors, publication venue, year
- Abstract and key contributions
- Novel algorithms or architectures introduced
- Experimental results and benchmarks
- Limitations and future work
- arXiv or DOI link

**For Implementations:**
- Repository URL
- Framework/language used
- Key features and capabilities
- Installation requirements
- Example usage
- License

**For Documentation:**
- Official URL
- Version number
- Key API concepts
- Best practices mentioned
- Example code snippets

### Step 6: Organize Research Findings

Structure findings into categories:

```markdown
## Research Summary: $TOPIC

### Foundational Concepts
- Source 1: [Title](URL) - Key insight
- Source 2: [Title](URL) - Key insight

### Recent Advances (2024-2025)
- Paper 1: [Title](arXiv-link) - Novel contribution
- Paper 2: [Title](DOI) - Performance improvements

### Implementations & Code
- Repo 1: [Name](GitHub-URL) - Description
- Tutorial: [Title](URL) - Practical guide

### Real-World Applications
- Case Study 1: [Title](URL) - Industry application
- Case Study 2: [Title](URL) - Research deployment

### Key Algorithms/Techniques
1. Algorithm A - Brief description (Source)
2. Algorithm B - Brief description (Source)
3. Technique C - Brief description (Source)

### Mathematical Foundations
- Concept 1: Mathematical formulation (Source)
- Concept 2: Optimization approach (Source)

### Open Questions & Limitations
- Challenge 1: Description (Source)
- Debate: Conflicting approaches (Sources A vs B)

### Framework-Specific Resources
- ROS 2 package: [Name](URL)
- PyTorch implementation: [Repo](URL)
- URDF examples: [Resource](URL)
```

### Step 7: Cross-Reference and Validate

Verify information consistency:
- Compare claims across multiple sources
- Note any conflicting information or debates
- Identify consensus views vs. open questions
- Check if code examples match theoretical descriptions
- Validate that mathematical formulations are consistent

Flag uncertainties:
```markdown
:::note Research Note
Multiple approaches exist for $TECHNIQUE. Source A advocates
Method X citing performance, while Source B prefers Method Y
for interpretability. Both are included in this chapter.
:::
```

### Step 8: Identify Content Gaps

Determine what additional searches might be needed:
- [ ] Missing foundational theory explanations
- [ ] Lack of recent benchmarks
- [ ] No production-ready implementations found
- [ ] Limited real-world case studies
- [ ] Mathematical formulations unclear

If gaps exist, conduct additional targeted searches.

## OUTPUT STRUCTURE

Present findings in this format:

```
✅ Research completed: $TOPIC

📊 Sources analyzed:
   - Academic papers: X sources
   - Technical blogs: Y sources
   - Code repositories: Z sources
   - Official documentation: W sources
   - Total authoritative sources: N

🎯 Key findings:
   - Primary algorithms/techniques identified
   - Recent advances (2024-2025) discovered
   - X working code implementations found
   - Y real-world applications documented

📚 Source categories:

### Foundational Papers (must-cite)
1. [Paper Title](URL) - Year - Authors
   - Key contribution: ...
   - Relevance: ...

2. [Paper Title](URL) - Year - Authors
   - Key contribution: ...
   - Relevance: ...

### Recent Advances (2024-2025)
1. [Paper/Blog Title](URL) - Month Year
   - Novel approach: ...
   - Performance gains: ...

### Implementation Resources
1. [Repo Name](GitHub-URL) - Stars: X
   - Framework: ROS2/PyTorch/etc.
   - Features: ...
   - License: MIT/Apache/etc.

### Practical Applications
1. [Case Study Title](URL)
   - Industry: Robotics/Autonomous systems/etc.
   - Challenge solved: ...

### Documentation & Tutorials
1. [Resource Title](URL)
   - Framework version: ...
   - Content type: Tutorial/API docs/Guide

---

💡 Synthesis notes:
   - Consensus view: ...
   - Ongoing debates: ...
   - Recommended approach for chapter: ...
   - Gaps requiring clarification: ...

🔗 All sources with clickable links
✓ Information cross-validated across multiple sources
✓ Recency verified (prefer 2024-2025 sources)
✓ Code examples validated as runnable
```

## SEARCH QUERY TEMPLATES

**For specific algorithms:**
```
"$ALGORITHM_NAME implementation Physical AI robotics"
"$ALGORITHM_NAME arXiv 2024 2025"
"$ALGORITHM_NAME ROS2 GitHub"
```

**For frameworks:**
```
"$FRAMEWORK $TOPIC official documentation"
"$FRAMEWORK $TOPIC tutorial best practices"
"$FRAMEWORK $TOPIC GitHub examples"
```

**For mathematical foundations:**
```
"$TOPIC mathematical formulation derivation"
"$TOPIC optimization algorithm proof"
"$TOPIC computational complexity analysis"
```

**For benchmarks:**
```
"$TOPIC benchmark comparison state of the art"
"$TOPIC performance evaluation ICRA IROS"
"$TOPIC leaderboard dataset results"
```

## RESEARCH QUALITY CRITERIA

**Tier 1 (Highest Priority):**
- Peer-reviewed papers from top venues (ICRA, IROS, NeurIPS, CVPR)
- Official framework documentation (ROS 2, PyTorch, TensorFlow)
- Publications from major AI labs (OpenAI, DeepMind, Meta AI)
- High-quality GitHub repos (1000+ stars, active maintenance)

**Tier 2 (Supporting Sources):**
- arXiv preprints with high citation count
- Technical blogs from recognized experts
- Medium-sized GitHub projects with good documentation
- Tutorial series from reputable platforms

**Tier 3 (Supplementary):**
- Blog posts for practical insights
- Stack Overflow for common pitfalls
- Reddit discussions for community perspective
- YouTube tutorials for visual explanations

## ERROR HANDLING

**If no recent sources found:**
- Expand search to 3-5 year timeframe
- Search for foundational/seminal papers
- Acknowledge in notes: "Topic is mature; recent advances limited"

**If conflicting information discovered:**
- Document all perspectives
- Note the conflict explicitly
- Present evidence for each view
- Recommend approach based on context

**If only theoretical sources, no implementations:**
- Note gap in research summary
- Consider whether pseudocode would suffice
- Flag for potential custom implementation

**If sources are behind paywalls:**
- Search for arXiv preprints
- Look for author's personal website
- Check university repositories
- Use DOI to find open-access versions

## QUALITY CHECKS

Before completing:
- [ ] At least 5-10 high-quality sources identified
- [ ] Mix of theoretical and practical sources
- [ ] Recent sources (2024-2025) included where available
- [ ] Code implementations found and validated
- [ ] All URLs tested and accessible
- [ ] Sources categorized appropriately
- [ ] Synthesis notes identify key themes
- [ ] Gaps and limitations acknowledged

## ETHICAL CONSIDERATIONS

- Always respect copyright and licensing
- Cite all sources appropriately
- Don't scrape paywalled content
- Acknowledge author contributions
- Note conflicts of interest if apparent
- Verify claims before accepting as fact

## TONE

Be thorough and scholarly. Present research findings objectively, noting both consensus views and ongoing debates. Provide enough detail for the content writer to create accurate, well-sourced technical documentation.
