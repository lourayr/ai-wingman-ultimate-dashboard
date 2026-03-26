# AI Wingman Skill Library — Improved Edition
### Master Prompt for Autonomous Agent Execution

> **Philosophy:** Better ops don't just keep the lights on — they open doors you didn't know were there. When you run ops intentionally, you see things you couldn't see before. The biggest companies built tools that gave them unfair advantage. AI levels the playing field. AI as a teammate. **Spaciousness** as the outcome.

---

## HOW TO READ THIS FILE

Each skill follows a six-field structure designed for **autonomous agent execution** and **human oversight**. Think of this as training a new employee: be explicit enough that they can execute independently, but include decision gates where judgment is required.

```
01 NAME — What does this skill do?
02 TRIGGER — When should it run?
03 CONTEXT — What does it need to know?
04 STEPS — What does it do, step by step? (written as if training a new employee)
05 TOOLS — What systems does it need access to?
06 GUARDRAILS — When should it stop and ask a human?
```

### Organization

Skills are grouped by **operational domain**. Each domain maps to a section of the **AI Wingman Dashboard** (Calm Control · Flow OS · Shadow Ops · Treasures · Personal Coherence).

---

## THE OPERATING PHILOSOPHY

### Why These Five Domains Matter

**Spaciousness** is the outcome. Ray operates across four distinct areas: Treasures (e-commerce), AI Wingman (consulting), Shadow Operator (outreach + monetization), and Personal (health, learning, growth). He has ADHD and context-switches easily. The goal is **not more productivity** — it's **protected attention** and **clear priorities**.

**Repetitive work kills momentum.** When Ray finds himself explaining the same thing twice or doing the same task manually, a system isn't working. Most people blame themselves. The system is what needs fixing.

**Time lost is the highest cost.** Switching between 20-30 tools every day costs $15-25 per context switch (conservatively). That's $300-500/day wasted on switching alone. The dashboard consolidates this.

**Information chaos breeds poor decisions.** When the CEO doesn't have a single source of truth, they ask questions instead of making decisions. The dashboard surfaces pre-digested intelligence.

**Automate the obvious, keep the human in the loop for judgment.** Every skill includes guardrails. The AI runs the play, but flags for human judgment when it matters.

---

# DOMAIN 1: CALM CONTROL
## The CEO Morning Intelligence System

*Restore clarity and reduce decision fatigue through centralized information architecture.*

The Calm Control Dashboard (CEO Command) is the **single source of truth** for a founder's day. Instead of checking 30-49 tabs, Ray checks one dashboard, 2-3 times daily, for 15-20 minutes total. Everything else runs in the background.

---

## SKILL-001 — Daily Intelligence Synthesis (Morning Brief)

```
01 NAME
   Calm Control Daily Intelligence Brief
   (The AI's job: synthesize the founder's morning without a meeting)

02 TRIGGER
   Every weekday at 6:00 AM
   (Before Ray opens his inbox or calendar)

03 CONTEXT
   Ray wakes to a phone full of notifications and an inbox with 30+ unread
   emails. The goal is simple: give him the three things he actually needs
   to know today, in 90 seconds, so he can take one conscious action before
   diving into the day.
   
   The brief pulls from:
   - Google Calendar (today's events, focus time, prep required)
   - Gmail important + unread (decisions, not newsletters)
   - Treasures WooCommerce orders (revenue signal, routing alerts)
   - AI Wingman client pipeline (anyone pending or newly submitted)
   - Shadow Operator outreach queue (KPI status for the day)
   - Personal commitments (does Ray have a time block for deep work?)
   
   Format: Single markdown file, posted to Calm Control dashboard.
   Tone: Direct, honest, bias toward action over information.
   
04 STEPS
   1. Open Google Calendar → pull today's events
      - Extract time blocks (focus time is priority)
      - Note any event that requires 15+ minutes prep
      - Flag back-to-back meetings (context switching alert)
   
   2. Fetch Gmail is:important, is:unread → exclude promotions/newsletters
      - Read subject lines only (15 max)
      - Categorize: decision-required vs. FYI
      - Flag anything that requires response within 24 hours
   
   3. Scan Treasures emails from past 24 hours
      - Count new orders (yesterday's revenue)
      - Flag orders >$300 or any with routing issues
      - Note best-seller from yesterday
   
   4. Query AI Wingman client database
      - Count active clients (in strategy execution)
      - Count new submissions this week
      - Flag any client at a critical milestone
   
   5. Pull Shadow Operator KPI tracker
      - Yesterday's outreach count (vs. 30/day target)
      - Yesterday's calls booked (vs. 1/day target)
      - Current pipeline stage distribution
   
   6. Check Ray's personal commitments
      - Is deep work time protected on today's calendar?
      - Any health or recovery activity scheduled?
      - Are there any conflicts between personal and work?
   
   7. Synthesize into a single brief:
      This should never exceed 5 bullet points. Format:
      
      **PRIORITY 1 (Deep Work Block):**
      [One sentence] What is the highest-leverage use of Ray's time today?
      Why it matters. Time estimate. Context: will this move the needle?
      
      **PRIORITY 2 (Decision Required):**
      [One sentence] What needs Ray's judgment today?
      Context. Options (if available). Timeline.
      
      **PRIORITY 3 (Signal Check):**
      [One sentence] What's the health signal today?
      Revenue, pipeline, activity, or personal state?
      
      **What to Skip Today:**
      [Optional] What is intentionally NOT on this list?
      Sometimes protecting focus means explicitly deferring things.
      
      **Tomorrow Prep:**
      [One sentence] What does tomorrow's priority look like, so Ray can
      mentally prepare?
   
   8. POST brief to Calm Control Dashboard
      - Store in database with timestamp
      - Surface in the Morning Brief widget (top of dashboard)
      - Make it copy-paste friendly (Ray may want to paste into a doc)

05 TOOLS
   Google Calendar API (/api/calendar)
   Gmail API (/api/gmail) — Important + Unread filters
   Neon Database (client pipeline, shadow ops KPI tracker)
   Calm Control Dashboard (CEO Command state management)
   OpenAI GPT-4 (brief synthesis and phrasing)

06 GUARDRAILS
   STOP and notify Ray if:
   — Any email marked important is from a client and contains the word
      "urgent," "critical," "help," or "issue"
   — Gmail or Calendar API returns auth:false (not connected)
   — Treasures order count is zero by 6 AM on a Monday-Friday
      (potential data pipeline break)
   — Calendar shows more than 6 hours of back-to-back meetings
      (no deep work opportunity)
   — Shadow Operator KPI is <15 outreach yesterday (trending toward miss)
   — Ray has no personal time scheduled this week (burnout risk alert)
   
   If ANY guardrail triggers, append a flagged alert to the brief
   with a specific action ("Check Gmail connection" or "Mark deep work
   on today's calendar").
   
   Never send the brief externally or to clients. This is Ray's eyes only.
```

