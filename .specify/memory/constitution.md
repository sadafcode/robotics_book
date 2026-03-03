<!--
============================================================================
SYNC IMPACT REPORT
============================================================================
Version Change: [NEW] → 1.0.0
Constitution Type: Initial ratification

Modified Principles: None (initial creation)
Added Sections:
  - Core Principles (7 principles)
  - Technology Stack Standards
  - Agent Collaboration Protocol
  - Skills & Reusability
  - Governance

Templates Status:
  ✅ spec-template.md - Aligned (user stories, acceptance criteria)
  ✅ plan-template.md - Aligned (constitution check gate)
  ✅ tasks-template.md - Aligned (test-first, parallel execution)
  ✅ phr-template.prompt.md - Aligned (documentation requirements)

Follow-up TODOs: None

Rationale for v1.0.0:
  - Initial constitution establishing governance for Physical AI Book
    Generation project
  - Defines principles for multi-agent orchestration, Docusaurus-based
    documentation, and AI-driven content creation
  - Establishes tech stack standards (Docusaurus, FastAPI, OpenAI, etc.)
============================================================================
-->

# Physical AI Book Generation Constitution

## Core Principles

### I. Agent-Orchestrated Workflow

**Master Agent Coordination**: The PhysicalAIBookMasterAgent MUST orchestrate all book creation workflows by delegating to specialized sub-agents. Direct implementation by the master agent is prohibited—all specialized work MUST be routed to the appropriate sub-agent (BookGenerationSubAgent for Docusaurus infrastructure, ResearchWriterSubAgent for content creation).

**Clear Agent Boundaries**: Each agent operates within its domain of expertise:
- PhysicalAIBookMasterAgent: Project planning, chapter outlines, quality review
- BookGenerationSubAgent: Docusaurus setup, sidebar config, GitHub Pages deployment
- ResearchWriterSubAgent: Web research, content synthesis, ROS 2 examples, URDF snippets

    - RAGChatbotSubAgent: RAG pipeline operations (chunking, embedding, retrieval, answering)
    - PersonalizationSubAgent: Content personalization based on user background and expertise level

**Rationale**: Specialized agents produce higher-quality outputs in their domains. Orchestration ensures consistent workflows while preventing scope overlap and maintaining separation of concerns.

### II. Skills-First Architecture (NON-NEGOTIABLE)

**Reusable Skills Required**: ALL common operations MUST be implemented as reusable skills in `.claude/skills/`. Direct implementation without skill extraction is prohibited after the skill has been used twice.

**Minimum 24 Skills**: The project MUST maintain at least 24 skills across agents:
- BookGenerationSubAgent: `init_docusaurus_project`, `create_chapter_file`, `generate_sidebar_config`, `deploy_to_github_pages`, `add_module_structure`
- ResearchWriterSubAgent: `web_search_topic`, `synthesize_content`, `generate_ros2_example`, `generate_urdf_snippet`, `create_diagram`, `add_learning_objectives`, `create_quiz_section`
- RAGChatbotSubAgent: `chunk_chapter_content`, `embed_chunks`, `semantic_search`, `generate_answer`, `explain_selected_text`, `generate_chapter_summary`, `cite_sources`
- AuthSubAgent: `betterauth-jwt-setup`, `user-background-collection`, `personalization-level-definition`, `jwt-token-management`, `user-profile-storage`

**Skill Structure**: Each skill MUST include:
- YAML frontmatter with description
- Context explaining when/why to use
- Role definition establishing expertise
- Step-by-step execution instructions
- Output structure template
- Quality checks and error handling
- Best practices and examples

**Rationale**: Skills enable consistent, repeatable operations across the project lifecycle. They serve as executable documentation and reduce cognitive load by encapsulating complex multi-step processes.

### III. Documentation-Driven Development

**Docusaurus as Source of Truth**: All book content MUST be maintained in Docusaurus-compatible markdown with proper frontmatter (`id`, `title`, `sidebar_position`, `description`, `keywords`, `tags`).

