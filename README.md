Understood. You do not want a hardcoded “Savings Advisor agent.” You want a low-code / no-code AI UX Research Agent platform where future product teams can configure a new product workflow without engineering changes.

The right design is:

Build a configurable AI Research Agent framework where product teams define product context, screens, personas, risk checklists, interview templates, and output report formats through configuration — not code.

⸻

1. Target Vision

AI UX Research Agent Builder

A platform where a UX/Product user can onboard any new product by filling out configurations like:

Product Name: Benefits Overview
Journey: Member reviews pharmacy benefit coverage
Screens: Landing, Coverage Details, Pharmacy Options, Confirmation
Risk Areas: Cost clarity, coverage terminology, eligibility, next steps
Personas: Senior member, caregiver, low digital literacy, cost-sensitive member
Output Needed: Study plan, interview guide, simulated review, report draft

Then the agent automatically generates:

* Study plan
* Persona set
* Recruiting criteria
* Interview guide
* Prototype risk review
* PBM-specific findings
* Post-interview synthesis
* Report draft
* Jira-ready follow-up stories

No new code should be needed for each product.

⸻

2. Core Principle

Do not build one monolithic agent.

Build a metadata-driven agent platform.

Configuration + Templates + Knowledge Base + Agent Tools = Product-Specific Research Agent

For every future product, the team should configure:

1. Product profile
2. Journey profile
3. Screen inventory
4. Risk checklist
5. Persona selection rules
6. Research objectives
7. Interview guide template
8. Report template
9. Human approval rules

The same agent engine uses those configurations to behave like a product-specific UX research copilot.

⸻

3. High-Level Architecture

UX Research Agent Portal
        |
        v
Product Configuration UI
        |
        v
Agent Configuration Store
        |
        v
Agent Orchestrator
        |
        +--> Persona Builder
        +--> Study Planner
        +--> Prototype Reviewer
        +--> PBM Risk Reviewer
        +--> Interview Guide Generator
        +--> Research Synthesis Agent
        +--> Report Generator
        |
        v
LiteLLM Gateway
        |
        v
Internal Approved LLM
        |
        v
Outputs
        +--> Confluence
        +--> Jira
        +--> PowerPoint
        +--> Research Repository

⸻

4. What Needs to Be Configurable

Product Configuration

This defines the product being reviewed.

{
  "product_id": "savings-advisor",
  "product_name": "Savings Advisor",
  "domain": "PBM Member Experience",
  "supported_journeys": [
    "Medication savings recommendation",
    "Pharmacy switch",
    "90-day supply recommendation",
    "Alternative medication recommendation"
  ],
  "default_personas": [
    "cost_sensitive_member",
    "caregiver",
    "medication_switch_skeptic",
    "senior_low_digital_confidence"
  ],
  "default_risk_categories": [
    "cost_clarity",
    "savings_trust",
    "doctor_involvement",
    "coverage_rules",
    "next_step_clarity"
  ]
}

For a future product, the user creates a new config:

{
  "product_id": "claims-status",
  "product_name": "Claims Status",
  "domain": "PBM Member Experience",
  "supported_journeys": [
    "Member reviews claim status",
    "Member understands denial reason",
    "Member views next steps"
  ],
  "default_personas": [
    "low_health_literacy_member",
    "caregiver",
    "senior_low_digital_confidence"
  ],
  "default_risk_categories": [
    "status_clarity",
    "denial_reason_clarity",
    "next_step_clarity",
    "trust",
    "plain_language"
  ]
}

No code change.

⸻

5. Low-Code / No-Code Admin Screens

You should build an internal admin UI with these screens.

1. Product Setup

Fields:

Product name
Product description
Domain
Target users
Business goal
Supported journeys
Default output types
Required reviewers

Example:

Product: Savings Advisor
Domain: PBM Member Website
Goal: Help members reduce prescription costs
Reviewers: UX, Product, Accessibility, Compliance when cost/coverage is mentioned

⸻

2. Journey Setup

A product can have multiple journeys.

Example journeys:

Savings Advisor
- Landing page recommendation
- Rx configuration
- Medication details
- Confirmation / doctor handoff
Benefits Overview
- View coverage
- Understand deductible
- Review pharmacy network
- Understand copay
Claims Status
- View claim result
- Understand rejected claim
- Find next steps