---

## SKILL-002 — Weekly Operational Clarity Reset

```
01 NAME
   Weekly Clear-the-Fog Reset
   (What actually moved the needle? Where are we stalled?)

02 TRIGGER
   Every Sunday at 5:00 PM
   (Before the week reflectsback — while it's still fresh)

03 CONTEXT
   End-of-week review. Not a productivity report (who cares about being
   busy?). A pattern detector: What worked? What was noise? What keeps
   getting skipped (system problem, not will problem)? What one change
   next week would remove the most friction?
   
   This skill looks back 7 days across all four operating areas and
   surfaces the signal from the noise.

04 STEPS
   1. Aggregate Treasures data (last 7 days)
      - Total orders this week
      - Total revenue (compare to week before)
      - Top 3 products by order count
      - Any product ordered 5+ times (reorder signal)
      - Routing accuracy (percentage of orders routed correctly)
      - Flag any fulfillment issue or refund
   
   2. Aggregate AI Wingman client data (last 7 days)
      - New clients added (intake form submissions)
      - Active clients (updated/messaged in past 7 days)
      - Stalled clients (no update in 14+ days)
      - Any client at a critical milestone (ready to sign)
      - Estimated pipeline value this week
   
   3. Aggregate Shadow Operator KPIs (last 7 days)
      - Total outreach sent vs. 30/day target (210 target)
      - Total audits sent vs. weekly target
      - Calls booked this week vs. 5 target
      - Close rate (deals signed / calls booked)
      - Biggest bottleneck (where are most prospects stuck?)
   
   4. Aggregate personal signal (last 7 days)
      - Hours of deep work vs. target (20/week)
      - Sleep quality average (if tracked)
      - Energy level subjective rating
      - Any health or recovery activity
      - Biggest energy drain this week
   
   5. Compare each metric to weekly targets and prior week
      - Revenue: ↑ or ↓?
      - Pipeline: growing or stalled?
      - Outreach: on target or below?
      - Energy: recovering or depleting?
   
   6. Identify the single biggest gap
      - Where is the biggest miss vs. target?
      - Is this a system problem, execution problem, or external factor?
      - What's one change next week that would fix it?
   
   7. Draft the weekly reset as 5 bullets max:
      **Last Week's Reality:**
      — [Signal 1: was it good or concerning?]
      — [Signal 2: pattern or one-time?]
      — [Signal 3: connected to energy state?]
      
      **What Worked:**
      — [One thing that went smoothly — why?]
      
      **Next Week's One Thing:**
      — [The single highest-leverage change to make]
   
   8. POST to Flow OS Dashboard
      - Archive previous week's reset
      - Surface current week as "Last Week's Reality" for reference

05 TOOLS
   Neon Database (all historical data)
   /api/treasures/weekly (order and revenue data)
   /api/wingman/clients/list (client pipeline)
   /api/shadow-ops/kpi (outreach and deal KPIs)
   Flow OS Dashboard (reset storage and surface)
   Google Calendar API (deep work time blocks)

06 GUARDRAILS
   STOP if:
   — Revenue is down >30% from prior week (flag for manual investigation)
   — Pipeline value is <$5,000 (potential deal pipeline drought)
   — Outreach is <150 for the week (trending toward weekly miss)
   — Close rate drops below 15% (signal that audits aren't resonating)
   — Ray logged 0 hours of deep work this week (burnout/alert)
   
   When a guardrail triggers:
   - Append an alert to the reset: "⚠️ [What's at risk]"
   - DO NOT make recommendations; surface the fact and let Ray decide
   - Surface in Flow OS with a red badge, not green
```

---

# DOMAIN 2: TREASURES
## E-Commerce Operations & Revenue Intelligence

*WooCommerce order orchestration, routing, and revenue clarity.*

Treasures is Ray's product business. Orders come in, get routed (bio products, in-house, or mixed), and need to ship. The goal: visibility into every order, routing accuracy, and revenue trending.

---

## SKILL-003 — Order Monitoring & Routing Intelligence

```
01 NAME
   Treasures Order Processor
   (Catch every order, route correctly, flag issues before they escalate)

02 TRIGGER
   — Real-time: When a new WooCommerce order email arrives
   — Batch: Daily summary at 6:00 PM

03 CONTEXT
   Treasures uses three routing models:
   - BIO: Product is bio-optimized → routes through Vitality supplier
   - IN_HOUSE: Product is fulfilled directly from inventory
   - MIXED: Order contains both bio and in-house items → split routing
   
   Ray receives order notifications via email at ray@smithrobinsonfunding.com.
   Each order needs to be logged, categorized, and flagged if manual action
   is required.
   
   The CEO Command Orders widget shows daily count and routing status.
   This skill keeps that data fresh and catches exceptions.

04 STEPS
   REAL-TIME (On new WooCommerce email):
   
   1. Parse the email
      - Extract: order ID, customer name, items, total amount
      - Identify: order source (direct sale, affiliate, etc. if available)
   
   2. Categorize routing
      - Scan product names against the routing database
      - If all items are BIO products → route = BIO
      - If all items are IN_HOUSE → route = IN_HOUSE
      - If mix of both → route = MIXED
      - If unknown product → flag for manual review
   
   3. Check for exceptions
      - Order total >$300? Flag for verification
      - Any product ordered 3+ times in same order? Note as potential bulk
      - Customer name matches previous refund requester? Flag alert
      - Any product with low inventory? Trigger reorder alert
   
   4. Log to Treasures Order Tracker
      Date | Order ID | Customer | Total | Items | Routing | Status | Flags
      
   5. If no exceptions → log and move on
      If exceptions exist → flag and notify Ray with a summary
   
   6. Update CEO Command Orders widget
      - Increment daily order count
      - Add to routing breakdown (BIO / IN_HOUSE / MIXED)
   
   BATCH (Daily at 6:00 PM):
   
   7. Compile daily summary
      - Total orders received today
      - Total revenue today (sum of all order amounts)
      - Routing breakdown (BIO: X orders, IN_HOUSE: Y, MIXED: Z)
      - Any flagged orders requiring attention
      - Any products at low inventory
   
   8. Compare to daily target
      - Is order count healthy for this day of week?
      - Revenue trending up or down?
      - Routing accuracy >95%?
   
   9. POST summary to CEO Command Dashboard
      - Update Orders badge with count
      - Post detail to Orders tab (searchable by date range)
   
   10. If order count is zero by noon on weekday
       - Send alert to Ray: "No orders received by noon — check WooCommerce"
       - May indicate email delivery issue or site traffic problem

05 TOOLS
   Gmail API (WooCommerce email monitoring)
   WooCommerce API (optional direct connection)
   Neon Database (order log, routing rules, inventory)
   Treasures Order Tracker (Google Sheets or DB table)
   CEO Command Dashboard (Orders widget and tab)

06 GUARDRAILS
   STOP and flag to Ray:
   — Any email with subject containing "refund," "dispute," "return," "chargeback"
   — Any order with routing ambiguity (unknown product)
   — Any customer complaint language detected in order email
   — Order value >$500 in single order (verify legitimacy)
   — Same item ordered 10+ times (potential bot or bulk buyer — verify)
   — Routing accuracy drops <90% (system misconfiguration)
   
   NEVER:
   — Process refunds or respond to customers automatically
   — Change routing rules without Ray's explicit approval
   — Ship orders that are flagged for review
   — Post customer names or order details to public-facing surfaces
```