**Chapter Quality Standards**: Every chapter MUST include:
- Learning objectives (Bloom's Taxonomy aligned)
- Foundational concepts with clear definitions
- Code examples (ROS 2, Python, URDF where applicable)
- Mermaid diagrams for complex concepts
- Practical applications and use cases
- Assessment questions (quiz section)
- Further reading with authoritative sources

**Sidebar Navigation**: Sidebar configuration MUST be logical, discoverable, and follow one of:
- Auto-generated from directory structure (simple books)
- Manual with categories (complex multi-module books)
- Hybrid approach (categorized sections with auto-generated items)

**Rationale**: Docusaurus provides production-ready documentation sites with excellent DX. Structured chapters ensure consistent learning experiences. Quality standards prevent incomplete or poorly organized content.

### IV. Research-Backed Content (NON-NEGOTIABLE)

**Authoritative Sources Required**: All technical claims MUST be backed by authoritative sources:
- Academic papers (arXiv, IEEE, ACM, major conferences)
- Research lab publications (OpenAI, DeepMind, Meta AI, NVIDIA, etc.)
- Official framework documentation (ROS 2, PyTorch, TensorFlow, Isaac Sim)
- High-quality GitHub implementations (active maintenance, good docs)

**Source Verification**: Claims MUST be cross-referenced across multiple sources. Conflicting information MUST be explicitly noted with evidence for each perspective.

**Citation Standards**:
- Inline links in markdown format `[Source Title](URL)`
- Sources section at end of each chapter
- No invented facts or hallucinated citations
- Uncertainty acknowledged when information cannot be verified

**Rationale**: Physical AI is a rapidly evolving field. Only verified, authoritative information ensures educational content remains accurate and trustworthy. Cross-referencing prevents propagation of errors.

### V. Code Quality & Runnable Examples

**Production-Ready Code**: All code examples MUST be:
- Syntactically correct and executable
- Include proper error handling and logging
- Follow framework best practices (ROS 2 conventions, PEP 8)
- Include inline comments explaining key concepts
- Specify all dependencies explicitly

**ROS 2 Standards**: ROS 2 examples MUST include:
- Complete package structure (`package.xml`, `setup.py`)
- Proper QoS configuration for reliability/performance
- Launch files with parameter configuration
- Usage instructions and validation commands

**URDF Standards**: Robot models MUST include:
- Visual, collision, and inertial properties for all links
- Realistic mass and inertia values (no placeholders)
- Gazebo plugins for sensors (camera, LiDAR, IMU)
- Validation commands (`check_urdf`, RViz visualization)

**Rationale**: Readers learn best from working code they can run and modify. Production-quality examples teach best practices, not just syntax. Runnable code builds confidence and enables hands-on learning.

### VI. Progressive Complexity & Learning Design

**Bloom's Taxonomy Alignment**: Learning objectives MUST span cognitive levels:
- Remember (20%): Definitions, terminology, basic facts
- Understand (30%): Concepts, explanations, relationships
- Apply (30%): Implementation, code examples, procedures
- Analyze/Evaluate (20%): Comparisons, trade-offs, critiques

**Content Progression**: Each chapter MUST follow:
1. Introduction (10%): Hook, context, preview
2. Foundational Concepts (20%): Definitions, background theory
3. Core Technical Content (40%): Algorithms, architectures, details
4. Implementation & Practice (20%): Code, applications, patterns
5. Summary & Resources (10%): Takeaways, further reading

**Assessment Integration**: Chapters SHOULD include quizzes with:
- Mix of question types (MCQ, T/F, code-based, scenarios)
- Detailed explanations for all answers
- Common misconceptions addressed
- Chapter section references for review

**Rationale**: Adult learners need structured progression from simple to complex. Bloom's Taxonomy ensures comprehensive skill development. Assessments reinforce learning and identify gaps.

### VII. Deployment & Accessibility

**GitHub Pages Deployment**: All books MUST be deployable to GitHub Pages with:
- Automated deployment via GitHub Actions (recommended)
- Manual deployment via Docusaurus CLI (fallback)
- Proper `docusaurus.config.js` with correct `baseUrl` and `url`
- Build validation (zero errors/warnings)

**Mobile Responsiveness**: All content MUST render correctly on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet devices (iPad, Android tablets)
- Mobile phones (responsive design, readable text)

**Accessibility Standards**: Documentation MUST follow:
- Semantic HTML headings (h1 → h2 → h3, no skipping)
- Alt text for all images and diagrams
- Color contrast sufficient for readability
- Keyboard navigation support

**Rationale**: GitHub Pages provides free, reliable hosting for open documentation. Mobile responsiveness ensures accessibility for all learners. Accessibility standards make content usable for everyone, including those with disabilities.

## Technology Stack Standards

### Frontend (Docusaurus)

**Framework**: Docusaurus v3.x (latest stable)
- React 18+ for custom components
- Tailwind CSS for custom styling (optional)
- Mermaid.js for diagrams (integrated via plugin)

**Required Plugins**:
- `@docusaurus/preset-classic` (docs, blog, pages)
- `@docusaurus/plugin-content-docs` (for multi-instance docs)
- Mermaid plugin for diagram rendering

**Configuration Standards**:
- TypeScript for config files (recommended)
- Algolia DocSearch for search (production sites)
- Dark mode support enabled
- Navbar with clear navigation
- Footer with copyright and links

### Backend (API & Services)

**Framework**: FastAPI 0.100+ (Python 3.11+)
- Pydantic v2 for data validation
- SQLAlchemy 2.0+ for ORM
- Alembic for migrations

**AI Services**:
- Google Gemini API (for content generation)
- Hugging Face Sentence Transformers (for semantic search embeddings)

**Vector Database**: Qdrant
- Store document embeddings
- Semantic search for related chapters
- Content recommendation engine

**Relational Database**: Neon Postgres
- Serverless Postgres
- User accounts and preferences
- Book metadata and analytics

### Authentication

**Framework**: Better-auth
- JWT token-based authentication
- Refresh token rotation
- Session management
- Role-based access control (RBAC)

**Security Requirements**:
- HTTPS only in production
- Secure cookie settings (httpOnly, secure, sameSite)
- CORS properly configured
- Rate limiting on API endpoints
- Input validation and sanitization

### Development Tools

**Version Control**: Git with conventional commits
- Commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Branches: `main` (production), `develop` (integration), feature branches

**Package Management**:
- npm/yarn for Docusaurus frontend
- Poetry/pip for Python backend
- Lock files committed for reproducibility

**CI/CD**: GitHub Actions
- Automated tests on PR
- Build validation
- Deployment to GitHub Pages
- Dependency updates (Dependabot)

## Agent Collaboration Protocol

### Master Agent Responsibilities

The PhysicalAIBookMasterAgent MUST:
1. **Plan**: Create chapter outlines, define book structure, allocate topics
2. **Delegate**: Route tasks to appropriate sub-agents with clear instructions
3. **Review**: Validate sub-agent outputs for quality, consistency, completeness
4. **Integrate**: Combine outputs into cohesive book structure
5. **Deploy**: Coordinate final build and deployment to GitHub Pages

The master agent MUST NOT:
- Directly create Docusaurus configuration (delegate to BookGenerationSubAgent)
- Write technical content (delegate to ResearchWriterSubAgent)
- Implement skills directly (use existing skills or create new ones)

### Sub-Agent Boundaries

**BookGenerationSubAgent** handles:
- Docusaurus project initialization
- Sidebar configuration and navigation
- Chapter file structure and frontmatter
- Module/section organization
- GitHub Pages deployment setup
- Build validation and testing

**ResearchWriterSubAgent** handles:
- Web search for Physical AI topics
- Content synthesis from research
- ROS 2 code example generation
- URDF robot model snippets
- Mermaid diagram creation
- Learning objectives (Bloom's Taxonomy)
- Quiz/assessment question generation

**PersonalizationSubAgent** handles:
- User background analysis and expertise classification
- Content complexity adjustment based on user level
- Personalized learning path generation
- Adaptive content delivery based on user progress
- Hardware and setup recommendations tailored to expertise
- Progress tracking and personalization updates

### Communication Protocol

**Task Delegation Format**:
```markdown
Agent: BookGenerationSubAgent
Skill: init_docusaurus_project
Arguments:
  - project_name: "physical-ai-fundamentals"
  - github_username: "user"
  - repo_name: "physical-ai-book"
Context: Initialize Docusaurus site for Physical AI book with 10 chapters
```

**Quality Gates**:
- Sub-agent output MUST pass validation before acceptance
- Master agent MUST verify alignment with book outline
- Conflicts/issues escalated to user for decision

**Error Handling**:
- Sub-agents report errors with context and suggested fixes
- Master agent retries with clarified instructions
- After 2 failures, escalate to user with diagnostic info

## Skills & Reusability

### Skill Development Standards

**When to Create a Skill**:
- Operation used 2+ times across agents
- Multi-step process with clear inputs/outputs
- Domain-specific expertise required
- Consistency critical (e.g., frontmatter format)

**Skill Naming Convention**:
- Verb + noun format: `generate_ros2_example`, `create_diagram`
- Lowercase with underscores
- Descriptive (avoid abbreviations)

**Skill Documentation**:
- Description in YAML frontmatter (1-2 sentences)
- Context section (when/why to use)
- Execution steps (numbered, detailed)
- Output structure (template/example)
- Quality checks (validation criteria)

### Skill Catalog (Minimum 12)

**BookGenerationSubAgent (5 skills)**:
1. `init_docusaurus_project` - Initialize Docusaurus site
2. `create_chapter_file` - Create markdown chapter with frontmatter
3. `generate_sidebar_config` - Build sidebar navigation
4. `deploy_to_github_pages` - Deploy to GitHub Pages
5. `add_module_structure` - Add new documentation modules

**ResearchWriterSubAgent (7 skills)**:
1. `web_search_topic` - Research Physical AI topics
2. `synthesize_content` - Convert research to chapter content
3. `generate_ros2_example` - Create ROS 2 code examples
4. `generate_urdf_snippet` - Create URDF robot models
5. `create_diagram` - Generate Mermaid/architecture diagrams
6. `add_learning_objectives` - Add Bloom's Taxonomy objectives
7. `create_quiz_section` - Generate assessment questions

**AuthSubAgent (6 skills)**:
1. `betterauth-jwt-setup` - Initialize BetterAuth with JWT configuration
2. `user-background-collection` - Collect user's technical background during registration
3. `personalization-level-definition` - Define user's expertise level for content adaptation
4. `jwt-token-management` - Handle JWT token generation, validation, and refresh
5. `user-profile-storage` - Store and manage user profile with background information
6. `betterauth-jwt` - Complete BetterAuth JWT authentication implementation with user background collection

**PersonalizationSubAgent (5 skills)**:
1. `user-personalization-analysis` - Analyze user background and classify expertise level
2. `content-adaptation-engine` - Adjust content complexity based on user level
3. `learning-path-generator` - Generate personalized learning paths based on user goals
4. `progressive-content-delivery` - Deliver content adapted to user's technical background
5. `chapter-personalization-control` - Provide manual personalization controls for individual chapters

### Skill Invocation

**From Agent Files**: Use Task tool to invoke skills
```markdown
I'll use the `create_diagram` skill to generate a sensor fusion flowchart.
```

**Skill Composition**: Skills MAY call other skills
- Document dependencies clearly
- Avoid circular dependencies
- Maintain clear execution order

**Skill Evolution**:
- Version skills when breaking changes occur
- Deprecate old versions with migration guide
- Archive obsolete skills (don't delete)

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines. When conflicts arise between this constitution and other documentation (README, CLAUDE.md, etc.), the constitution takes precedence.

### Amendment Process

**Proposal**: Any team member may propose amendments via:
1. Create ADR documenting proposed change
2. Explain rationale and impact
3. Submit for review

**Review Requirements**:
- At least 2 reviewers must approve
- All impacted templates updated
- Migration plan for existing work

**Approval**:
- Amendments require majority approval
- Breaking changes require unanimous approval
- Constitution version MUST be incremented

### Versioning

**Semantic Versioning**: `MAJOR.MINOR.PATCH`
- **MAJOR**: Backward incompatible governance changes, principle removals
- **MINOR**: New principles, sections, or material expansions
- **PATCH**: Clarifications, wording, typo fixes

**Version History**: Maintain changelog of amendments with:
- Version number and date
- List of changes (added/modified/removed)
- Rationale for changes
- Impact on existing work

### Compliance Review

**Specification Review**: All specs MUST verify:
- User stories follow documentation-driven development
- Requirements cite authoritative sources where applicable
- Success criteria include code quality metrics

**Plan Review**: All plans MUST verify:
- Constitution check gate passed
- Agent delegation strategy defined
- Skills identified for reuse

**Task Review**: All tasks MUST verify:
- Skills invoked where applicable
- Code examples meet quality standards
- Documentation updated alongside implementation

**Pull Request Review**: All PRs MUST verify:
- No violations of core principles
- Skills used or created as appropriate
- PHR created for significant work

### Complexity Justification

When constitution principles are violated (e.g., skipping research, hardcoding without skill):
1. Document violation in plan.md Complexity Tracking table
2. Explain why principle cannot be followed
3. Describe simpler alternative and why it was rejected
4. Obtain explicit approval before proceeding

### Continuous Improvement

**Quarterly Review**: Constitution reviewed every 3 months for:
- Principles still relevant to project goals
- New principles needed based on lessons learned
- Outdated sections that can be removed
- Alignment with evolving best practices

**Feedback Loop**:
- Team members encouraged to suggest improvements
- Retrospectives capture constitution pain points
- Amendments proposed based on empirical evidence

---

**Version**: 1.0.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2025-12-31
