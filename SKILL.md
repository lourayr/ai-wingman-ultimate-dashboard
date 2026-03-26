---
name: ai-wingman-ultimate-dashboard

description: "Monetizable AI Wingman Dashboard builder and operator. This skill powers Ray Robinson's portfolio product: a live, working CEO dashboard that automates small business operations and serves as both Ray's personal operating system AND his primary sales demo. Use this skill whenever the user mentions: dashboard, automation, client demo, CEO calm, shadow operator, lead pipeline, morning brief, inbox triage, revenue pulse, WooCommerce orders, onboarding wizard, skill marketplace, agent orchestration, monetization, client showcase, portfolio demo, consulting sprint, intake form, tool chaos, operational calm, attention recovery, founder operations, cognitive load, or any task involving building, extending, demoing, or selling the AI Wingman dashboard system. Also trigger when the user wants to automate a business workflow, design a dashboard module, create a client-ready automation, or prepare for a sales conversation. Trigger for ANY work related to the dashboard product, its skills, its monetization, or its delivery to clients."
---

# AI Wingman Dashboard: The Monetization Engine

This skill builds and operates a live, monetizable dashboard product. Not a document. Not a plan. A working system that runs Ray Robinson's four business areas, automates CEO-level decisions, and sells itself to every founder who sees it.

The dashboard is the portfolio. The automation is the pitch. The calm is the close.

## WHO THIS SERVES

Ray Robinson is a West Point strategist, neurodivergent (ADD) operator, and AI systems architect running four concurrent business lines. His brain synthesizes patterns across chaos; this dashboard protects that capacity by handling everything else.

Ray's four operating areas (all dashboard-powered):

1. **Treasures** (WooCommerce store, current primary income)
2. **AI Wingman** (consulting practice, dashboard IS the product)
3. **Shadow Operator** (creator outreach to booked calls to paid partnerships)
4. **Personal / Real Estate** (pipeline in development)

The revenue goal is clear: double income through Shadow Operator, triple through AI Wingman. The dashboard must demonstrate enough operational value that clients pre-pay to have one built for them.

## THE CORE THESIS

Big companies built internal tools giving them unfair advantages for decades. AI erases that gap. This dashboard gives a sole proprietor or 5-person team the operational intelligence of a company 10x their size, and Ray is the one who builds it for them.

The product is not "consulting about AI." The product is a running system that a founder logs into and immediately sees: what matters today, what is making money, what needs attention, and what the AI already handled while they slept.

---

## LAYER 0: SYSTEM RULES

These rules govern every skill, every automation, every module. Non-negotiable.

1. **Revenue or removal.** Every skill must produce revenue, recover time, or reduce cognitive load within seven days. If it does none of those after seven days, it gets cut.

2. **The dashboard is the single source of truth.** All outputs surface through the dashboard. No orphan automations running in the background with no visibility. If a client cannot see it on one screen, it does not exist.

3. **Autonomy with escalation.** Skills run without asking permission for routine actions. They stop and flag the human for conflicts, missing data, dollar thresholds, angry customers, or novel situations. The line between "handle it" and "ask me" is always explicit.

4. **Modular and sellable.** Every module works independently and can be toggled on/off per client. Ray sells the dashboard in tiers; each tier activates more modules. No monolithic builds. No custom one-offs that cannot be reused.

5. **Neurodivergent by default.** Compressed views. One priority, not twelve. Color-coded urgency. No walls of text. Morning briefs that fit in 90 seconds. Systems designed around energy cycles, not arbitrary schedules.

6. **Show, never tell.** When Ray demos this to a prospect, the dashboard should be running live with his own data. The demo is not a slide deck. The demo is "look at what mine did this morning, and yours would do the same."

---

## THE SIX-FIELD FRAMEWORK

Every automation, every module, every client deliverable follows exactly six fields. When building anything in this system, walk through all six before writing a single line of code or producing any output.

### FIELD 1: NAME
What does this skill do? Use plain language a founder understands. Name the outcome, not the process.

Good: "Morning Revenue Snapshot"
Bad: "Automated E-Commerce Data Aggregation Pipeline"

Good: "Inbox Zero by 9 AM"
Bad: "Email Classification and Auto-Response System"

### FIELD 2: TRIGGER
When does it fire? Be specific. Triggers are time-based, event-based, or signal-based.