---

## SKILL-004 — Weekly Treasures Revenue & Insights

```
01 NAME
   Treasures Weekly Revenue Summary
   (Is the store healthy? What's selling? What needs attention?)

02 TRIGGER
   Every Monday at 8:00 AM

03 CONTEXT
   Ray needs to know: total revenue last week, best sellers, inventory
   signals, and any anomalies. This feeds into the CEO Command Dashboard
   stats and helps Ray make pricing, inventory, and marketing decisions.

04 STEPS
   1. Pull all WooCommerce orders from past 7 days
   
   2. Compute metrics
      - Total orders (count)
      - Total revenue (sum of order amounts)
      - Average order value (revenue / orders)
      - Highest-value order
      - Lowest-value order
   
   3. Identify product performance
      - Top 3 products by order frequency
      - Top 3 products by revenue
      - Products ordered 5+ times (reorder/restock consideration)
      - Products with zero orders (slow-moving)
   
   4. Segment by routing
      - BIO revenue vs. total (% of business)
      - IN_HOUSE revenue vs. total
      - MIXED orders as % of total
   
   5. Compare to prior week
      - Revenue trend: ↑ or ↓ and by %?
      - Order count trend
      - Product mix shift?
   
   6. Flag anomalies
      - Revenue >25% up or down from prior week
      - New product in top 3 (new customer interest or old stock cleared?)
      - Product with zero orders two weeks in a row
   
   7. Draft summary (5 lines max)
      Format:
      **Last Week's Revenue:** $[total] across [N] orders (avg: $[AOV])
      **Best Sellers:** [Product 1], [Product 2], [Product 3]
      **Restock Alert:** [Any product ordered 5+ times]
      **Trend:** [↑ or ↓ vs. prior week, with %]
      **Flag:** [Any anomalies or concerns]
   
   8. POST to CEO Command Dashboard
      - Update Revenue stat
      - Update Products section
      - Surface summary in Treasures tab

05 TOOLS
   WooCommerce API or email parsing
   Neon Database (order log, product catalog)
   CEO Command Dashboard

06 GUARDRAILS
   Flag to Ray if:
   — Weekly revenue <50% of typical (potential alert of low traffic)
   — Same product ordered 10+ times (confirm it's not a bot)
   — Any product with 3+ refunds in week (quality or expectation issue?)
   — Revenue swing >50% up or down (external factor? promotion? seasonal?)
   
   Do NOT:
   — Publish any revenue numbers to public-facing surfaces
   — Make pricing decisions automatically
```

---

# DOMAIN 3: AI WINGMAN CONSULTING
## Client Strategy & Pipeline Management

*Client intake, strategy prep, and revenue pipeline visibility.*

AI Wingman is the consulting and dashboard-building business. Clients come through an intake form (29 fields), get built a custom CEO Command dashboard, and become part of the pipeline. This domain manages client onboarding, strategy prep, and pipeline tracking.

---

## SKILL-005 — New Client Intake Auto-Processor

```
01 NAME
   AI Wingman Client Onboarding Auto-Prep
   (New client lands on intake form → dashboard ready for strategy session)

02 TRIGGER
   When a new submission appears in onboarding_submissions table
   with status = 'complete' (or manual trigger via "Process Client" button)

03 CONTEXT
   The AI Wingman intake form captures 29 fields across 6 sections:
   Business Overview | Goals & Challenges | Resources | Growth Opportunities
   | Unique Identity | Campaign DNA
   
   When a client completes the form, their data should immediately appear
   in three places:
   - Shadow Ops Dashboard (as a client card with full profile)
   - CEO Command Pipeline (as a deal with estimated value)
   - Staging area (for Ray to copy-paste into GPT)
   
   The full profile is structured as a JSON block that Ray can inject
   directly into any strategy-building GPT.

04 STEPS
   1. Detect new complete submission
      - Query onboarding_submissions for status = 'complete', status_processed = false
   
   2. Extract all 29 fields
      Business: name, industry, model, revenue, team size, website
      Goals: 90-day goal, 3-year goal, biggest challenge, scaling bottleneck
      Resources: budget tier, AI comfort, tools already used
      Growth: revenue opportunity, client ICP, positioning
      Identity: brand voice, unique approach, success metrics
      DNA: campaign positioning, offer, audience, messaging framework
   
   3. Validate required fields
      - If business_name is empty → mark as incomplete, skip processing
      - If 90-day goal is empty → flag as "incomplete goal clarity"
      - If Campaign DNA (section 6) is not filled → add to action list
   
   4. Build the full profile block (JSON)
      {
        "clientID": "auto-generated",
        "businessName": "...",
        "industry": "...",
        "profile": {
          "challenge": "...",
          "opportunity": "...",
          "positioning": "...",
          "icp": "...",
          "messageFramework": "..."
        },
        "aiComfort": "beginner|intermediate|advanced",
        "investmentCapacity": "$[range]",
        "recommended_services": ["CEO CALM", "Shadow Ops", "etc."],
        "incomplete_flags": ["missing_dna", "etc."]
      }
   
   5. Generate recommended services
      - Call /api/gpt/recommend-services with profile
      - Return list of 2-3 recommended service offerings
      - Include rationale for each
   
   6. Add client to pipeline
      - Create record in clients_pipeline table
      - Status: "intake_complete"
      - Set investment_capacity from budget_tier
      - Set created_at timestamp
   
   7. Create Shadow Ops client card
      - Populate all 6 section tabs with form data
      - Add "next steps" action: Schedule strategy call
      - Add recommended services as suggested upsell
      - Make profile copy-paste ready for GPT injection
   
   8. Copy full profile to staging area
      - Ray can click "Copy Profile" and paste directly into GPT
      - No manual assembly required
   
   9. Notify Ray
      - Send message: "New client [Name] is ready in Shadow Ops"
      - Include link to client card
      - Flag any incomplete sections

05 TOOLS
   Neon Database (onboarding_submissions, clients_pipeline)
   /api/onboarding (submit and fetch)
   /api/gpt/recommend-services
   Shadow Ops Dashboard
   CEO Command Dashboard (pipeline integration)

06 GUARDRAILS
   STOP and do NOT process if:
   — business_name is empty
   — No email provided (can't follow up)
   — investment_capacity is <$500 (too small for custom dashboard build)
   — Submission looks like a bot or spam test
   
   NOTIFY Ray if:
   — Campaign DNA is missing (needs to be completed before strategy call)
   — Recommended services include CEO CALM + Shadow Ops (high-ticket upsell)
   — Investment capacity >$20,000 (flag for manual review before service design)
   
   NEVER:
   — Send profile data to any external service without Ray's approval
   — Mark submission as processed until all required fields are validated
   — Auto-schedule any calls or send outreach to client
```