Each journey has:

{
  "journey_name": "Alternative medication recommendation",
  "user_goal": "Understand lower-cost medication options",
  "business_goal": "Help member reduce prescription cost",
  "expected_user_action": "Review options and continue",
  "known_confusion_points": [
    "Member may expect to select one medication",
    "Member may expect to finalize the change online",
    "Member may not understand doctor involvement"
  ]
}

⸻

3. Screen Inventory Setup

The user should define screens without code.

{
  "screen_name": "Rx Configuration",
  "screen_type": "Review and configuration",
  "screen_purpose": "Allow member to review medication, supply, and pharmacy selections",
  "primary_cta": "Continue",
  "expected_member_understanding": [
    "Medication choice affects cost",
    "Supply length affects cost",
    "Pharmacy affects cost",
    "Some changes may require doctor action"
  ],
  "risk_categories": [
    "cost_clarity",
    "doctor_involvement",
    "selection_expectation"
  ]
}

⸻

4. Persona Library Setup

This is a reusable no-code persona library.

Each persona should be configurable:

{
  "persona_id": "medication_switch_skeptic",
  "persona_name": "Medication-Switch Skeptic",
  "description": "Member is cautious about changing medications and needs strong trust signals.",
  "attributes": {
    "digital_comfort": "Medium",
    "health_literacy": "Medium",
    "cost_sensitivity": "High",
    "trust_level": "Low"
  },
  "likely_questions": [
    "Why is my insurance company recommending this?",
    "Is this medication as effective?",
    "Will my doctor approve this?"
  ],
  "usability_risks": [
    "May distrust large price differences",
    "May dislike company-preferred language",
    "May need doctor reassurance"
  ]
}

For future products, users can select existing personas or create new personas through UI.

⸻

5. Persona Selection Rules

This is where automation comes in.

Instead of manually selecting personas every time, define rules.

Example:

{
  "rule_name": "Medication switching persona rule",
  "if_risk_categories_include": [
    "medication_switching",
    "doctor_involvement"
  ],
  "then_include_personas": [
    "medication_switch_skeptic",
    "doctor_dependent_decision_maker",
    "cost_sensitive_member"
  ]
}

Another example:

{
  "rule_name": "Cost comparison persona rule",
  "if_screen_contains": [
    "cost",
    "savings",
    "copay",
    "price"
  ],
  "then_include_personas": [
    "cost_sensitive_member",
    "senior_low_digital_confidence",
    "low_health_literacy_member"
  ]
}

This lets the platform automatically build personas for future products.

⸻

6. Risk Checklist Configuration

This is the most important reusable asset.

You need a configurable Risk Taxonomy.

PBM Risk Categories

Cost Clarity
Savings Trust
Medication Switching
Coverage Rules
Eligibility
Doctor Involvement
Pharmacy Selection
Supply Length
Confirmation / Next Steps
Plain Language
Accessibility
Compliance
Trust

Each risk category should have reusable questions.

Example:

{
  "risk_category": "Cost Clarity",
  "review_questions": [
    "Is it clear whether the amount shown is what the member pays or what the member saves?",
    "Is the time period clear: per fill, monthly, annual, or future refill?",
    "Is the cost estimated or guaranteed?",
    "Does the design explain why the cost changes?",
    "Could the cost difference create distrust?"
  ],
  "requires_compliance_review": true,
  "default_severity": "High"
}

Medication switching:

{
  "risk_category": "Medication Switching",
  "review_questions": [
    "Is it clear whether the member is switching to a generic, biosimilar, or lower-cost alternative?",
    "Is it clear whether the member is selecting one medication or reviewing multiple options?",
    "Is doctor approval required?",
    "Does the language avoid implying clinical equivalence unless approved?"
  ],
  "requires_compliance_review": true,
  "default_severity": "High"
}

Future products can reuse these risk categories or add new ones.

⸻

7. Prompt Template Configuration

Do not hardcode prompts in code. Store them as versioned templates.

Example templates:

study_plan_template_v1
persona_generation_template_v1
prototype_review_template_v1
interview_guide_template_v1
research_synthesis_template_v1
report_generation_template_v1

Each product can use default templates or override sections.

Example:

{
  "template_id": "prototype_review_template_v1",
  "product_id": "savings-advisor",
  "sections": [
    "member_comprehension",
    "cost_clarity",
    "medication_switching",
    "doctor_involvement",
    "trust",
    "next_step_expectations"
  ]
}

This makes it low-code because adding a new product means selecting template sections, not writing backend code.

⸻

8. Output Template Configuration

The report format should also be configurable.

For Savings Advisor:

{
  "report_template": "savings_advisor_usability_report",
  "sections": [
    "Title",
    "Background & Methodology",
    "Objectives",
    "Participants",
    "Usability",
    "Landing Page Versions",
    "Version A Findings",
    "Version B Findings",
    "Rx Configuration",
    "Medication Details",
    "Confirmation",
    "Interview Findings",
    "Key Takeaways"
  ]
}

For Claims Status:

{
  "report_template": "claims_status_usability_report",
  "sections": [
    "Title",
    "Background",
    "Objectives",
    "Participant Mix",
    "Claim Status Comprehension",
    "Denial Reason Clarity",
    "Next Step Understanding",
    "Trust Concerns",
    "Recommendations"
  ]
}

Again, no code change.

⸻

9. Recommended Platform Components

A. Configuration UI

Used by UX/Product to define product-specific agent behavior.

Capabilities:

Create product profile
Create journey
Define screens
Select risk categories
Select personas
Configure interview guide sections
Configure output report template
Define approval workflow

⸻

B. Configuration Store

Use database tables or JSONB.

Suggested tables:

products
journeys
screens
persona_library
persona_selection_rules
risk_categories
risk_questions
prompt_templates
report_templates
approval_rules
agent_runs
human_reviews

Postgres JSONB is a good fit.

⸻

C. Agent Runtime

This is the shared execution engine.

It reads configuration and dynamically builds the agent task.

Input request
   ↓
Load product config
   ↓
Load journey config
   ↓
Load screen config
   ↓
Select personas
   ↓
Select risk checklist
   ↓
Retrieve relevant knowledge
   ↓
Build prompt
   ↓
Call LiteLLM
   ↓
Validate output with Pydantic
   ↓
Store audit record
   ↓
Return structured output

⸻

D. Knowledge Base / RAG

Store internal knowledge:

Prior usability reports
PBM glossary
UX content standards
Accessibility standards
Design system rules
Compliance language rules
Product-specific rules

Each document should be tagged:

{
  "document_name": "FBO Savings Advisor Interview Report",
  "product": "Savings Advisor",
  "journey": "Medication savings",
  "risk_tags": [
    "cost_clarity",
    "doctor_involvement",
    "medication_switching",
    "confirmation"
  ],
  "persona_tags": [
    "cost_sensitive_member",
    "medication_switch_skeptic"
  ]
}

⸻

10. Low-Code Product Onboarding Flow

This is the future-state workflow.

Step 1: Create Product
        |
Step 2: Define Journeys
        |
Step 3: Add Screen Inventory
        |
Step 4: Select Risk Categories
        |
Step 5: Select / Auto-generate Personas
        |
Step 6: Choose Output Templates
        |
Step 7: Define Approval Workflow
        |
Step 8: Run Agent

Example for a new product:

Product: Digital Benefits Summary
Journey: Member understands pharmacy coverage
Screens: Overview, Deductible, Copay, Pharmacy Network
Risk Categories: Coverage clarity, cost clarity, terminology, next steps
Personas: New member, caregiver, senior, low health literacy
Output: Study plan + interview guide + prototype review

No engineering team needs to build a new agent.

⸻

11. Agent Types You Need

You can have one orchestrator and multiple reusable sub-agents.

1. Product Intake Agent

Validates whether enough information exists.

Output:

Missing data
Ambiguous areas
Required reviewers
Suggested risk categories
Suggested personas

⸻

2. Persona Builder Agent

Uses persona library and rules.

Output:

Recommended personas
Why each persona matters
Likely questions
Likely friction points
Recruiting criteria

⸻

3. Study Planning Agent

Output:

Background
Methodology
Research objectives
Research hypotheses
Participant criteria

⸻

4. Prototype Risk Agent

Output:

Predicted usability risks
PBM-specific issues
CTA clarity issues
Trust risks
Accessibility concerns

⸻

5. Interview Guide Agent

Output:

Moderator questions
Screen-level tasks
Follow-up probes
Objective mapping

⸻

6. Research Synthesis Agent

Output:

Themes
Quotes
Screen findings
A/B comparison
Sentiment
Evidence strength

⸻

7. Report Generator Agent

Output:

PowerPoint sections
Confluence summary
Jira recommendations
Executive summary

⸻

12. Data Model for Low-Code Configuration

Product Config

class ProductConfig(BaseModel):
    product_id: str
    product_name: str
    domain: str
    description: str
    default_persona_ids: list[str]
    default_risk_category_ids: list[str]
    default_report_template_id: str
    required_review_roles: list[str]

Journey Config

class JourneyConfig(BaseModel):
    journey_id: str
    product_id: str
    journey_name: str
    user_goal: str
    business_goal: str
    expected_user_action: str
    known_confusion_points: list[str]
    default_screen_sequence: list[str]

Screen Config

class ScreenConfig(BaseModel):
    screen_id: str
    journey_id: str
    screen_name: str
    screen_type: str
    screen_purpose: str
    primary_cta: str | None
    expected_member_understanding: list[str]
    risk_category_ids: list[str]

Risk Category Config

class RiskCategoryConfig(BaseModel):
    risk_category_id: str
    name: str
    description: str
    review_questions: list[str]
    default_severity: Literal["Low", "Medium", "High", "Critical"]
    requires_compliance_review: bool
    requires_accessibility_review: bool

Persona Config

class PersonaConfig(BaseModel):
    persona_id: str
    name: str
    description: str
    attributes: dict
    goals: list[str]
    likely_questions: list[str]
    likely_friction_points: list[str]
    recruiting_value: str

Report Template Config

class ReportTemplateConfig(BaseModel):
    report_template_id: str
    name: str
    sections: list[str]
    required_sections: list[str]
    optional_sections: list[str]

⸻

13. Runtime Request Model

When someone wants to run the agent:

{
  "product_id": "savings-advisor",
  "journey_id": "alternative-medication-recommendation",
  "prototype_artifacts": [
    {
      "type": "figma",
      "url": "figma-link"
    },
    {
      "type": "screenshot",
      "file_id": "uploaded-file"
    }
  ],
  "requested_outputs": [
    "study_plan",
    "persona_recommendation",
    "interview_guide",
    "prototype_risk_review"
  ],
  "overrides": {
    "include_personas": [
      "caregiver",
      "medication_switch_skeptic"
    ],
    "additional_risks": [
      "doctor involvement"
    ]
  }
}

⸻

14. No-Code Configuration Example

A UX researcher should be able to fill something like this:

Create New Research Agent Configuration
Product Name:
Claims Status
Journey:
Member views rejected prescription claim
Screens:
1. Claim Summary
2. Rejection Reason
3. Next Steps
4. Contact Support
Main Risks:
[x] Coverage clarity
[x] Denial reason clarity
[x] Plain language
[x] Trust
[x] Next step clarity
Personas:
[x] Low health literacy member
[x] Senior member
[x] Caregiver
[x] New member
Outputs:
[x] Study plan
[x] Interview guide
[x] Prototype risk review
[x] Report draft
Human Review:
[x] UX required
[x] Product required
[x] Compliance required if cost/coverage language appears

Then the platform generates the agent run.

⸻

15. Implementation Approach with Pydantic AI + AgentCore + LiteLLM

Use:

FastAPI backend
Pydantic AI agents
AgentCore orchestration
LiteLLM for model access
Postgres JSONB for configurations
OpenSearch or vector DB for RAG
S3 or internal document store for artifacts
Jira/Confluence integrations later

Execution Flow

POST /agent-runs
        |
        v
Load product configuration
        |
        v
Validate intake
        |
        v
Resolve personas from rules
        |
        v
Resolve risk checklist
        |
        v
Retrieve knowledge docs
        |
        v
Build prompt from templates
        |
        v
Call LiteLLM
        |
        v
Validate with Pydantic output schema
        |
        v
Store run + audit
        |
        v
Return structured result

⸻

16. First MVP for Low-Code / No-Code

Do not start with full no-code everything.

Start with configuration-driven MVP.

MVP Scope

Build a UI/API where admin can configure:

Product
Journey
Screens
Risk categories
Personas
Output type
Review workflow

