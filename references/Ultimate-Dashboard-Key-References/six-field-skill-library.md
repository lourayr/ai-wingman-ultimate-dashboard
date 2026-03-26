# Six-Field Skill Library

Every skill in this library follows the six-field structure: Name, Trigger, Context, Steps, Tools, Guardrails. Skills are modular, toggleable per client, and designed to run autonomously within defined boundaries.

---

## COMMUNICATION SKILLS

### Skill: Appointment Reminder Engine

| Field | Detail |
|---|---|
| **NAME** | Appointment Reminder Engine |
| **TRIGGER** | 24 hours before any scheduled meeting; 1 hour before; on new booking |
| **CONTEXT** | Google Calendar events flagged as client meetings. Client contact info from CRM or dashboard DB. Customizable reminder templates per client type. No-show rate baseline for comparison. |
| **STEPS** | (1) Scan calendar for upcoming client meetings within the next 48 hours. (2) Send 24-hour reminder via email (or SMS if configured). (3) Send 1-hour reminder. (4) If the client has not confirmed, flag for manual follow-up. (5) After the meeting time passes, log attendance status. (6) Track no-show rate and report weekly. |
| **TOOLS** | Google Calendar API, Gmail API (or Twilio for SMS), dashboard DB |
| **GUARDRAILS** | Never send more than 2 reminders per appointment. Do not contact clients outside business hours (8 AM - 7 PM local). Stop if client replies with cancellation or rescheduling request; route to human. |

### Skill: Post-Service Check-In

| Field | Detail |
|---|---|
| **NAME** | Post-Service Check-In |
| **TRIGGER** | 48 hours after a service delivery, consulting session, or product shipment |
| **CONTEXT** | Client name, service delivered, any notes from the session. Template library for different service types. Net Promoter Score tracking if enabled. |
| **STEPS** | (1) Identify completed services from the last 48 hours. (2) Select the appropriate check-in template. (3) Personalize with client name and service specifics. (4) Send via email. (5) If response is positive, queue a testimonial request for Day 7. (6) If response is negative or neutral, escalate immediately. |
| **TOOLS** | Dashboard DB, Gmail API, NPS tracking (optional) |
| **GUARDRAILS** | Never send if the client already initiated contact about the service. Escalate any negative sentiment immediately. Do not send testimonial requests to dissatisfied clients. |

---

## SALES AND REVENUE SKILLS

### Skill: Lead Intake Auto-Responder

| Field | Detail |
|---|---|
| **NAME** | Lead Intake Auto-Responder |
| **TRIGGER** | On new form submission (website contact form, onboarding wizard, direct email inquiry) |
| **CONTEXT** | Lead source, submitted data, business type if available. Response time target: under 5 minutes for form submissions, under 30 minutes during business hours for email. Qualification criteria: team size, revenue range, stated pain point, budget indication. |
| **STEPS** | (1) Receive new lead notification. (2) Parse submitted data for qualification signals. (3) Score lead: Hot (matches ideal client profile, explicit budget mention, urgent language), Warm (partial match, exploratory), Cool (no clear fit or budget). (4) Send personalized acknowledgment within 5 minutes. Hot leads get a direct booking link. Warm leads get a value-first response with a soft call-to-action. Cool leads get a helpful resource and newsletter opt-in. (5) Log in pipeline with score and next action. (6) Notify Ray of Hot leads immediately. |
| **TOOLS** | Next.js API routes (form handler), Gmail API, Google Calendar (booking), dashboard pipeline DB |
| **GUARDRAILS** | Never auto-send to a lead who has previously opted out. If lead mentions legal, medical, or regulated industry, add a note for Ray to review fit. Do not promise deliverables or pricing in the auto-response. Limit to one auto-reply per lead per submission. |

### Skill: Invoice and Payment Automation

| Field | Detail |
|---|---|
| **NAME** | Invoice and Payment Automation |
| **TRIGGER** | On service delivery completion; on recurring billing date; on manual request |
| **CONTEXT** | Client billing details (name, email, address, payment terms). Service delivered and pricing from engagement agreement. Stripe or PayPal account for payment processing. Payment terms: Net 15 default, adjustable per client. Reminder schedule: Day 7, Day 14, Day 21 after invoice. |
| **STEPS** | (1) Generate invoice from template using client and service data. (2) Send invoice via email with embedded payment link (Stripe). (3) Log invoice in dashboard with status "Sent." (4) On Day 7 if unpaid, send friendly reminder. (5) On Day 14 if unpaid, send firmer reminder. (6) On Day 21 if unpaid, escalate to Ray for personal follow-up. (7) On payment receipt, update dashboard status to "Paid," send thank-you confirmation. |
| **TOOLS** | Stripe API, Gmail API, invoice template system, dashboard DB |
| **GUARDRAILS** | Never modify invoice amounts without Ray's approval. Stop for any disputed amount and route to Ray. Do not send more than 3 automated reminders per invoice. Never threaten or use aggressive language. If payment fails (card declined, etc.), notify Ray before contacting client. All financial actions logged for audit. |