---

## SKILL-006 — Pre-Call Strategy Brief Auto-Builder

```
01 NAME
   Client Strategy Call Prep Brief
   (2 hours before call → Ray has everything he needs, no prep required)

02 TRIGGER
   2 hours before any calendar event where title contains a client
   name found in the clients_pipeline table

03 CONTEXT
   Before Ray jumps on a strategy call, he needs the complete context
   in one place. This skill builds a one-page brief that shows:
   - Client profile snapshot
   - Top 3 recommended services
   - 3 smart open questions to ask
   - Campaign DNA status
   - Pipeline value estimate
   
   Ray should never go into a call scrambling for context.

04 STEPS
   1. Match calendar event title to client in DB
      - Exact match on businessName
      - If no match → skip silently (don't create fake brief)
   
   2. Fetch client's full 29-field profile
   
   3. Identify empty/weak fields
      - Where is the profile incomplete?
      - Generate 3 smart follow-up questions to ask on the call
      - Example: If scalingBottleneck is empty → ask "Walk me through
        a typical stuck week — what does that look like?"
   
   4. Run service recommendation engine
      - Call /api/gpt/recommend-services with profile
      - Return top 2 services with short rationale
   
   5. Check Campaign DNA status
      - Is section 6 complete?
      - If yes → note it's ready to use for GhostwriterOS
      - If no → add to agenda: "Let's complete your Campaign DNA"
   
   6. Build one-page brief
      Format:
      ---
      **CALL BRIEF: [Client Name]**
      Date | Time | Strategic Focus: [90-day goal in one sentence]
      
      **Client Snapshot:**
      Industry: [X] | Team: [Y people] | Revenue: [Z range]
      Biggest Challenge: [quote from form]
      
      **What They're Optimizing For:**
      [Key insight from their responses]
      
      **Recommended Path:**
      1. [Service 1]: Why this matters
      2. [Service 2]: Why this matters
      
      **Questions to Ask:**
      1. [Open question 1]
      2. [Open question 2]
      3. [Open question 3]
      
      **Call Agenda:**
      — Confirm their 90-day goal and biggest blocker
      — Present recommended services
      — If time: Complete Campaign DNA together
      — Next steps: Schedule implementation kickoff
      
      **Pipeline Value:** $[estimated range based on investment_capacity]
      ---
   
   7. Surface brief in Shadow Ops
      - Add to client's "Call Brief" tab
      - Make copy-to-clipboard ready
   
   8. Optional: Email brief to Ray 30 min before call
      - Subject: "Brief ready: [Client Name] call in 30 min"
      - Include link to full profile in Shadow Ops

05 TOOLS
   Google Calendar API
   Neon Database (clients_pipeline, onboarding data)
   /api/gpt/recommend-services
   Shadow Ops Dashboard
   Gmail API (optional for email notification)

06 GUARDRAILS
   STOP if:
   — No matching client found in DB (don't fake a brief)
   — Event is marked "personal" or "internal" (not a client call)
   — Client record doesn't have an email (can't verify it's a real lead)
   
   NOTIFY Ray if:
   — Campaign DNA is empty (needed for marketing strategy)
   — Investment capacity <$2,000 (may not be ideal fit for custom build)
   — This is the client's first call with Ray (add context about first-call expectations)
   
   NEVER:
   — Send brief to client or make it public
   — Make assumptions about the call outcome
```

---

## SKILL-007 — Weekly Client Pipeline Review

```
01 NAME
   AI Wingman Weekly Pipeline Status Report
   (Which clients are moving? Which are stuck? What actions needed?)

02 TRIGGER
   Every Friday at 4:00 PM

03 CONTEXT
   Ray needs to know the health of his pipeline weekly. This skill
   categorizes clients into three buckets — Active (moved this week),
   Stalled (no update in 14+ days), and New (submitted this week) —
   and surfaces action items for the week ahead.

04 STEPS
   1. Pull all clients from clients_pipeline table
   
   2. Classify each client
      - ACTIVE: status updated in past 7 days, or call scheduled this week
      - STALLED: status unchanged for 14+ days
      - NEW: submitted in past 7 days
      - WON: signed, now in delivery
      - NO_FIT: closed, not a good match
   
   3. For each STALLED client:
      - Generate one re-engagement message Ray can send
      - Keep it short: "Hey [Name], wanted to check in. How's [their goal]
        progressing? Let me know if there's anything I can do to help."
      - Attach it to the client card for Ray to send (or send automatically
        if Ray has pre-approved stalled-client follow-ups)
   
   4. For each ACTIVE client:
      - Surface their top action item (next step in pipeline)
      - Flag any milestone happening this week
   
   5. For each NEW client:
      - Flag as "ready for first call"
      - Include Recommended Services list
   
   6. Compute pipeline metrics
      - Total active deals (count)
      - Total pipeline value (sum of investment_capacity, weighted by
        likelihood: new=30%, active=60%, close=90%)
      - Avg deal size
      - Best-fit customer profile (who are the easiest closes?)
      - Estimated revenue this month if all active deals close
   
   7. Identify upsell opportunities
      - Flag any ACTIVE client who could add CEO CALM or Shadow Ops
        (cross-sell)
      - Flag any WON client who could add ongoing support
        (expand/retention)
   
   8. Draft briefing (10 lines max)
      Format:
      **Pipeline Health:**
      [N] active | [N] new | [N] stalled | $[X] total value
      
      **This Week's Action Items:**
      - [Stalled client re-engagement] (1 message ready to send)
      - [Active client milestone or call] (date and prep needed)
      - [New client ready for call] (1st call, recommended services)
      
      **Upsell/Expand Opportunities:**
      - [Client + service recommendation]
      
      **Best-Fit Pattern This Month:**
      [Profile of easiest-closing clients]
   
   9. POST to CEO Command Pipeline tab
      - Surface top upsell opportunities
      - Link to stalled-client re-engagement messages

05 TOOLS
   Neon Database (clients_pipeline)
   /api/onboarding/list
   CEO Command Dashboard
   Shadow Ops Dashboard

06 GUARDRAILS
   STOP if:
   — Total pipeline value is <$5,000 (potential drought, needs attention)
   — More than 50% of pipeline is STALLED (system breakdown)
   — No active deals this week (no momentum)
   
   FLAG for Ray:
   — Any deal >$20,000 (verify before counting in total)
   — Any client mentioning competitor or going silent (potential loss)
   — Stalled clients in specific industry (pattern indicator)
   
   NEVER:
   — Auto-send re-engagement messages without Ray's approval
   — Publish pipeline value or client names externally
   — Close a deal or change status without Ray's explicit action
```