Then support these outputs:

1. Persona recommendation
2. Study plan
3. Interview guide
4. Prototype risk review

Leave post-interview synthesis and PowerPoint generation for phase 2.

⸻

17. MVP Screens

Screen 1: Product Setup

Product Name
Domain
Description
Default personas
Default risk categories
Required reviewers

Screen 2: Journey Setup

Journey Name
User Goal
Business Goal
Expected User Action
Known Confusion Points

Screen 3: Screen Setup

Screen Name
Purpose
CTA
Expected Member Understanding
Risk Categories

Screen 4: Run Agent

Select Product
Select Journey
Upload Screenshot / Figma Link
Choose Outputs
Run Agent

Screen 5: Review Output

Generated Study Plan
Generated Personas
Generated Interview Guide
Generated Risk Review
Accept / Reject / Edit
Export

⸻

18. Stories to Build

Story 1: Build Configurable Product Intake Framework

User Story

As a UX research admin,
I want to configure a product, journey, screens, personas, and risk categories,
so that the AI UX Research Agent can support new products without code changes.

Acceptance Criteria

1. User can create a product profile.
2. User can create journeys under a product.
3. User can define screen inventory for a journey.
4. User can assign risk categories to screens.
5. User can assign default personas to a product or journey.
6. Configuration is stored and versioned.
7. Agent can load configuration at runtime.
8. No code change is required to add a new product configuration.

⸻

Story 2: Build Reusable Persona Library

User Story

As a UX researcher,
I want to maintain a reusable persona library,
so that future product studies can automatically select relevant personas.

Acceptance Criteria

1. User can create and edit personas.
2. Persona includes goals, likely questions, friction points, and recruiting value.
3. Persona can be tagged by domain, risk area, and journey type.
4. Agent can recommend personas based on selected risk categories.
5. UX researcher can override selected personas.

⸻

Story 3: Build Configurable Risk Taxonomy

User Story

As a UX/product team,
I want to configure reusable PBM risk categories,
so that prototype reviews are consistent across products.

Acceptance Criteria

1. User can create risk categories.
2. Each risk category includes review questions.
3. Risk category can define default severity.
4. Risk category can trigger compliance/accessibility review.
5. Risk category can be assigned to product, journey, or screen.
6. Agent uses assigned risk categories during prototype review.

⸻

Story 4: Build Agent Run Engine

User Story

As a UX researcher,
I want to run the AI Research Agent using configured product metadata,
so that I can generate study plans, personas, interview guides, and risk reviews.

Acceptance Criteria

1. User can select product and journey.
2. User can upload prototype artifacts or provide Figma link.
3. User can select requested outputs.
4. System loads personas, risk categories, screens, and prompt templates dynamically.
5. Agent generates structured output using Pydantic schemas.
6. Output is stored with request ID.
7. Prompt version, model, and retrieved knowledge are logged.

⸻

Story 5: Build Human Review Workflow

User Story

As a UX lead or product owner,
I want to review and approve AI-generated findings,
so that final research artifacts remain human-owned and auditable.

Acceptance Criteria

1. AI output starts in Draft status.
2. Reviewer can accept, reject, or edit each finding.
3. Reviewer can add comments.
4. Compliance/accessibility review can be triggered by configured rules.
5. Final approved output is stored separately from raw AI output.
6. Audit history is maintained.

⸻

19. Requirement Summary

Your system should support these capabilities:

1. Configure new products without code.
2. Configure journeys and screens.
3. Maintain reusable persona library.
4. Auto-select personas based on product risks.
5. Maintain reusable PBM risk taxonomy.
6. Generate study plans.
7. Generate interview guides.
8. Generate simulated prototype risk reviews.
9. Store all outputs with audit traceability.
10. Support human approval workflow.
11. Reuse prior research and standards through RAG.
12. Export outputs to Jira, Confluence, or report format.

⸻

20. Recommended First Build

Start with this:

Low-Code AI Research Agent MVP

Product Config + Persona Library + Risk Taxonomy + Agent Run Engine

Do not start with Figma integration or PowerPoint generation first.

Your first deliverable should prove this:

A UX researcher can onboard a new product by configuration, upload a prototype screenshot, and generate a study plan, persona set, interview guide, and PBM risk review without engineering involvement.

That is the correct foundation for future products.