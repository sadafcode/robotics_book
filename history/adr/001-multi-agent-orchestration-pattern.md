# ADR-001: Multi-Agent Orchestration Pattern for Physical AI Book Generation

> **Scope**: This ADR documents the architectural decision to use a master-orchestrator pattern with specialized sub-agents for Physical AI book generation, including agent boundaries, communication protocols, and skills-first architecture.

- **Status:** Accepted
- **Date:** 2025-12-31
- **Feature:** Physical AI Book Generation System
- **Context:** Creating a system to generate comprehensive, high-quality technical documentation for Physical AI topics requires coordination of multiple complex tasks: Docusaurus infrastructure setup, web research, content synthesis, code example generation (ROS 2, URDF), diagram creation, and educational content design. A monolithic approach would create a complex, hard-to-maintain system with unclear responsibilities.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Yes - Long-term consequence for system architecture, maintainability, and scalability
     2) Alternatives: Yes - Multiple viable patterns considered (monolithic, microservices, agent-based)
     3) Scope: Yes - Cross-cutting concern affecting all aspects of book generation workflow
-->

## Decision

We will implement a **Master-Orchestrator Pattern with Three Specialized Agents**:

### Agent Architecture

**PhysicalAIBookMasterAgent** (Orchestrator):
- **Responsibilities**: Project planning, chapter outlines, task delegation, quality review, output integration, deployment coordination
- **Forbidden**: Direct Docusaurus implementation, content writing, skill implementation
- **Communication**: Routes tasks to sub-agents with clear instructions, validates outputs, handles conflicts

**BookGenerationSubAgent** (Docusaurus Infrastructure):
- **Responsibilities**: Docusaurus setup, sidebar configuration, chapter file structure, module organization, GitHub Pages deployment
- **Skills (5)**: `init_docusaurus_project`, `create_chapter_file`, `generate_sidebar_config`, `deploy_to_github_pages`, `add_module_structure`
- **Boundary**: Infrastructure and deployment only, no content creation

**ResearchWriterSubAgent** (Content Creation):
- **Responsibilities**: Web research, content synthesis, ROS 2 examples, URDF snippets, diagrams, learning objectives, assessments
- **Skills (7)**: `web_search_topic`, `synthesize_content`, `generate_ros2_example`, `generate_urdf_snippet`, `create_diagram`, `add_learning_objectives`, `create_quiz_section`
- **Boundary**: Content creation only, no infrastructure work

### Skills-First Architecture

- **Minimum 12 reusable skills** across agents stored in `.claude/skills/`
- Each skill includes: YAML frontmatter, context, execution steps, output structure, quality checks, error handling
- Skills invoked via Task tool, not implemented inline
- Skills are composable but avoid circular dependencies

### Communication Protocol

**Task Delegation Format**:
```markdown
Agent: [SubAgentName]
Skill: [skill_name]
Arguments:
  - param1: value1
  - param2: value2
Context: [Brief description]
```

**Quality Gates**:
- Sub-agent output validated before acceptance
- Master agent verifies alignment with book outline
- Conflicts/issues escalated to user after 2 retry attempts

## Consequences

### Positive

1. **Clear Separation of Concerns**: Each agent has well-defined responsibilities, reducing complexity and cognitive load
2. **Specialization Benefits**: Sub-agents develop deep expertise in their domains (Docusaurus vs. AI content creation)
3. **Reusability**: 12+ skills create consistent, repeatable operations across project lifecycle
4. **Maintainability**: Changes to Docusaurus infrastructure don't affect content generation logic and vice versa
5. **Testability**: Each agent and skill can be tested independently with clear input/output contracts
6. **Scalability**: New capabilities added by creating new skills or agents without modifying existing ones
7. **Quality Consistency**: Skills serve as executable documentation ensuring consistent outputs
8. **Parallel Execution**: Independent agents can work on different chapters/tasks simultaneously
9. **Error Isolation**: Failures in one agent don't cascade to others; master orchestrator handles retries
10. **Knowledge Transfer**: Skills document best practices, reducing onboarding time for new team members

### Negative

1. **Coordination Overhead**: Master agent must manage delegation, validation, and integration across sub-agents
2. **Communication Complexity**: Clear protocols needed to prevent misunderstandings between agents
3. **Initial Setup Cost**: Requires upfront investment to define agent boundaries and create 12+ initial skills
4. **Debugging Challenges**: Issues may span multiple agents, requiring cross-agent debugging
5. **Skill Maintenance**: 12+ skills require updates when frameworks/tools evolve (Docusaurus upgrades, ROS 2 versions)
6. **Learning Curve**: Team members must understand agent boundaries and skill invocation patterns
7. **Potential for Over-Engineering**: Risk of creating too many granular skills for simple operations
8. **State Management**: Master agent must track which sub-agents have completed which tasks
9. **Version Skew**: Skills may have version dependencies that need careful coordination
10. **Testing Complexity**: Integration tests must cover agent interactions, not just individual agents