---

# DOMAIN 4: SHADOW OPERATOR
## Outreach Automation & Monetization Pipeline

*Creator partnership outreach, audit delivery, and booked-call funnel.*

Shadow Operator is Ray's outreach business model: find creators with 10K–100K followers, send audit, book call, close deal. This domain manages the daily outreach queue, prospect progression, and revenue tracking.

---

## SKILL-008 — Daily Shadow Operator Outreach Queue

```
01 NAME
   Shadow Operator Daily Booked-Call Engine
   (Manage the outreach funnel: openers sent → audits sent → calls booked)

02 TRIGGER
   Every weekday at 9:00 AM

03 CONTEXT
   Target: Creators with 10K–100K followers, stable engagement, no bots.
   Pipeline stages: Opener → Permission to Send Audit → Audit Sent → 
   Audit Review → Call Booked → Decision (Signed / Nurture / No-Fit)
   
   Daily targets: 30 qualified outreach, ≥8% response rate, ≥1 booked
   call/day, ≥20% close rate on calls.
   
   This skill manages the daily queue and surfaces action items.

04 STEPS
   1. Pull today's outreach queue
      - Prospects in "opener" stage (ready to send)
      - Prospects in "waiting for response" at 24h, 72h, 5-day marks
        (follow-up timing)
      - Prospects in "audit ready" (audit link prepared)
      - Prospects with "call booked" (prepare for Ray's call)
   
   2. Surface prospects at follow-up points
      - D+1 follow-up: Who hasn't responded in 24h?
      - D+3 follow-up: Who hasn't responded in 3 days?
      - D+7 follow-up: Who hasn't responded in 7 days?
   
   3. For each prospect at follow-up point:
      - Generate a follow-up message Ray can send
      - Keep it different from the original (not just resending)
      - Example: Day 1 = "Hey [name]..." | Day 3 = "Wanted to follow up..."
      - | Day 7 = "One more thought..."
   
   4. Check audit-ready prospects
      - Confirm Gamma/Loom audit link is prepared
      - If not, flag for Ray to complete
      - Surface the audit link prominently
   
   5. Check booked-call prospects
      - Pull their call time from calendar
      - Trigger SKILL-009 (pre-call brief builder)
      - Remind Ray of the call 1 hour before
   
   6. Tally daily metrics
      - Openers sent today (vs. 30 target)
      - Responses received (vs. 8% expected rate)
      - Audits sent (vs. weekly target)
      - Calls booked (vs. 1/day target)
      - Prospects in each stage
   
   7. Surface daily dashboard
      Format:
      **Shadow Ops Daily Pulse:**
      
      🚀 **Today's Action Queue:**
      — [N] openers ready to send (review and approve)
      — [N] follow-ups due (Day 1, 3, 7 messages ready)
      — [N] audits ready to send (links confirmed)
      — [N] calls booked today (prep brief in 1 hour)
      
      📊 **Weekly Tally:**
      Outreach sent: [N/210] | Audits sent: [N/target] | Calls: [N/5]
      Response rate: [%] | Close rate: [%]
      
      💰 **Pipeline Stage:**
      Opener: [N] | Awaiting Response: [N] | Audit Sent: [N]
      Call Booked: [N] | Won: [N] | No-Fit: [N]
      
      ⚠️ **Flags:**
      [Any guardrail alerts]
   
   8. POST to Flow OS Dashboard (or Shadow Ops tab)

05 TOOLS
   Google Sheets or Neon DB (prospect tracker)
   Gmail (for sending outreach)
   Google Calendar (for booked calls)
   Gamma/Loom (audit links)
   Flow OS or Shadow Ops Dashboard

06 GUARDRAILS
   STOP and ask Ray before sending:
   — Any outreach message (Ray must review each one for tone + fit)
   — Any follow-up to a prospect who marked as "do not follow up"
   — Any audit to a prospect outside the ideal follower range
      (10K–100K followers)
   
   FLAG to Ray:
   — Outreach sent <15 today (trending toward miss)
   — Response rate <6% this week (messaging or targeting issue?)
   — No calls booked this week (funnel broken somewhere)
   — Close rate <15% (audits not resonating?)
   — Prospect account showing bot behavior (rapid follower growth,
      low engagement)
   
   NEVER:
   — Send openers without Ray approving the specific message first
   — Contact prospects who have explicitly declined or ignored multiple
      follow-ups
   — Fabricate engagement or revenue numbers in audits
```

---

## SKILL-009 — Shadow Operator Monetization Audit Prep

