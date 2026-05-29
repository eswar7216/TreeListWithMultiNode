We are proposing a SOX-controlled data-fix automation framework to streamline how support teams handle ServiceNow data-fix requests. Today, support manually reviews tickets, opens Excel attachments, interprets color-coded rows, writes SQL scripts, and routes them for Dev and BPO approval.

The proposed solution will automate the repeatable parts of this process using Copilot Studio, Power Automate, Power Apps, Dataverse, and ServiceNow integration. For the pilot, we will focus on NDC List Data Fix requests. The system will read the ServiceNow ticket, parse the Excel attachment, classify each row based on configured color rules, generate SQL from approved templates, validate the output, and create an approval-ready package.

Human approval will remain mandatory. Support, Dev, and BPO approvers will review and approve the generated package before any final action is taken. The solution will also maintain a complete audit trail for SOX compliance, including attachment checksums, generated SQL, validation results, approval history, and all system actions.

This will reduce manual effort, improve accuracy, accelerate turnaround time, and create a reusable framework that can support additional data-fix types in the future through configuration rather than custom development.