Time-based: "Every morning at 7:00 AM EST"
Event-based: "When a new WooCommerce order comes in"
Signal-based: "When inbox count exceeds 50 unread" or "When a lead responds to a DM"

### FIELD 3: CONTEXT
What does it need to know to do the job? This is the intelligence layer: business rules, data sources, client preferences, decision thresholds.

Example: "Pull from Gmail API, Google Calendar, WooCommerce REST API, and Stripe. Ray's Treasures store uses product categories: crystals, jewelry, wellness. High-value order threshold is $150+. Revenue target is $10,000/month."

### FIELD 4: STEPS
What does it do, step by step? Write this as if training a sharp new employee on their first day. Clear sequence. No ambiguity. Each step produces a visible result.

### FIELD 5: TOOLS
What systems, APIs, and integrations does it need? Be specific: Gmail API, Google Calendar API, WooCommerce REST API, Stripe, n8n, Make, Claude API, Next.js dashboard endpoints.

### FIELD 6: GUARDRAILS
When does it stop and ask a human? Define the exact boundaries.

Dollar thresholds (refunds over $X, invoices over $Y).
Sentiment triggers (angry customer language, complaint patterns).
Data gaps (missing info that could cause errors).
Novel situations (anything the skill has not seen before).
Scope limits (never send external communications without approval on first run).

---

## DASHBOARD ARCHITECTURE

The dashboard (deployed at ai-wingman-app.vercel.app, Next.js 14 + Neon Postgres + Vercel) has these live modules. Each module maps to one or more six-field skills.

### Module 1: Morning Intelligence Panel