```
01 NAME
   Shadow Operator Monetization Audit Auto-Builder
   (Prospect responds → audit is auto-prepped, ready for Ray to customize)

02 TRIGGER
   When a prospect responds positively to the opener DM
   (Detected via: Gmail alert, manual trigger "Build Audit," or DM platform)

03 CONTEXT
   The audit is a Gamma/Loom presentation showing the prospect their
   monetization opportunity. It's personalized, shows what Ray noticed
   about their content, and makes a clear ask: "Let's hop on a call
   and map this out."
   
   This skill auto-generates the audit structure and talking points so
   Ray only needs to customize and record.

04 STEPS
   1. Accept prospect's social handle (Instagram / TikTok / YouTube link)
   
   2. Fetch publicly available data
      - Follower count
      - Recent engagement averages
      - Content themes/topics
      - Bio and positioning statement
      - Latest 5 posts (thumbnails + captions)
   
   3. Run through GhostwriterOS Shadow Operator flow
      Input: Prospect profile + recent content
      Output:
      - Hidden transformation (what they're really selling underneath)
      - Opportunity 1 (primary monetization path to build)
      - Opportunity 2-3 (secondary paths)
      - Content themes that align with their audience
   
   4. Select the strongest opportunity + one theme
      - Opportunity 1 is the main offer in the audit
      - Pick theme that best matches their audience + Ray's expertise
   
   5. Generate dialogue hook
      A one-liner Ray can paste into DM after sending the audit:
      "I'd love your input on this — let's chat on a call if you're open"
   
   6. Build audit outline (5 slides max)
      ---
      SLIDE 1: What I Noticed
      [Observation about their content, growth, or audience]
      "Your content is hitting on [theme] really well. I noticed
      [specific signal]. That's rare in [their niche]."
      
      SLIDE 2: The Opportunity Hiding in Plain Sight
      [Specific gap or monetization path they're missing]
      "Most creators in your space aren't [selling / doing X].
      But look at what happens if you do..."
      
      SLIDE 3: What This Could Look Like
      [Concrete example or case study]
      "One of my clients did this and generated [outcome] in [timeframe]."
      
      SLIDE 4: Why Now?
      [Urgency or market signal]
      "Your audience is ready for this. The timing is right."
      
      SLIDE 5: Let's Talk
      [Clear ask]
      "Let's hop on a 20-min call and map out your specific
      opportunity. No pressure, just a conversation."
      ---
   
   7. Generate talking points for each slide
      Ray can use these when recording the Loom, or they become
      cue cards for a live Gamma presentation
   
   8. Save audit prep to Shadow Ops
      - Store in prospect's card
      - Link to Gamma template (or Loom recording frame)
      - Copy talking points to clipboard
      - Surface dialogue hook for easy paste into DM
   
   9. Notify Ray
      "Audit ready for [Prospect Name]. Review outline, customize,
      then record Loom or present in Gamma."

05 TOOLS
   Social media APIs (Instagram Graph API, YouTube Data API, etc.)
   GhostwriterOS (Shadow Operator flow)
   Gamma (presentation platform)
   Loom (video recording)
   Shadow Ops Dashboard

06 GUARDRAILS
   STOP if:
   — Prospect's follower count <8K or >150K (outside ideal range)
   — Engagement rate <1% (low quality audience)
   — Account shows signs of bot activity (sudden follower spike +
      low engagement)
   — Prospect's niche doesn't align with Ray's expertise
   
   NEVER:
   — Fabricate engagement numbers or revenue estimates in the audit
   — Use prospect's name or content without permission (even in examples)
   — Send audit without Ray reviewing and approving the outline first
   — Claim Ray has experience he doesn't have
```

---

# DOMAIN 5: FLOW OS
## Operations & Automation Health

*Repetitive work detection, tool connections, and automation opportunities.*

Flow OS is where Ray sees "how the system is running." It detects repetitive work that should be automated, checks tool health, and surfaces optimization opportunities.

---

## SKILL-010 — Repetitive Task Elimination Detector

```
01 NAME
   Weekly Automation Opportunity Spotter
   (What's Ray doing manually that should never be done by hand again?)

02 TRIGGER
   Every Sunday at 4:00 PM
   (Before the weekly reset — identify friction points while they're fresh)

03 CONTEXT
   Ray loses momentum to repetitive work. The goal is identifying patterns
   and mapping them to existing tools (Make.com, n8n, Gmail filters, API
   routes) so they get automated next week.
   
   Think of this as a "friction audit." Where is Ray time-spending that
   a system could handle?

04 STEPS
   1. Review Gmail sent items (past 7 days)
      - Find messages sent more than twice with similar content
      - Examples: "Here's my availability," "Here's a proposal template,"
        "Welcome to [program]"
      - Flag as template candidates
   
   2. Review calendar (past 7 days)
      - Any meeting prep done manually that repeats?
      - Example: "Before every client call, I spend 15 min building context"
        (this might have an existing skill, check if it's running)
      - Any recurring time block that feels like overhead?
   
   3. Review Treasures order emails
      - Any step in the order → routing → shipping flow that's manual?
      - Example: "I manually copy order data into a spreadsheet"
      - Any customer question that repeats?
   
   4. Review Shadow Ops dashboard usage
      - Any copy-paste pattern in prospect management?
      - Example: "I copy prospect handle, paste into audit builder, copy
        audit link, paste into DM"
      - This could be one button.
   
   5. Review personal workflow
      - Any decision made multiple times that should be automated?
      - Example: "Every Monday I manually copy last week's revenue into
        my tracker"
      - Any blocked time manually moved because of conflicts?
   
   6. For each identified repetitive task:
      - Name it: "Email prospect after audit sent" or "Create weekly
        revenue summary"
      - Estimate time cost: [X minutes] × [frequency] = [hours per week]
      - Rank by impact: time saved × importance
      - Map to best automation: Gmail filter / Make.com workflow / API
        route / GhostwriterOS flow
   
   7. Write plain-English instructions for the top 3
      Example for "Prospect follow-up after audit":
      "When Ray marks an audit as 'sent' in Shadow Ops, automatically
      send a Slack reminder 24 hours later: '[Prospect name] audit was
      sent yesterday. Send Day 1 follow-up if no response.'"
   
   8. Surface as "Automation Opportunities" in Flow OS
      Format:
      ---
      **Automation Opportunity #1: [Name]**
      Time Saved: [X hours/week]
      Current: [What Ray does manually]
      Automated: [What the system does]
      Build with: [Make.com / n8n / API / filter]
      Effort: [Low / Medium / High]
      
      **Automation Opportunity #2:** [...]
      **Automation Opportunity #3:** [...]
      ---
   
   9. Rank by impact (time × importance)
      - This week's target: automate the top 3

05 TOOLS
   Gmail API
   Google Calendar API
   Shadow Ops Dashboard
   Flow OS Dashboard
   Make.com / n8n (for building automations)

06 GUARDRAILS
   DO NOT:
   — Auto-create automations without Ray's approval
   — Automate any customer-facing communication without Ray
      reviewing the template first
   — Assume a repetition is a good automation target (some things
      should stay manual for judgment)
   
   ONLY suggest automations for:
   — Data entry or copying between systems
   — Status updates that don't need judgment
   — Notifications or reminders
   — Template-based communications Ray has approved
```

---

## SKILL-011 — Tool Connection Health Check