## Alternatives Considered

### Alternative 1: Monolithic Single-Agent System

**Approach**: Single agent handles all book generation tasks (infrastructure + content + deployment)

**Pros**:
- Simpler architecture with no coordination overhead
- Easier debugging (single agent to trace)
- No inter-agent communication protocols needed
- Faster initial development (no agent boundary design)

**Cons**:
- Massive agent complexity (hundreds of skills/capabilities)
- Poor separation of concerns (Docusaurus mixed with AI research)
- Hard to test individual capabilities
- Difficult to maintain (changes ripple across entire agent)
- Cannot parallelize work effectively
- Steep learning curve for new team members

**Why Rejected**: Violates single responsibility principle. A single agent responsible for both infrastructure (Docusaurus) and domain expertise (Physical AI research) becomes unmanageable at scale. Poor separation makes it hard to evolve Docusaurus infrastructure independently from content quality improvements.

### Alternative 2: Microservices Architecture (Agent per Skill)

**Approach**: 12+ micro-agents, each responsible for a single skill (one agent for ROS 2 examples, one for URDF, one for diagrams, etc.)

**Pros**:
- Maximum granularity and isolation
- Each skill is independently deployable
- Very clear boundaries (one skill = one agent)
- Easy to replace individual agents

**Cons**:
- Extreme coordination overhead (master agent manages 12+ sub-agents)
- Network/communication complexity (12+ agent conversations)
- Over-engineering for current scale (generating books, not serving millions of requests)
- Difficult to compose skills (ROS 2 example generation might need URDF knowledge)
- State management nightmare (tracking 12+ agent states)
- Poor performance (serializing communication with 12+ agents)

**Why Rejected**: Over-engineered for the problem domain. Book generation is not a high-throughput, distributed system needing microservices. The coordination overhead of managing 12+ micro-agents outweighs the isolation benefits. Three agents with multiple skills each strikes a better balance.

### Alternative 3: Hierarchical Agent Tree (Master → Category Agents → Skill Agents)

**Approach**: Master → InfrastructureAgent → (DocusaurusAgent, DeploymentAgent), Master → ContentAgent → (ResearchAgent, CodeAgent, DiagramAgent)

**Pros**:
- More granular than 3 agents, less than 12 micro-agents
- Hierarchical delegation matches human organizational patterns
- Can add intermediate layers for new categories (e.g., TestingAgent, AnalyticsAgent)

**Cons**:
- Additional layer of indirection (master → category → skill agent)
- Unclear where skills belong (is ROS 2 code generation under ContentAgent or CodeAgent?)
- Communication paths become complex (3+ levels deep)
- Difficult to determine optimal hierarchy (what are the "categories"?)
- More agents to maintain (6-8 agents vs. 3)

**Why Rejected**: Unnecessary complexity for current scope. The two-level hierarchy (master + 2 sub-agents) already provides clear categorization: infrastructure (BookGeneration) vs. content (ResearchWriter). Adding a third level doesn't provide proportional benefits and makes the system harder to reason about.

## References

- Constitution: `.specify/memory/constitution.md` (v1.0.0)
  - Principle I: Agent-Orchestrated Workflow
  - Principle II: Skills-First Architecture (NON-NEGOTIABLE)
  - Agent Collaboration Protocol section
  - Skills & Reusability section
- Agent Definitions:
  - `book-master-orchestrator.md` (master agent)
  - `book-generation-sub-agent.md` (Docusaurus infrastructure)
  - `physical-ai-research-writer.md` (AI content creation)
- Skills Catalog: `.claude/skills/` (12 skills defined)
- Related ADRs: None (this is ADR-001)
- Evaluator Evidence: PHR-001 (constitution ratification) - documents governance framework for multi-agent coordination

## Implementation Notes

**Agent Boundaries Enforcement**: Constitution Principle I makes direct implementation by master agent a violation. All specialized work MUST be routed to appropriate sub-agents.

**Skill Creation Trigger**: After an operation is used twice, it MUST be extracted into a reusable skill per Principle II (NON-NEGOTIABLE).

**Quality Gates**: Sub-agent outputs validated against:
- Constitution compliance (e.g., research-backed content, production-ready code)
- Book outline alignment
- Skill execution standards

**Error Handling Protocol**:
1. Sub-agent reports error with context and suggested fix
2. Master agent retries with clarified instructions
3. After 2 failures, escalate to user with diagnostic info

**Future Evolution**: New agents can be added (e.g., TestingAgent for running ROS 2 examples, AnalyticsAgent for tracking content quality metrics) without modifying existing agent boundaries. Skills can be versioned and deprecated following semantic versioning.
