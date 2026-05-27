Below is a detailed design you can use as a starting architecture.

## 1. System context

```plantuml
@startuml
title SOX-Controlled Data Fix Automation - Context

actor BusinessUser as Business
actor SupportUser as Support
actor DevApprover as Dev
actor BPOApprover as BPO

rectangle "ServiceNow" as SN
rectangle "Data Fix Automation Platform" as Platform
database "Audit DB" as Audit
database "Target App DB\nCS_NDC_LIST_DTL" as TargetDB
rectangle "Email/Teams Notification" as Notify

Business --> SN : Create data-fix request\nAttach Excel
SN --> Platform : Ticket + Attachment
Platform --> Support : Review generated package
Support --> Platform : Approve / Reject / Edit
Platform --> Dev : Dev approval request
Dev --> Platform : Approve / Reject
Platform --> BPO : BPO approval request
BPO --> Platform : Approve / Reject
Platform --> SN : Attach SQL package\nUpdate work notes
Platform --> Audit : Store full audit trail
Platform --> TargetDB : Optional controlled execution
Platform --> Notify : Status notifications

@enduml
```

---

## 2. High-level component design

```plantuml
@startuml
title Data Fix Automation Platform - Component View

package "Integration Layer" {
  [ServiceNow Connector]
  [Notification Connector]
}

package "Automation Core" {
  [Ticket Intake Service]
  [Attachment Service]
  [Excel Parser Service]
  [Classification Engine]
  [SQL Template Engine]
  [Validation Engine]
  [Approval Workflow Service]
  [Execution Service]
  [Audit Service]
}

package "Optional LLM Assistant" {
  [Ticket Understanding Assistant]
  [Discrepancy Detector]
  [Approval Summary Generator]
  [Clarification Question Generator]
}

package "Data Stores" {
  database "Automation DB"
  database "Audit DB"
  database "Template Config DB"
}

database "Target Database" as TargetDB
rectangle "ServiceNow" as SN
actor "Support / Dev / BPO" as Users

SN --> [ServiceNow Connector]
[ServiceNow Connector] --> [Ticket Intake Service]
[Ticket Intake Service] --> [Attachment Service]
[Attachment Service] --> [Excel Parser Service]
[Excel Parser Service] --> [Classification Engine]
[Classification Engine] --> [SQL Template Engine]
[SQL Template Engine] --> [Validation Engine]
[Validation Engine] --> [Approval Workflow Service]

[Ticket Understanding Assistant] --> [Ticket Intake Service]
[Discrepancy Detector] --> [Validation Engine]
[Approval Summary Generator] --> [Approval Workflow Service]
[Clarification Question Generator] --> [Approval Workflow Service]

[Approval Workflow Service] --> Users
Users --> [Approval Workflow Service]

[Approval Workflow Service] --> [Execution Service]
[Execution Service] --> TargetDB

[Ticket Intake Service] --> "Automation DB"
[SQL Template Engine] --> "Template Config DB"
[Audit Service] --> "Audit DB"

[Ticket Intake Service] --> [Audit Service]
[Excel Parser Service] --> [Audit Service]
[SQL Template Engine] --> [Audit Service]
[Validation Engine] --> [Audit Service]
[Approval Workflow Service] --> [Audit Service]
[Execution Service] --> [Audit Service]

@enduml
```

---

## 3. End-to-end sequence flow

```plantuml
@startuml
title NDC Data Fix - End-to-End Flow

actor Support
actor Dev
actor BPO

participant "Scheduler / Webhook" as Scheduler
participant "ServiceNow Connector" as SN
participant "Ticket Intake Service" as Intake
participant "Attachment Service" as Attach
participant "Excel Parser" as Parser
participant "Classification Engine" as Classifier
participant "SQL Template Engine" as SQLGen
participant "Validation Engine" as Validator
participant "Approval Workflow" as Approval
participant "Audit Service" as Audit
database "Target DB" as DB
participant "ServiceNow" as ServiceNow

Scheduler -> SN : Fetch ready tickets
SN -> Intake : Ticket metadata
Intake -> Audit : Audit ticket intake

Intake -> Attach : Download Excel attachment
Attach -> Audit : Store attachment checksum

Attach -> Parser : Parse workbook
Parser -> Audit : Store parsed rows

Parser -> Classifier : Row values + colors
Classifier -> Audit : Store operation mapping

Classifier -> SQLGen : Operations: INSERT / TERM_UPDATE
SQLGen -> Audit : Store generated SQL draft

SQLGen -> Validator : Validate SQL + data
Validator -> DB : Optional read-only checks
DB --> Validator : Existing record status
Validator -> Audit : Store validation result

Validator -> Approval : Create review package
Approval -> Support : Support review required
Support -> Approval : Approve / reject / edit

Approval -> Audit : Audit support decision

Approval -> Dev : Dev approval required
Dev -> Approval : Approve / reject
Approval -> Audit : Audit Dev decision

Approval -> BPO : BPO approval required
BPO -> Approval : Approve / reject
Approval -> Audit : Audit BPO decision

alt Approved by all
  Approval -> ServiceNow : Attach SQL package\nUpdate work notes
  Approval -> Audit : Mark package approved
else Rejected
  Approval -> ServiceNow : Update ticket with rejection reason
  Approval -> Audit : Mark rejected
end

@enduml
```

---

## 4. Human approval state machine