```
01 NAME
   Connected Tools Health & Status Monitor

02 TRIGGER
   Every morning at 8:00 AM + on-demand ("Refresh Tools" button)

03 CONTEXT
   The Calm Control Dashboard connects 8-12 tools. This skill checks
   what's actually connected, refreshes OAuth tokens before expiry,
   and surfaces a clear "what to connect next" recommendation.

04 STEPS
   1. Check each connected tool status
      - Gmail: token exists? expires when? is it still valid?
      - Google Calendar: same checks
      - [Any other OAuth-based tool]: same checks
   
   2. For each API-key tool:
      - Key exists in Vercel env vars?
      - Key is valid (can make a test API call)?
      - Rate limits okay?
   
   3. If token expires within 5 minutes:
      - Call refresh function (lib/google-fetch.ts pattern)
      - If refresh fails → flag as "needs re-authentication"
      - Surface "Re-connect Google" button on dashboard
   
   4. Ping each tool's API
      - /api/gmail → connected:true or false?
      - /api/calendar → connected:true or false?
      - Surface as green (connected) or red (disconnected) in UI
   
   5. Generate connection recommendations
      Priority order:
      1. Slack (comms intelligence, unified inbox)
      2. WooCommerce API (direct order data, not just email parsing)
      3. Notion (knowledge base sync, CRM backup)
      4. Stripe (financial clarity)
      5. HubSpot (client pipeline)
   
   6. Surface status in Tool Connector
      - Connected tools: show as green with last-refresh time
      - Disconnected tools: show as gray with "Connect" button
      - Top recommendation (next to connect): show as highlighted
   
   7. Update dashboard state
      - POST to /api/tools/status with current state

05 TOOLS
   Neon DB (user_tokens table)
   /api/gmail, /api/calendar, /api/[tools]
   lib/google-fetch.ts (OAuth refresh logic)
   Vercel env vars (secret management)
   Calm Control Dashboard (UI status display)

06 GUARDRAILS
   NEVER:
   — Expose token values in UI or logs
   — Store unencrypted credentials
   — Auto-disconnect a tool without warning
   
   If refresh fails 3 times:
   — Stop attempting refresh
   — Surface "needs re-authentication" alert
   — DO NOT loop indefinitely
   
   FLAG to Ray:
   — Any tool that goes red (disconnected)
   — Any OAuth token about to expire
   — Any rate limits being approached
```

---

# DOMAIN 6: PERSONAL COHERENCE
## Energy, Recovery & Strategic Thinking

*Protect Ray's attention, energy, and capacity for strategic work.*

Personal Coherence is about protecting the founder's energy and attention so they can do their best strategic work. It's not productivity metrics — it's rhythm, recovery, and clear thinking.

---

## SKILL-012 — Weekly Energy & Rhythm Check

```
01 NAME
   Personal Energy & Recovery Monitor
   (Is Ray recovering or depleting? Are focus blocks protected?)

02 TRIGGER
   Every Sunday at 6:00 PM
   (After the operational reset, before planning the week ahead)

03 CONTEXT
   Ray has ADHD. His energy is nonlinear. Some weeks he hyperfocuses and
   ships amazing work. Other weeks he's depleted and needs recovery.
   This skill isn't about forcing productivity — it's about honest
   pattern detection so Ray can adjust his week accordingly.
   
   The goal: sustainable rhythm, not constant high output.

04 STEPS
   1. Pull energy signals from past 7 days
      - How many nights of good sleep? (if tracked)
      - Number of "deep work" time blocks completed
      - Number of meetings/context switches
      - Any personal recovery activity (exercise, time off, creative work)?
   
   2. Assess calendar density
      - How many back-to-back meeting days this week?
      - How many focus blocks were actually protected?
      - Did Ray have a full day off?
   
   3. Assess output quality (subjective from Ray or previous work)
      - Was the work Ray produced high-quality or rushed?
      - Did Ray ship anything?
      - Was there any hyperfocus period (capture that signal)?
   
   4. Assess energy state
      - Is Ray trending toward burnout or recovery?
      - Are there energy dips on specific days (Zoom fatigue? particular client?)
      - Is rest being protected?
   
   5. Compare to "healthy rhythm" baseline
      - Healthy = 20 hours/week deep work + 3-4 hours/week recovery + 2+
        meeting-free days
      - Depleted = <15 hours deep work + 0-1 recovery + back-to-back meetings
      - Hyperfocus = 30+ hours deep work (unsustainable if weekly)
   
   6. Draft energy briefing (3 bullets max)
      Format:
      **Energy State:** [Recovering / Steady / Depleted / Hyperfocused]
      **Pattern:** [What's the signal? e.g., "Monday meetings are draining"]
      **Next Week's Adjustment:** [What one change would help?]
      Example:
      **Energy State:** Hyperfocused (shipped 2 client dashboards)
      **Pattern:** Working 35h this week, 2 meeting-free days protected
      **Next Week:** Come back to steady state — plan for recovery
      day mid-week, limit new projects to 1
   
   7. POST to Personal Coherence tab
      - Archive previous week's energy note
      - Surface current week as a gentle reminder

05 TOOLS
   Google Calendar API (time block analysis)
   Optional: Sleep tracking data (if Ray uses it)
   Personal Coherence Dashboard (or Flow OS tab)

06 GUARDRAILS
   ALERT if:
   — <12 hours of deep work this week (attention being fragmented)
   — Back-to-back meeting days 3+ days in a row (no recovery)
   — Zero recovery/personal time scheduled (burnout incoming)
   — Hyperfocus detected but lasted >6 days (recovery is needed)
   
   These are signals, not judgments. Ray may choose to stay hyperfocused,
   but the signal should be visible.
   
   NEVER:
   — Judge Ray's productivity or output
   — Force a change to his schedule
   — Compare his rhythm to external productivity standards
```

---

## SKILL-013 — Course Progress Tracker

```
01 NAME
   Learning Path Progress Monitor
   (Stay current on Kyle's Monetise + AI Income courses — don't fall behind)

02 TRIGGER
   Every Sunday at 6:00 PM

03 CONTEXT
   Ray is completing two courses:
   1. Kyle Deneyssen's Monetise (creator monetization strategies)
   2. AI Income Workshop VIP (advanced AI & automation)
   
   Shadow Operator execution depends on staying current with course content.
   This skill tracks progress and surfaces a gentle prompt if Ray falls
   behind — not shaming, just "you're X weeks behind, watching 1 session
   this week would catch you up."

04 STEPS
   1. Check against master course content list
      - What sessions are Ray supposed to have watched this week?
      - Did Ray log progress in the past 7 days?
   
   2. Compare to "current week" schedule
      - Is Ray ahead, on pace, or behind?
      - By how many sessions (if behind)?
   
   3. If on pace or ahead:
      - Surface a simple note: "On track with Monetise ✓"
   
   4. If behind (1-2 sessions):
      - Surface gentle prompt: "You're 1 session behind on Monetise.
        Watching it this week would get you current."
      - Provide link to the session
   
   5. If significantly behind (3+ sessions):
      - Surface as yellow flag: "⚠️ You're 3 sessions behind on Monetise.
        Want to batch-watch this weekend?"
   
   6. Extract one tactic from the most recent session watched
      - Surface as: "This week's lesson: [Key takeaway]"
      - Could be applicable to Shadow Operator this week
   
   7. POST to Flow OS or Personal Learning tab

05 TOOLS
   Whop or course platform (session list)
   Manual log (Ray notes what he watched)
   Flow OS Dashboard

06 GUARDRAILS
   This is information-only. Never:
   — Book time or cancel other work
   — Make Ray feel ashamed for falling behind
   — Assume Ray WANTS to keep up (ask first)
   
   If Ray explicitly says "I'm not doing that course anymore," respect it
   and remove from tracking.
```