| Field | Detail |
|---|---|
| **NAME** | Daily Focus Compression |
| **TRIGGER** | 7:00 AM EST daily; also on-demand when user opens dashboard |
| **CONTEXT** | Pulls Google Calendar (today's meetings, blocked time), Gmail (unread count, flagged items, decisions needed), WooCommerce (overnight orders, revenue), Shadow Operator pipeline (DM responses, audit status, booking availability), personal task list. Ray has ADD; compress to ONE priority task, ONE revenue action, ONE "ignore today" list. |
| **STEPS** | (1) Fetch today's calendar events and identify protected deep-work blocks. (2) Scan inbox for items requiring decisions vs. items that are FYI-only. (3) Pull overnight Treasures orders and flag anomalies. (4) Check Shadow Operator pipeline for warm leads or pending follow-ups. (5) Rank all inputs by revenue proximity. (6) Produce a compressed brief: one screen, 90-second read, three sections (Do This, Watch This, Ignore This). |
| **TOOLS** | Gmail API, Google Calendar API, WooCommerce REST API, Neon Postgres, Next.js dashboard API routes |
| **GUARDRAILS** | Escalate if more than three items compete for top priority. Flag calendar conflicts. Never suppress urgent client messages. If revenue anomaly exceeds 30% deviation from weekly average, surface it prominently. |

### Module 2: Inbox and Communications Manager

| Field | Detail |
|---|---|
| **NAME** | Inbox Zero Engine |
| **TRIGGER** | Continuous (on new email arrival); full triage sweep at 7 AM and 2 PM |
| **CONTEXT** | Gmail categories: Client (high priority), Revenue (orders, payments, invoices), Shadow Ops (DM responses, creator outreach), Noise (newsletters, promotions, spam). Ray's clients and active conversations are tracked in the dashboard DB. Auto-draft replies for routine messages; flag anything requiring Ray's voice or judgment. |
| **STEPS** | (1) Classify every new email by category and urgency. (2) Archive or unsubscribe from noise. (3) Draft replies for routine client communications (confirmations, scheduling, document requests). (4) Queue drafts for Ray's review (never auto-send client emails without approval until trust is established per-category). (5) Surface decision-required items in the Morning Intelligence Panel. (6) Track response times and flag anything over 24 hours. |
| **TOOLS** | Gmail API (read, draft, label, archive), Claude API (for draft generation), Neon Postgres (conversation tracking), dashboard notification system |
| **GUARDRAILS** | Never auto-send to clients without approval. Never delete emails. Flag angry/upset tone for immediate human review. Stop if email contains legal language, payment disputes, or contract terms. Escalate if draft reply touches pricing or scope. |

### Module 3: Revenue Pulse (Treasures + All Streams)

| Field | Detail |
|---|---|
| **NAME** | Revenue Pulse Dashboard |
| **TRIGGER** | On new WooCommerce order (real-time); daily summary at 8 AM; weekly trend report Monday 9 AM |
| **CONTEXT** | WooCommerce REST API for Treasures (product categories, order values, customer data). Stripe for payment confirmations and refund tracking. Shadow Operator revenue from booked consulting calls and partnerships. AI Wingman revenue from dashboard sales and consulting engagements. Track daily, weekly, monthly across all four streams. |
| **STEPS** | (1) Ingest new orders and classify by product category and value tier. (2) Update running daily/weekly/monthly totals across all revenue streams. (3) Flag high-value orders ($150+ for Treasures) for personal thank-you. (4) Detect anomalies (sudden drops, unusual spikes, failed payments). (5) Calculate revenue velocity (trending toward monthly target or falling behind). (6) Surface "closest to cash" actions: which lead is nearest to booking, which invoice is unpaid, which product is trending. |
| **TOOLS** | WooCommerce REST API, Stripe API, Neon Postgres, Next.js API routes, dashboard charts (Recharts) |
| **GUARDRAILS** | Stop for refund requests over $50. Flag payment failures immediately. Never modify order data. Alert if daily revenue drops below 50% of 7-day average. Escalate unknown SKUs or product routing issues. |

### Module 4: Shadow Operator Pipeline

| Field | Detail |
|---|---|
| **NAME** | Creator Outreach to Booked Call Engine |
| **TRIGGER** | On DM response from creator; daily pipeline review at 10 AM; weekly conversion report Friday 4 PM |
| **CONTEXT** | Shadow Operator workflow: (1) Find creators with 10K-55K followers, 2.5%+ engagement, clean growth on SocialBlade. (2) Send opener DM. (3) On response, prepare Monetization Game Plan using Ghostwriter flow. (4) Send audit via Loom. (5) Book call. (6) Convert to paid partnership. Track each creator through these stages. Revenue math: engagement rate x conversion rate x offer price = potential revenue. High-ticket mentorship $1K-$3K range. |
| **STEPS** | (1) Monitor DM channels for responses from outreach targets. (2) When a creator responds, move them to "audit prep" stage. (3) Pull their Instagram data: follower count, engagement rate, content themes, audience demographics. (4) Generate Monetization Game Plan (using Ghostwriter Shadow Operator flow). (5) Create Gamma presentation from game plan. (6) Record Loom walkthrough (or generate script for Ray to record). (7) Surface top 3 revenue-driving actions daily: who to follow up with, who to audit, who to book. (8) Track conversion rates at each stage. |
| **TOOLS** | Instagram API / SocialBlade data, Ghostwriter flow, Gamma API, Loom, Google Calendar (booking), Neon Postgres (pipeline tracking), dashboard pipeline view |
| **GUARDRAILS** | Never send DMs without Ray's approval on first contact with a new creator. Stop if a creator expresses disinterest or negativity. Always verify engagement metrics before investing audit time. Cap active outreach pipeline at a manageable number (Ray defines). Escalate if booking conflicts or double-bookings arise. |

### Module 5: Client Operations Builder

| Field | Detail |
|---|---|
| **NAME** | Client System Builder |
| **TRIGGER** | On completion of client intake form (onboarding wizard, 29 fields + Campaign DNA) |
| **CONTEXT** | Intake data from the 6-step onboarding wizard stored in Neon Postgres (onboarding_submissions table). Client DNA: business name, industry, team size, revenue stage, tech stack, goals, challenges, scaling bottlenecks, AI comfort level, ideal client profile, UVP, brand voice, content keywords, offer keywords. The five diagnostic categories: Spaciousness, Repetitive, Time Lost, Info Needs, Automate. |
| **STEPS** | (1) Extract client DNA from intake submission (70+ data points when complete). (2) Score each of the five diagnostic categories 1-10. (3) Map current tool stack and calculate tool chaos score (20-32 tools typical, 30-49 daily tabs, $310-1,025/month, 26-43 hours/week lost). (4) Identify top 3 leverage points with highest ROI. (5) Select 3 automations from the skill library that match this client's top pain points. (6) Generate a personalized dashboard mockup showing what their system would look like live. (7) Produce the deliverable package: Tool Chaos Report, 30-60-90 roadmap, dashboard blueprint, and pricing proposal. |
| **TOOLS** | Next.js onboarding API routes, Neon Postgres, Claude API (for analysis and generation), dashboard template system, PDF/DOCX generation for deliverables |
| **GUARDRAILS** | Never generate a proposal without complete intake data (flag missing critical fields). Scope recommendations to the client's stated budget and timeline. Do not recommend more than 12 tools total (the point is consolidation). Stop if intake reveals the client needs services outside Ray's scope (legal, medical, regulated industries requiring compliance Ray cannot provide). Always present findings to Ray before client delivery. |

### Module 6: Automation Marketplace

| Field | Detail |
|---|---|
| **NAME** | Plug-and-Play Skill Library |
| **TRIGGER** | On client request; on Ray adding a new skill; on dashboard activation for a new client |
| **CONTEXT** | Library of modular automations, each defined using the six-field structure. Skills can be toggled on/off per client. Each skill has documented ROI (time saved per week, revenue impact). Skills are categorized: Communication, Sales, Operations, Finance, Marketing, Reporting. |
| **STEPS** | (1) Present available skills with ROI estimates. (2) Client or Ray selects skills to activate. (3) Validate that required integrations are connected (API keys, OAuth, tool access). (4) Configure skill parameters for this specific client (thresholds, preferences, schedules). (5) Run skill in "supervised" mode for first 7 days (all outputs queued for approval). (6) After trust period, promote to autonomous mode with guardrails active. (7) Track skill performance: actions taken, time saved, errors caught, escalations triggered. |
| **TOOLS** | Dashboard skill registry (Neon Postgres), n8n/Make for automation connectors, Claude API for intelligent routing, Next.js admin interface |
| **GUARDRAILS** | Every new skill runs supervised for 7 days minimum. Client can revoke any skill at any time. Skills that produce errors 3 times in 7 days are auto-paused for review. Never activate financial skills (invoicing, payments) without explicit written client approval. Log every action for audit trail. |

---

## MONETIZATION TIERS

The dashboard sells in tiers. Each tier activates progressively more modules.

**Tier 1: CEO Calm Core** ($500 setup + $200/month)
Modules: Morning Intelligence Panel, Inbox Manager
Value: "See your whole day in 90 seconds. Inbox handled by the time you sit down."

**Tier 2: Revenue Growth Pack** ($1,500 setup + $400/month)
Modules: Everything in Tier 1 + Revenue Pulse, Lead Pipeline
Value: "Know exactly where your money is coming from and what to do next to get more."

**Tier 3: Full Wingman System** ($3,000-5,000 setup + $600-800/month)
Modules: Everything in Tier 2 + Client Operations Builder, Automation Marketplace, Shadow Operator Engine
Value: "Your entire business on one screen, with AI handling the 80% so you focus on the 20% that only you can do."

**One-Time Engagements:**
AI Chaos Audit: $750-2,000 (diagnostic only, upsell to Tier 1+)
Creative AI Systems Sprint: $2,500-5,000 (4-6 hour intensive build session)

---

## THE DEMO SEQUENCE

When Ray is showing this to a prospect, the dashboard should tell the story without a slide deck.

1. **Open the dashboard.** It is running. Live data. Not a mockup. Ray's actual morning brief is on screen.
2. **Show the morning panel.** "This is what my AI prepared for me before I woke up. Priority task, revenue snapshot, inbox summary."
3. **Show inbox triage.** "These 47 emails got sorted overnight. These 3 need me. The rest are handled or archived."
4. **Show revenue pulse.** "This is my e-commerce revenue in real time. This is my consulting pipeline. This is the trend line."
5. **Show the client builder.** "When you fill out the intake form, this is what gets generated for YOUR business. Your dashboard. Your automations. Your tool chaos map."
6. **Show the skill marketplace.** "These are the automations you can toggle on. Appointment reminders, invoice automation, content scheduling, lead follow-up. Each one has a documented ROI."
7. **Close with the math.** "How many hours a week do you spend on email, scheduling, invoicing, and follow-ups? My clients get 15-25 hours back. At your billing rate, that is $X per week in recovered capacity."

---

## ENGAGEMENT EXECUTION

### Sprint Delivery (4-6 hours)

**Pre-Session:**
1. Process intake form through Client Operations Builder (Module 5)
2. Generate Tool Chaos Reality Map from intake data
3. Score all five diagnostic categories
4. Prepare preliminary findings and dashboard mockup

**Session 1 (2-3 hours): Diagnostic and Architecture**
1. Walk through findings, validate assumptions
2. Complete Tool Chaos Map collaboratively
3. Prioritize: which 3 automations deliver 80% of the relief?
4. Design their Calm Operations Dashboard layout

**Session 2 (2-3 hours): Build and Handoff**
1. Build 30-60-90 implementation roadmap
2. Configure initial skill activations
3. Create team-ready playbooks for top 3 workflows
4. Package all deliverables
5. Define success metrics and check-in cadence

### Ongoing Partnership (8-12 hrs/month, $2,000-4,000/mo)

Week 1: Strategy + roadmap review + priority adjustment
Week 2: Async guidance, tool integration, workflow refinement
Week 3: Strategy + implementation support + team training
Week 4: Async review, dashboard updates, progress reporting

---

## DIAGNOSTIC SCORING

When analyzing any business (Ray's own or a client's), score each category 1-10:

| Category | 1-3 (Managed) | 4-6 (Strained) | 7-10 (Critical) |
|---|---|---|---|
| **Spaciousness** | Regular deep work, manageable calendar | Some protected time, frequent interruptions | No deep work, always reactive, packed calendar |
| **Repetitive** | Minimal manual work, some automation | Several manual processes, aware but not fixed | Constant copy-paste, data entry, manual reporting |
| **Time Lost** | Reasonable tool count, low switching cost | Noticeable waste from searching and switching | 20+ hours/week evaporating into tool chaos |
| **Info Needs** | Clear source of truth, team self-serves | Gaps exist, founder answers many questions daily | No single source of truth, tribal knowledge only |
| **Automate** | Core workflows automated and maintained | Partial automation, some broken or unused | No automation, or broken Zapier/Make collecting dust |

Address the highest-scoring category first. Ties go to whichever compounds fastest (Time Lost and Repetitive compound exponentially).

---

## NEURODIVERGENT DESIGN PRINCIPLES

Every module, every view, every notification follows these principles because this system was built by and for a neurodivergent founder:

1. **Compression over expansion.** One screen. One priority. Three sections maximum. If a view requires scrolling to understand, it is too long.

2. **Energy-aware scheduling.** Morning briefs arrive before the first meeting. Revenue reviews happen at peak focus. Admin tasks queue for low-energy windows.

3. **Hyperfocus protection.** During blocked deep-work time, the dashboard suppresses all non-emergency notifications. Nothing breaks flow except genuine emergencies.

4. **Decision reduction.** The system makes routine decisions autonomously. Only novel, high-stakes, or ambiguous situations reach the human. The goal is fewer than 10 decisions per day that require conscious attention.

5. **Visual-first.** Color-coded urgency (green/amber/red). Progress bars over percentages. Trend arrows over raw numbers. The eye should understand the state of the business in under 5 seconds.

6. **Recovery cycles built in.** The system knows meetings drain energy. It automatically suggests 15-minute buffers. It tracks meeting density and flags when the calendar is too packed for effective execution.

---

## RAY'S OPERATING MODEL

The skill respects these constraints in everything it builds:

- Ray consults 2-3 days per week, 4 hours per day maximum
- Deep work blocks are sacred; never schedule over them
- 48 hours notice minimum for meetings, launches, or major changes
- Asynchronous first; meetings only when synchronous is genuinely needed
- Leave-behind documentation so the business runs without ongoing dependence
- Maximum 2-3 ongoing consulting clients at a time
- Everything Ray builds for clients, he uses himself first

---

## REFERENCE FILES

For detailed templates and implementation guides, read from the `references/` directory:

- `references/Top 10 Docs/DASHBOARD_CONTEXT.md` -- Complete technical context for the Next.js dashboard app (file structure, DB schema, API routes, design system)
- `references/Top 10 Docs/Shadow-Operator-Workflow-and-Booked-Call-Engine.md` -- Full Shadow Operator outreach workflow with scripts and conversion math
- `references/damien-discovery-intake-form.v1.2026-02-17-2359.md` -- Client intake form template with priority scoring
- `references/intake-processor.md` -- Step-by-step intake analysis guide with scoring rubrics
- `references/dashboard-templates.md` -- HTML/React dashboard templates for different business types
- `references/dashboard-monetization-blueprint.md` -- Tier pricing, demo sequence, client conversion playbook
- `references/six-field-skill-library.md` -- Complete library of plug-and-play skills with six-field definitions
- `references/client-demo-playbook.md` -- Script and preparation guide for live dashboard demos

Read the relevant reference file when you need the detailed template for that specific deliverable. The SKILL.md contains the strategic architecture; the references contain the execution details.