### Skill: Closest-to-Cash Daily Action

| Field | Detail |
|---|---|
| **NAME** | Closest-to-Cash Daily Action |
| **TRIGGER** | Daily at 9:00 AM; refreshes at 2:00 PM |
| **CONTEXT** | All active pipeline data: open proposals, pending invoices, warm leads, follow-up tasks, recurring billing due dates, WooCommerce cart abandonment data. Revenue targets by stream (Treasures, AI Wingman, Shadow Operator). |
| **STEPS** | (1) Scan all revenue pipelines. (2) Rank every open opportunity by proximity to cash (invoice sent > proposal sent > call booked > lead warm > lead cold). (3) Identify the top 3 actions that would most likely produce revenue today. (4) Surface in Morning Intelligence Panel and as a standalone notification. (5) At 2 PM, refresh: did the morning actions happen? Adjust afternoon priorities. |
| **TOOLS** | Dashboard DB (pipeline), Stripe API, WooCommerce API, Google Calendar |
| **GUARDRAILS** | Never suggest discounting or price reduction as a "closest to cash" action. Do not count revenue until payment is actually received. Flag if the same opportunity has been "closest to cash" for more than 7 days without movement (pipeline stall). |

---

## OPERATIONS AND ADMIN SKILLS

### Skill: Contract and Proposal Generator

| Field | Detail |
|---|---|
| **NAME** | Contract and Proposal Generator |
| **TRIGGER** | On request; after intake processing completes; after positive demo call |
| **CONTEXT** | Client intake data. Engagement tier selected. Scope of work based on diagnostic scoring. Pricing from the tier table. Ray's brand voice and formatting standards. Legal boilerplate for consulting agreements. |
| **STEPS** | (1) Pull client data from intake submission. (2) Select engagement template (Audit, Sprint, Tier 1/2/3, Partnership). (3) Populate template with client-specific details: name, business, scope, deliverables, timeline, pricing. (4) Generate proposal document (PDF or DOCX). (5) Generate consulting agreement with terms, payment schedule, and scope boundaries. (6) Queue both for Ray's review before sending. |
| **TOOLS** | Dashboard DB, Claude API (for personalized language), PDF/DOCX generation, Gmail API (for delivery) |
| **GUARDRAILS** | Never send proposals or contracts without Ray's final review and approval. Do not include pricing outside the established tier ranges without explicit approval. Flag if scope of work appears to exceed the selected tier's boundaries. All contracts must include the standard cancellation and IP ownership clauses. |

### Skill: Recurring Task Manager

| Field | Detail |
|---|---|
| **NAME** | Recurring Task Manager |
| **TRIGGER** | Based on configured schedules per task (daily, weekly, monthly, quarterly) |
| **CONTEXT** | Task library: content publishing schedules, reporting deadlines, client check-in cadences, financial reconciliation dates, course module deadlines. Owner assignment (Ray vs. AI vs. team member). Completion tracking and streak data. |
| **STEPS** | (1) At the start of each day, check which recurring tasks are due. (2) Create task instances in the dashboard. (3) Assign to the configured owner. (4) Send notification/reminder at the scheduled time. (5) Track completion. If a task is overdue by 24 hours, escalate visibility (move to top of Morning Intelligence Panel). (6) Weekly: report completion rates and identify tasks that consistently slip. |
| **TOOLS** | Dashboard DB, notification system, Google Calendar (for time-blocked tasks) |
| **GUARDRAILS** | Never auto-complete a task; only the owner marks it done. If a task is overdue by 72 hours, flag for review (maybe the recurrence needs adjustment, not just a reminder). Do not stack more than 5 recurring tasks on a single day without warning about capacity. |

### Skill: Document and File Organizer