```plantuml
@startuml
title Data Fix Request State Machine

[*] --> NEW

NEW --> INTAKE_COMPLETE : Ticket fetched
INTAKE_COMPLETE --> ATTACHMENT_DOWNLOADED
ATTACHMENT_DOWNLOADED --> PARSED
PARSED --> CLASSIFIED
CLASSIFIED --> SQL_GENERATED
SQL_GENERATED --> VALIDATION_PASSED
SQL_GENERATED --> VALIDATION_FAILED

VALIDATION_FAILED --> NEEDS_MANUAL_REVIEW

VALIDATION_PASSED --> PENDING_SUPPORT_REVIEW
PENDING_SUPPORT_REVIEW --> SUPPORT_APPROVED
PENDING_SUPPORT_REVIEW --> SUPPORT_REJECTED
PENDING_SUPPORT_REVIEW --> NEEDS_CLARIFICATION

SUPPORT_APPROVED --> PENDING_DEV_APPROVAL
PENDING_DEV_APPROVAL --> DEV_APPROVED
PENDING_DEV_APPROVAL --> DEV_REJECTED

DEV_APPROVED --> PENDING_BPO_APPROVAL
PENDING_BPO_APPROVAL --> BPO_APPROVED
PENDING_BPO_APPROVAL --> BPO_REJECTED

BPO_APPROVED --> APPROVED_PACKAGE_READY
APPROVED_PACKAGE_READY --> ATTACHED_TO_SERVICENOW
ATTACHED_TO_SERVICENOW --> COMPLETED

SUPPORT_REJECTED --> CLOSED_REJECTED
DEV_REJECTED --> CLOSED_REJECTED
BPO_REJECTED --> CLOSED_REJECTED

NEEDS_CLARIFICATION --> WAITING_FOR_BUSINESS
WAITING_FOR_BUSINESS --> PARSED : Updated attachment / response received

COMPLETED --> [*]
CLOSED_REJECTED --> [*]

@enduml
```

---

## 5. Where LLM actually fits

```plantuml
@startuml
title Optional LLM Assistant Boundaries

rectangle "Deterministic Automation" {
  [Excel color parsing]
  [Color-to-operation mapping]
  [SQL template generation]
  [SQL validation]
  [Approval workflow]
  [Audit logging]
}

rectangle "LLM Assistant" {
  [Ticket description understanding]
  [Business intent extraction]
  [Mismatch detection]
  [Approval summary generation]
  [Clarification questions]
}

[Ticket description understanding] --> [Business intent extraction]
[Business intent extraction] --> [Mismatch detection]
[Mismatch detection] --> [Approval summary generation]
[Mismatch detection] --> [Clarification questions]

[Business intent extraction] ..> [Color-to-operation mapping] : advisory only
[Mismatch detection] ..> [SQL validation] : warning only
[Approval summary generation] ..> [Approval workflow]

note right of [SQL template generation]
LLM must not generate final SQL directly.
Final SQL comes only from approved templates.
end note

note right of [SQL validation]
LLM warnings are advisory.
Validation engine owns pass/fail.
end note

@enduml
```

---

## 6. Core data model

```plantuml
@startuml
title Core Data Model

entity DATA_FIX_REQUEST {
  * request_id : UUID
  --
  ritm_number : string
  req_number : string
  service_now_sys_id : string
  request_type : string
  business_title : string
  requested_by : string
  status : string
  created_ts : timestamp
  updated_ts : timestamp
}

entity DATA_FIX_ATTACHMENT {
  * attachment_id : UUID
  --
  request_id : UUID
  file_name : string
  file_checksum : string
  file_size : number
  uploaded_ts : timestamp
  parsed_status : string
}

entity DATA_FIX_ROW {
  * row_id : UUID
  --
  request_id : UUID
  attachment_id : UUID
  excel_row_number : number
  ndc : string
  effective_date : date
  expiration_date : date
  row_color_hex : string
  operation_type : string
  validation_status : string
}

entity GENERATED_SQL {
  * sql_id : UUID
  --
  request_id : UUID
  row_id : UUID
  sql_type : string
  sql_text : clob
  rollback_sql_text : clob
  sql_hash : string
  status : string
  generated_ts : timestamp
}

entity APPROVAL_HISTORY {
  * approval_id : UUID
  --
  request_id : UUID
  approver_role : string
  approver_user : string
  decision : string
  comments : string
  decision_ts : timestamp
}

entity AUDIT_LOG {
  * audit_id : UUID
  --
  request_id : UUID
  action_type : string
  action_by : string
  action_ts : timestamp
  before_value : clob
  after_value : clob
  checksum : string
}

DATA_FIX_REQUEST ||--o{ DATA_FIX_ATTACHMENT
DATA_FIX_REQUEST ||--o{ DATA_FIX_ROW
DATA_FIX_REQUEST ||--o{ GENERATED_SQL
DATA_FIX_REQUEST ||--o{ APPROVAL_HISTORY
DATA_FIX_REQUEST ||--o{ AUDIT_LOG
DATA_FIX_ATTACHMENT ||--o{ DATA_FIX_ROW
DATA_FIX_ROW ||--o{ GENERATED_SQL

@enduml
```

---

## 7. Recommended approval package

For each ticket, generate a package with:

```text
1. Ticket summary
2. Attachment checksum
3. Parsed row summary
4. Insert/update/delete count
5. Validation report
6. Generated SQL
7. Rollback SQL
8. Approver checklist
9. Audit reference ID
```

## 8. My design recommendation

Build this as:

**SOX-Controlled Data Fix Automation Platform**

With optional:

**Data Fix Assistant**

The “assistant” uses LLM for summarization and discrepancy detection, but the SQL generation, approval flow, and audit trail should remain deterministic and rule-driven.
