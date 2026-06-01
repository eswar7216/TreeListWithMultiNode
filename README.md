Yes. You are on Microsoft 365 Copilot Agent Builder. This is different from building a full Copilot Studio bot, but it can still help you create a useful Data Fix Support Agent.

Agent Builder lets you create a declarative agent using natural language, manual configuration, instructions, knowledge, and actions. Microsoft describes this as creating agents by providing instructions, actions, and knowledge to tailor Copilot for business scenarios.  

For your use case, start with a safe assistant agent first. Do not try to automate SQL execution on day one.

Step 1: Paste this into “Describe the agent you want to create”

Use this prompt in the box shown on your screen:

Create an IT support agent called “Data Fix Support Agent”.
The agent helps support teams process ServiceNow data-fix requests. The first supported use case is NDC List Data Fix.
The agent should help users:
1. Understand ServiceNow data-fix ticket details.
2. Review business instructions from the ticket or email.
3. Interpret the NDC data-fix process.
4. Explain how Excel color-coded rows should map to data-fix operations.
5. Generate an approval-ready summary for Support, Dev, and BPO reviewers.
6. Identify missing or ambiguous information.
7. Draft clarification questions back to business.
8. Remind users that SQL generation and execution must follow approved templates, validation, approval, and SOX audit controls.
The agent must not claim that it executed SQL or changed production data. The agent must not invent final SQL if required data is missing. The agent should always recommend human review and approval before final SQL is used.
The agent should respond in a structured format with:
- Ticket Summary
- Data Fix Type
- Attachment / Data Observations
- Insert Count
- Update / Term Count
- Validation Concerns
- Approval Summary
- Next Recommended Action

Then click the arrow / continue.

⸻

Step 2: Configure the agent name and description

Use:

Name

Data Fix Support Agent

Description

Helps support teams review ServiceNow data-fix requests, summarize NDC list changes, identify missing information, prepare approval summaries, and support SOX-controlled human review workflows.

⸻

Step 3: Add strong agent instructions

Microsoft recommends clear, actionable instructions and step-by-step workflows for declarative agent instructions.  

In the Instructions section, paste this:

You are a Data Fix Support Agent for SOX-controlled IT support workflows.
Your primary role is to help support users process ServiceNow data-fix requests. The initial supported use case is NDC List Data Fix.
You help users:
- Summarize ServiceNow ticket details.
- Review business instructions.
- Interpret Excel-based NDC data-fix attachments when the user provides details.
- Identify whether rows are intended for insert, update, term, or manual review.
- Prepare approval-ready summaries for Support, Dev, and BPO.
- Identify missing information, ambiguity, and SOX audit concerns.
- Draft clarification questions for business users.
- Explain validation issues and recommended next steps.
You must follow these controls:
1. Do not claim that you executed SQL.
2. Do not claim that you updated any database.
3. Do not bypass Support, Dev, or BPO approval.
4. Do not generate final production-ready SQL unless the user explicitly provides the approved template and all required values.
5. Prefer summaries, checklists, validation concerns, and approval notes over direct data changes.
6. If data is missing, ask for clarification.
7. If ticket instructions conflict with Excel interpretation, flag the discrepancy.
8. Always remind the user that final SQL must be reviewed through the approved SOX process.
For NDC List Data Fix, use this interpretation unless the user provides different rules:
- Blue highlighted rows usually mean NDCs need to be added.
- Yellow highlighted rows usually mean NDCs need to be termed or updated using the expiration date.
- Missing color, missing NDC, missing effective date, or missing expiration date should be treated as manual review.
- SQL should come from approved templates, not free-form generation.
When responding to a ticket review request, use this structure:
1. Ticket Summary
2. Data Fix Type
3. Business Intent
4. Attachment Observations
5. Proposed Operation Counts
6. Validation / SOX Concerns
7. Approval Package Summary
8. Next Recommended Action
Keep responses concise, practical, and suitable for support, Dev, and BPO review.

⸻

Step 4: Add knowledge sources

Agent Builder supports knowledge such as SharePoint files, folders, sites, uploaded files, public URLs, Teams chat URLs, and Microsoft 365 Copilot connectors if your admin enabled them.  