| Field | Detail |
|---|---|
| **NAME** | Document and File Organizer |
| **TRIGGER** | On file upload; on email attachment receipt; on document creation |
| **CONTEXT** | Filing structure: organized by client name, then by document type (contracts, invoices, deliverables, correspondence). Naming convention: [YYYY-MM-DD]-[ClientName]-[DocType]-[Version]. Supported storage: Google Drive, local filesystem, dashboard file manager. |
| **STEPS** | (1) Receive new document or attachment. (2) Classify document type (contract, invoice, deliverable, intake, correspondence, internal). (3) Rename following naming convention. (4) Move to the correct folder in the filing structure. (5) If the document is client-facing, link it to the client's dashboard record. (6) If the document contains extractable data (invoice amounts, dates, terms), parse and store in dashboard DB. |
| **TOOLS** | Google Drive API, Gmail API (attachment extraction), OCR (for scanned documents), dashboard DB |
| **GUARDRAILS** | Never delete original files; always copy/move. Do not process documents marked confidential without explicit permission. Flag documents that cannot be classified (unknown type or client). Never expose client documents to other clients. |

---

## MARKETING AND CONTENT SKILLS

### Skill: Content Calendar and Publisher

| Field | Detail |
|---|---|
| **NAME** | Content Calendar and Publisher |
| **TRIGGER** | Based on content calendar schedule; on-demand for ad-hoc posts |
| **CONTEXT** | Content pillars: AI automation wins, dashboard demos (screen captures), founder pain points, before/after operational snapshots, neurodivergent productivity, Golden Age Leadership insights. Publishing channels: LinkedIn (primary), Instagram (secondary), email newsletter (weekly). Brand voice from Campaign DNA (brand_voice, banned_words, content_keywords, offer_keywords). |
| **STEPS** | (1) Weekly: generate 5 content ideas aligned with pillars and current business activity. (2) Draft 3 posts (short-form for LinkedIn/Instagram) and 1 newsletter. (3) Queue drafts for Ray's review and editing. (4) On approval, schedule for publishing at optimal times (LinkedIn: Tue/Thu 8-10 AM; Instagram: Mon/Wed/Fri 12-2 PM). (5) After publishing, track engagement for 48 hours. (6) Flag high-performing posts for repurposing. |
| **TOOLS** | Claude API (for drafting), Buffer or native scheduling APIs, LinkedIn API, Instagram API, email platform (ConvertKit/Mailchimp), dashboard content module |
| **GUARDRAILS** | Never publish without Ray's approval. No AI-generated content goes out without human review. Do not use banned words from Campaign DNA. If a post generates negative engagement, pause and escalate before responding. Do not post more than once per day per channel. |

### Skill: Social Proof Collector

| Field | Detail |
|---|---|
| **NAME** | Social Proof Collector |
| **TRIGGER** | 7 days after positive post-service check-in; on direct client praise (email/message) |
| **CONTEXT** | Client satisfaction data from check-ins. Permission tracking for testimonial use. Preferred formats: written quote, video testimonial link, case study data points. |
| **STEPS** | (1) Identify clients who gave positive feedback in check-ins or direct communication. (2) Send testimonial request with specific prompts ("What was your biggest challenge before working with me? What changed?"). (3) On receipt, format testimonial for multiple uses: website, social, proposals. (4) Request permission to use with full name and business, or anonymized. (5) Store in testimonial library in dashboard. (6) Flag strong testimonials for immediate use in active proposals. |
| **TOOLS** | Gmail API, dashboard DB (testimonial library), CRM |
| **GUARDRAILS** | Never fabricate, edit, or exaggerate testimonials. Always get explicit written permission before publishing. If a client declines, respect immediately and do not re-ask for 90 days. Never use a testimonial in a context the client did not approve. |

---

## FINANCE SKILLS

### Skill: Expense Tracker

| Field | Detail |
|---|---|
| **NAME** | Expense Tracker |
| **TRIGGER** | On receipt upload; on credit card transaction notification; weekly reconciliation Sunday 6 PM |
| **CONTEXT** | Expense categories: software/tools, marketing, professional development, office/supplies, travel, subcontractors. Budget thresholds per category (set monthly). Tax-relevant categories flagged for year-end. Business vs. personal separation rules. |
| **STEPS** | (1) Capture expense (receipt photo, email forward, or bank notification). (2) Extract amount, vendor, date, and category using OCR or parsing. (3) Classify into the correct category. (4) Check against monthly budget for that category. (5) If expense pushes category over budget threshold, flag with alert. (6) Weekly: generate expense summary by category. Monthly: generate P&L snapshot. |
| **TOOLS** | OCR service, Gmail API (for receipt emails), dashboard DB, optional accounting integration (QuickBooks/Wave) |
| **GUARDRAILS** | Never auto-categorize expenses over $500 without confirmation. Flag duplicate entries. Do not modify historical expense records without audit trail. Alert if total monthly expenses exceed 40% of monthly revenue. |

### Skill: Revenue Reconciliation