---

# CROSS-CUTTING: DASHBOARD COHERENCE MAP

| Component | Data Source | Real vs Mock | Status | Notes |
|---|---|---|---|---|
| **CEO Command** | | | | |
| Morning Brief | Gmail, Calendar, DB | Real | Live | Gemini integration ✓ |
| Schedule Tab | Google Calendar | Real | Live | Events, focus blocks |
| Inbox Tab | Gmail Important | Real | Live | is:important filter |
| Orders Tab | WooCommerce email | Real | Live | Daily update |
| Client Pipeline | Neon DB | Real | Live | Investment capacity calculated |
| Automations Tab | Make.com / n8n | Partial | Pending | Real automations listed, controls mock |
| Decision Queue | DB flag system | Mock | Phase 2 | Flagging system to be built |
| Tool Connector | OAuth + env vars | Partial | Live | Gmail/GCal real, rest ready |
| **Shadow Ops** | | | | |
| Client Cards | Neon DB | Real | Live | 29-field profiles |
| Outreach Queue | Google Sheets / DB | Real | Live | Daily updates |
| Audit Prep | GhostwriterOS | Real | Live | Auto-generated outlines |
| KPI Dashboard | Prospect tracker | Real | Live | Weekly tallies |
| **Flow OS** | | | | |
| Automation Opportunities | Gmail/Cal analysis | Real | Phase 2 | Detection working, execution pending |
| Tool Health | OAuth token check | Real | Live | Status indicators live |
| Energy & Recovery | Calendar analysis | Real | Phase 2 | Framework built, weekly prompt live |
| Learning Progress | Manual log | Hybrid | Live | Tracking, gentle prompts |
| **Personal Coherence** | | | | |
| Energy Check | Calendar + subjective | Real | Live | Weekly briefing |
| Recovery Time | Calendar blocks | Real | Live | Alerts if <5 hours/week |
| Focus Block Compliance | Calendar | Real | Live | % protected vs. invaded |

---

# IMPLEMENTATION GUIDANCE

## For Ray (The Founder)

### How These Skills Support Your Operating Philosophy

**Spaciousness.** Each skill removes decision-making from repetitive situations. The Daily Brief surfaces your THREE priorities, not 30. The Weekly Reset tells you what moved the needle, not how busy you were. You get back hours of attention per week.

**No More "Yelling at AI."** Every skill has guardrails and clear instructions. If the skill is uncertain, it stops and asks you. If you want to override it, you can. But most of the time, it runs quietly in the background while you focus on what matters.

**Autonomy.** You own every dashboard, every database, every automation. If a tool fails or a rule changes, you can adjust it immediately. No vendor lock-in, no "support ticket." Just your systems, running the way you want them to.

### Getting Started

1. **Pick one domain to go live first** (recommend: Calm Control)
   - Start with SKILL-001 (Daily Brief) + SKILL-002 (Weekly Reset)
   - Get comfortable with the morning ritual
   - Add other domains one at a time

2. **Set up the database** (Neon Postgres)
   - Run schema migrations (provided separately)
   - Test data flow from each API source

3. **Connect your tools**
   - Gmail + Google Calendar (OAuth)
   - WooCommerce API (if using Treasures)
   - Shadow Ops prospect tracker (Google Sheets or DB table)

4. **Customize guardrails**
   - Every skill's guardrails should reflect YOUR risk tolerance
   - Change thresholds (order size, revenue drop %, response time, etc.)
   - Add custom rules unique to your business

5. **Review and refine**
   - First week: Run skills manually, review output, adjust
   - Week 2-3: Automate execution, keep manual oversight
   - Week 4+: Let skills run autonomously (but stay alert to guardrails)

---

## For Developers & Implementation Partners

### Architecture Overview

Each skill follows this pattern:

```
TRIGGER (scheduled or event-based)
  ↓
CONTEXT CHECK (does this skill apply right now?)
  ↓
DATA GATHERING (pull from APIs/DB)
  ↓
SYNTHESIS/PROCESSING (AI, calculations, formatting)
  ↓
GUARDRAIL CHECK (should we stop and ask the human?)
  ↓
OUTPUT (post to dashboard / send notification / store result)
```

### Building a Skill

1. **Create a new API route** (example: `/api/skills/morning-brief`)
2. **Fetch data** from configured sources (Gmail, Calendar, DB)
3. **Process** using business logic + optional AI
4. **Check guardrails** before outputting
5. **Return JSON** or post to dashboard state
6. **Log execution** for debugging

### Tech Stack Used

- **Backend:** Next.js 14 (App Router) with TypeScript
- **Database:** Neon Postgres
- **APIs:** Google (Gmail, Calendar) + WooCommerce + Stripe (as needed)
- **AI:** OpenAI GPT-4 for synthesis
- **Dashboards:** React components (TypeScript, Tailwind CSS)
- **Automation:** Make.com / n8n for workflows, or API routes for custom logic

### Testing Guardrails

Each skill's guardrails should be unit-tested:

```typescript
describe('SKILL-001 Morning Brief Guardrails', () => {
  test('should flag if Gmail not connected', async () => {
    // Mock Gmail API to return connected:false
    // Verify guardrail alert surfaces
  });
  
  test('should flag if >6 hours of back-to-back meetings', async () => {
    // Mock calendar with 6+ consecutive events
    // Verify alert in brief
  });
  
  // ... more guardrail tests
});
```

---

# FUTURE EXPANSION

These 13 skills form the MVP. Future additions could include:

- **Client Retention Monitoring:** Track which clients are at churn risk
- **Revenue Forecasting:** Predict monthly revenue based on pipeline + historical close rates
- **Content Performance:** Auto-analyze which Shadow Operator messaging gets highest response rates
- **Competitor Intelligence:** Track what competitors are doing (for Shadow Operator positioning)
- **Personal Milestone Tracking:** Celebrate wins, track progress toward big goals
- **Team Expansion Support:** When Ray hires, prepare onboarding scripts and delegation systems

---

# SUMMARY

These six-field skills transform the founder experience from **constant chaos to calm command**. Instead of checking 30-49 tabs and making 200+ daily decisions, Ray checks one dashboard, makes 10-15 conscious decisions, and has energy left for strategic thinking.

The magic isn't eliminating tools or work. It's **orchestrating them into a coherent operating system** where AI handles the obvious, surfaces the important, and flags the judgment calls.

**Better ops don't just keep the lights on. They open doors you didn't know were there.**