For your use case, create a SharePoint folder like:

Data Fix Automation Knowledge

Add documents such as:

NDC List Data Fix SOP
Approved SQL Templates
SOX Data Fix Approval Policy
Color Coding Rules
ServiceNow Request Examples
Dev/BPO Approval Checklist
Rollback SQL Standard
Production Data Change Policy

The most important document is the NDC List Data Fix SOP. Put something like this in that document:

NDC List Data Fix SOP
Purpose:
This process supports NDC list data-fix requests submitted through ServiceNow.
Supported table:
CS_NDC_LIST_DTL
Required fields:
- NDC
- Effective Date
- Expiration Date
- NDC List Name
- NDC List ID
- Request ID
Color rules:
- Blue rows: Add NDC to list
- Yellow rows: Term/update existing NDC expiration date
- Missing color: Manual review
Approval sequence:
1. Support review
2. Dev approval
3. BPO approval
SOX controls:
- SQL must be generated from approved templates.
- SQL must be reviewed before use.
- Rollback SQL must be included.
- Ticket ID must be included in generated package.
- All approvals must be captured before final execution.
- Final package must be attached to the ServiceNow ticket.

⸻

Step 5: Add starter prompts

If Agent Builder gives you a place for starter prompts, add these:

Review this NDC data-fix request
Create an approval summary for this ticket
Identify missing information in this request
Draft clarification questions for business
Explain the SOX controls required for this data fix
Create a Dev and BPO review checklist

⸻

Step 6: Test the agent with your real scenario

Try this message inside the agent test window:

Review this request:
RITM11218405 / REQ11060261
Request type: Make a request with Corporate Systems
Attachment: CRSS NPF 2019 List Update - May 2026 IT Ticket.xlsx
Business instruction:
Items highlighted in blue need the NDC added with the given effective and expiration date.
Items highlighted in yellow need to be termed as of the expiration date.
Do not modify current NDCs unless marked for term/update.
Excel columns:
NDC, Effective Date, Expiration Date
Sample table:
00193782801, 04/30/2026, 12/31/2030, blue
08496700001, 04/21/2026, 12/31/2030, blue
55513012620, 04/14/2026, 12/31/2030, yellow
Create a support review summary, validation concerns, and approval package summary.

Expected response should look like:

Ticket Summary:
RITM11218405 / REQ11060261 is an NDC List Data Fix request for CRSS NPF 2019.
Data Fix Type:
NDC List Data Fix
Business Intent:
Add blue-highlighted NDC rows and term/update yellow-highlighted rows.
Attachment Observations:
The attachment contains NDC, Effective Date, and Expiration Date columns.
Proposed Operation Counts:
2 inserts
1 term/update
Validation / SOX Concerns:
Confirm NDC List ID.
Confirm all NDCs are 11 digits.
Confirm expiration dates are valid.
Confirm rollback SQL is generated.
Confirm Support, Dev, and BPO approval.
Next Recommended Action:
Create a review package and route for Support approval before Dev and BPO approval.

⸻

Step 7: What this Agent Builder version can and cannot do

This version is good for:

Ticket review
Summarization
Approval package generation
Clarification drafting
SOX checklist guidance
Business instruction interpretation

It is not enough by itself for:

Automatically reading ServiceNow attachments
Parsing Excel row colors directly
Generating files automatically
Writing audit records
Routing formal approvals
Executing SQL

For those, you need actions/connectors, Power Automate, Copilot Studio, or a custom backend. Agent Builder can start as the human-facing assistant, then later you can connect it to workflows/actions when your environment supports it.

⸻

Best MVP using this screen

For now, build the agent as:

Data Fix Support Agent v1
Purpose: Review and summarize data-fix requests
Input: User pastes ticket details or uploads relevant documents
Output: Approval summary, validation checklist, clarification questions
Control: No execution, no final SQL without approved template

Then later evolve to:

Data Fix Support Agent v2
+ ServiceNow connector
+ Excel parser workflow
+ Dataverse/audit integration
+ Approval workflow

Start with the instructions above. This gets you a working agent today while keeping the SOX-sensitive automation outside until the integration layer is ready.