| Field | Detail |
|---|---|
| **NAME** | Revenue Reconciliation |
| **TRIGGER** | Weekly on Monday 8 AM; monthly on the 1st at 8 AM |
| **CONTEXT** | Revenue data from all streams: WooCommerce (Treasures), Stripe (consulting payments), Shadow Operator (partnership commissions), manual entries for cash/check. Bank account balance for cross-reference. Outstanding invoices. Subscription billing dates. |
| **STEPS** | (1) Pull all revenue transactions from the past period. (2) Cross-reference against invoices sent and expected payments. (3) Identify discrepancies: missing payments, unexpected deposits, partial payments. (4) Calculate actual vs. target for each revenue stream. (5) Generate reconciliation report showing: total revenue, revenue by stream, outstanding receivables, upcoming expected payments. (6) Surface in Revenue Pulse dashboard module. |
| **TOOLS** | Stripe API, WooCommerce API, bank integration (Plaid if available), dashboard DB |
| **GUARDRAILS** | Never adjust financial records without explicit approval. Flag any transaction that cannot be matched to a known source. Escalate discrepancies over $100. All reconciliation actions logged with timestamps. |

---

## WOOCOMMERCE / E-COMMERCE SKILLS

### Skill: Order Fulfillment Monitor

| Field | Detail |
|---|---|
| **NAME** | Order Fulfillment Monitor |
| **TRIGGER** | On new WooCommerce order; daily fulfillment sweep at 10 AM |
| **CONTEXT** | WooCommerce order statuses: processing, on-hold, completed, cancelled, refunded. Product routing rules: which products ship from where, which are digital delivery. Standard fulfillment SLA: ship within 48 hours of order. |
| **STEPS** | (1) On new order, log in dashboard with status. (2) Check product type and routing rules. (3) If digital product, trigger delivery automation. (4) If physical product, add to fulfillment queue. (5) Daily: scan for orders in "processing" status for more than 48 hours; flag as overdue. (6) On shipment, update status and send customer notification. (7) Track fulfillment metrics: average time to ship, overdue rate, return rate. |
| **TOOLS** | WooCommerce REST API, shipping provider API (if applicable), Gmail API (customer notifications), dashboard DB |
| **GUARDRAILS** | Never cancel or refund an order without Ray's approval. Flag orders with notes or special requests for manual review. Escalate any order over $150 for personal attention. Alert on sudden order volume spikes (potential fraud or viral moment). |

### Skill: Inventory and Product Intelligence

| Field | Detail |
|---|---|
| **NAME** | Inventory and Product Intelligence |
| **TRIGGER** | Daily at 7 AM; on stock level change; weekly trend report Friday 4 PM |
| **CONTEXT** | WooCommerce product catalog with stock quantities. Reorder thresholds per product. Sales velocity data (units per week). Seasonal patterns if known. Product margin data. |
| **STEPS** | (1) Pull current stock levels for all active products. (2) Calculate days of inventory remaining based on current sales velocity. (3) Flag products below reorder threshold. (4) Identify top sellers (increasing velocity) and slow movers (declining velocity). (5) Weekly: generate product performance report with revenue per SKU, margin analysis, and restock recommendations. (6) Surface low-stock alerts in Morning Intelligence Panel. |
| **TOOLS** | WooCommerce REST API, dashboard DB, analytics module |
| **GUARDRAILS** | Never auto-reorder without approval. Flag if a product shows zero sales for 30+ days (possible listing issue). Escalate if stock-out occurs on a top-5 revenue product. Do not publish product data externally. |

---

## HOW TO ADD NEW SKILLS

When Ray identifies a new automation need (for himself or a client), create it using this template:

```
### Skill: [Descriptive Name]

| Field | Detail |
|---|---|
| **NAME** | [What it does in plain language] |
| **TRIGGER** | [When it fires: time, event, or signal] |
| **CONTEXT** | [What it needs to know: data sources, business rules, preferences, thresholds] |
| **STEPS** | [Step-by-step execution, written as if training a new employee] |
| **TOOLS** | [Systems, APIs, integrations required] |
| **GUARDRAILS** | [When to stop and ask a human; dollar limits, sentiment triggers, scope limits] |
```

Before adding a skill, verify:
1. Does it produce revenue, save time, or reduce cognitive load within 7 days?
2. Does it connect to the dashboard (visible output)?
3. Are the guardrails specific enough that the skill knows exactly when to stop?
4. Can it be reused across multiple clients, or is it a one-off?

If the answer to #1 or #2 is no, do not build it. If the answer to #4 is "one-off," build it anyway if the client is paying, but flag it for potential generalization later.
