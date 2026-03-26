Treasures Automation Status Rules SOP Workflow 2 6

This automation exists to close the chapter on founder-led operations without collapsing quality, care, or accountability. It is not about speed for its own sake. It is about creating a calm, reliable system that absorbs order volume, exceptions, and growth without pulling you back into daily cognitive load. The goal is simple and non-negotiable: orders move correctly, information reaches the right humans, and nothing depends on your memory, vigilance, or availability. You remain the architect and steward, not the bottleneck.

This document tracks progress toward a state where the system runs itself end-to-end, surfaces only true edge cases, and allows you to step away from operational re-entry entirely. “Done” means classification is correct, delegation is automatic, batching is intentional, and communication is handled without emotional or mental overhead. Your role becomes physical actions only when needed and conscious decision-making only when it truly matters. Everything else is designed to be boring, predictable, and trustworthy by design.

 

## What “done” looks like

•              	              	Orders auto-classified and routed correctly  
•              	              	Vitality emails drafted correctly (individual \+ batch)  
•              	              	Packing lists \+ storage pickup lists auto-generated  
•              	              	WooCommerce order notes updated automatically  
•              	              	Tracking parsed \+ customers notified  
•              	              	You only touch **physical actions \+ edge exceptions**  
•              	              	**All workflows below completed**  
 

## 📊 Summary Table: What's Done vs What's Next

| Feature | V1 Status | V2 | Phase 2 | Phase 3+ |
| :---- | :---- | :---- | :---- | :---- |
| Order detection | ✅ Done | \- | \- | \- |
| Product parsing | ✅ Done | ✅ Fix \* | \- | \- |
| Bio classification | ✅ Done | \- | \- | \- |
| US Bio-only drafts | ✅ Done | \- | \- | \- |
| Pickup batch drafts | ✅ Done | \- | \- | \- |
| In-house packing lists | ❌ Missing | ✅ Build | \- | \- |
| Stock depletion | ❌ Missing | \- | ✅ Build | \- |
| Priority shipping | ❌ Missing | \- | \- | ✅ Build |
| Business-day batching | ❌ Missing | \- | \- | ✅ Build |
| Auto-send (no drafts) | ❌ Missing | \- | \- | ✅ Build |
| Workflow 2-5 | Partial | Partial | ✅ Build |   |
| Workflow 6 | \- | \- | \- | ✅ Build |

 

## Automate Treasures (Contain \+ Exit)

**Role:** Cash-flow stabilizer \+ systems proving ground  
**Goal:** Remove *you* from the loop while preserving revenue

This is **not** a growth project.  
It is a **liberation project**.

### Strategic Reframe

Treasures exists to:

·             	Fund runway

·             	Provide real-world automation patterns

·             	Become a *case study*, not a lifestyle

### Success Definition (Binary)

Treasures is “done” when:

·             	Orders, fulfillment, and support require **\<30 min/day**

·             	No creative or strategic decisions are required from you

·             	It can run unattended for 30 days without anxiety

### What You Actually Need to Build

(Anything else is distraction.)

**A. Operational Spine**

·             	Email classification \+ routing (order / tracking / noise)  
→ already scoped in your AI Marketing Agent Suite notes

·             	Order → fulfillment → confirmation automation

·             	Exception-only alerts (you only see anomalies)

**B. Marketing Stasis**

·             	One evergreen offer

·             	One evergreen traffic source (even if small)

·             	No optimization, no experimentation

**C. Hard Stop**

·             	Fixed automation sprint (e.g., 10–14 deep-work sessions)

·             	Then *no more improvements*

This is below your creative ceiling. Treat it accordingly.

 

## V2 (Next Immediate Update) \- In-House Fulfillment

**Goal:** Split mixed orders into **Vitality portion** \+ **In-house portion**  
**Scope:**  
•              	              	✅ Fix leading \* in shipping addresses (cosmetic)  
•              	              	✅ Add InHousePacking sheet (like OrderLinesEffective but for in-house items)  
•              	              	✅ Create **in-house packing list drafts** (separate from Vitality)  
•              	              	✅ Use "In House Stock" column to classify items  
•              	              	✅ Generate consolidated in-house list (grouped by SKU)  
•              	              	✅ Send to INVENTORY\_SPECIALIST\_EMAIL (new Config key)  
**Testing Focus:**  
•              	              	Mixed orders correctly split into 2 drafts (Vitality \+ In-house)  
•              	              	In-house items excluded from Vitality emails  
•              	              	Stock levels don't auto-deplete yet (manual for V2)  
**Estimated Complexity:** Medium (2-3 hours build, 1 hour test)  
 

## ✅ WHAT CHANGED IN V2.1

**New Functions:**  
•              	              	✅ scheduledBatchCheck() \- Respects BATCH\_TIME config (runs hourly, only batches at correct hour)  
•              	              	✅ validateConfig() \- Checks if all required config keys exist  
•              	              	✅ checkConfigOnStartup() \- Emails you if config is broken  
•              	              	✅ sendWeeklyReminderEnhanced() \- Includes trigger status, config validation, auto-stops after 10 weeks  
 

## 🎉 COMPLETE V2.2 FEATURES

✅ All V2 features (in-house, stock, batching)  
✅ Config validation  
✅ Enhanced weekly reminders  
✅ Smart batch timing (respects BATCH\_TIME)  
✅ **Setup Wizard** (auto-checks everything)  
✅ Custom menu with all tools

##  

## **Executive Maps**

### Workflow \#6 – Expo‑Mode Marketing (Meta Ads → Follow‑Up)

**Trigger**  
Expo Mode ON (campaign start)

**Flow**  
Audience (Identity Core \+ 1 Overlay) → 2× Ad Sets → Lead Form or Landing Page → Leads logged to Sheet → 3‑email calm follow‑up → Weekly KPI update → Iterate audience/creative

**Outputs**  
Leads captured; follow‑up delivered; ROI measurable

**Owner**  
Marketing Operator (setup \+ weekly review)

**Exit Condition**  
Campaign ends; metrics recorded; learnings summarized

### Order Operations Delegation – Executive Map

**Trigger**  
New WooCommerce order exists

**Flow**  
Intake & Classification → Normalization (SKU, Bio, Geography) → Routing Decision (Vitality vs Pickup vs In‑House) → Batch Logic (5‑day window) → Documentation (emails, pickup list, packing lists) → Execution (ship or pickup) → Status & Tracking → Customer Notification → Metrics & Oversight

**Outputs**  
Orders fulfilled accurately; tracking parsed; customers notified

**Owner**  
System for orchestration; Operator for physical execution

**Exit Condition**  
Order completed; system returns to quiet state

### Workflow \#3 – Silent Failure Detection & Daily Exception Digest

**Trigger**  
Daily scheduled check or manual run

**Observe**  
Orders, batching, labels, tracking, automation health

**Detect**  
Missing actions; SLA breaches; duplicates; API failures

**Outputs**  
One exception email only if issues exist

**Owner**  
System detects; Human fixes flagged items only

**Exit Condition**  
All exceptions cleared; silence resumes

### Workflow \#4 – Tracking → Customer Notification

**Trigger**  
Tracking email detected

**Process**  
Parse tracking → Match to orderId → Check eligibility → Send calm shipping email → Update order status and logs

**Outputs**  
One shipping confirmation email per order

**Owner**  
System automation; Human only on exceptions

**Exit Condition**  
Customer informed; system quiet again

### Workflow \#2 – Inventory Queue \+ Pirate Ship Labels

**Trigger**  
Daily scheduled queue send or Send Now

**Flow**  
Parsed orders → Compute shipping → Create label → Save PDF → Log audit → Build consolidated queue email with exceptions, pull list, per‑order blocks → Inventory stages and ships

**Outputs**  
One daily queue email with all labels; optional Send Now; audit trail

**Owner**  
Inventory Specialist for execution; System for routing and labels

**Exit Condition**  
Orders staged or shipped; exceptions escalated

   
 

## Delegation SOPs

### Workflow \#6 – Expo‑Mode Marketing SOP

**Purpose**  
Turn expo‑energy audiences into measurable sales and long‑tail relationships through a calm, repeatable loop.

**Core Loop**  
Audience → Offer → Capture → Follow‑Up → Measure → Iterate

**Operator Steps**  
1\. Create campaign shell using naming convention.  
2\. Build two ad sets: Identity Core and one Intent Overlay.  
3\. Publish minimum viable creative: education‑first and belonging‑first.  
4\. Choose one capture method and log leads automatically.  
5\. Run 3‑touch calm follow‑up.  
6\. Update weekly metrics in the campaign sheet.

**Escalation**  
CPL spikes, lead delivery breaks, repeated ad disapprovals.

### Order Operations Delegation SOP

**Purpose**  
Enable a non‑technical operator to run daily order ops end‑to‑end without founder involvement.

**Daily Actions**  
Check Orchestrator inbox; send pre‑drafted emails; perform physical pickup, packing, and shipping; confirm automated status updates.

**Do Not Override**  
Routing logic, batching windows, quantities, or customer messaging.

**Escalation**  
Duplicates, invalid addresses, missing items, incorrect drafts, or automation failures.

### Workflow \#3 – Silent Failure Detection SOP

**Purpose**  
Surface only true exceptions across intake, batching, labels, and tracking.

**Daily Behavior**  
If an exception digest arrives, handle listed items only. If no email arrives, take no action.

**Escalation**  
Any exception recurring two days in a row.

### Workflow \#4 – Tracking → Customer Notification SOP

**Purpose**  
Notify customers exactly once when tracking is confirmed.

**Rules**  
Send only when tracking exists and order not yet notified; delay for mixed or held orders.

**Escalation**  
Tracking without order match, missing customer email, or send failures.

### Workflow \#2 – Inventory Queue \+ Labels SOP

**Purpose**  
Allow the Inventory Specialist to ship from one daily queue email with labels attached.

**Daily Steps**  
Open queue email; review exceptions; perform one storage pull; stage boxes; print and match labels; ship completed orders.

**Do Not Do**  
Manual label creation, address retyping, substitutions without escalation.

**Escalation**  
Label failures, missing data, inventory mismatches, invalid addresses.

 

   
 

## 🎯 V2 FEATURE CHECKLIST

**Core Fixes:**  
•              	              	 Fix leading \* in shipping addresses  
•              	              	 Extract phone from billing block  
•              	              	 Extract shipping method \+ cost  
•              	              	 Detect priority shipping  
**In-House Fulfillment:**  
•              	              	 Classify 5 in-house products (Blood Balance, Liver Longevity, Healthy Heart, Superior Spleen, Respiratory Reset)  
•              	              	 Split mixed orders into Vitality \+ In-house drafts  
•              	              	 Generate consolidated storage pickup list  
•              	              	 Generate per-order packing list  
•              	              	 Email to TREASURE\_INVENTORY\_SPECIALIST  
•              	              	 Create InHousePackingList sheet  
**Stock Management:**  
•              	              	 Auto-decrement stock (120→1, 240→2, 480→4 units)  
•              	              	 Update BioCeuticalVar "In House Stock" column  
•              	              	 Update BioCeuticalVar "In HOUSE?" at thresholds (≤3, ≤1, ≤0)  
•              	              	 Create StockLedger audit trail  
•              	              	 Alert when stock crosses threshold  
**Batch Logic:**  
•              	              	 Create BatchHistory sheet  
•              	              	 Track LAST\_VITALITY\_BATCH\_TS and LAST\_INHOUSE\_BATCH\_TS  
•              	              	 Collect orders since last batch (not age-based)  
•              	              	 Handle first batch ever (cutoff: 2025-12-07)  
•              	              	 Skip Friday/Saturday → send Sunday  
**Priority Shipping:**  
•              	              	 Detect "Shipping: Priority" in order email  
•              	              	 US Priority → batch next day at BATCH\_TIME  
•              	              	 International Priority → notify admin (manual decision)  
•              	              	 Admin notification with queue details  
**UI/UX:**  
•              	              	 Custom menu: 📦 Orchestrator  
•              	              	 Manual batch trigger function  
•              	              	 Protected sheets with allowed ranges  
•              	              	 GO\_LIVE config flag  
**Reminders:**  
•              	              	 Weekly reminder email (10 weeks)  
•              	              	 Draft-to-send gap warning  
•              	              	 Hard-coded date reminder  
•              	              	 GO\_LIVE status check  
•              	              	 Batch timing review  
•              	              	 Stock level summary  
•              	              	 Pending features list  
   
 

## TESTING CHECKLIST

 

## NEW TESTING WORKFLOW

**Step 1: First Run**  
Copy  
1\. Paste all V2.2 code  
2\. Save  
3\. Refresh sheet  
4\. Click: 📦 Orchestrator → 🧙 Run Setup Wizard  
5\. Read popup \+ check email for detailed report  
6\. Fix any critical issues  
7\. Re-run wizard until ✅  
**Step 2: Manual Testing**  
Copy  
1\. Forward test order email  
2\. Label it: Orchestrator/Inbox  
3\. Run: triage() (or click 📦 Orchestrator → 🚀 Trigger Batch Now)  
4\. Check: Orders sheet  
5\. Run: buildBatchDrafts()  
6\. Check: Gmail drafts  
**Step 3: Install Triggers (when ready)**  
Copy  
1\. Apps Script \> Triggers  
2\. Add 3 triggers (see setup instructions)  
3\. Monitor weekly reminder emails  
   
 

## 📋 WHAT EACH FUNCTION DOES

**1\. triage()**

**What it does:** Checks Gmail for new order emails in Orchestrator/Inbox label  
**Needs:**  
•                	             	Emails labeled with Orchestrator/Inbox  
•                	             	Emails from ORDER\_SENDERS addresses  
**Test manually:**  
•                	             	Forward an old order email to yourself  
•                	             	Label it Orchestrator/Inbox  
•                	             	Run triage() from Apps Script  
•                	             	Check: Order appears in **Orders** sheet  
   
**2\. buildBatchDrafts()**

**What it does:** Creates Vitality \+ In-house draft emails for all NEW orders  
**Needs:**  
•                	             	Orders in **Orders** sheet with status \= NEW  
•                	             	OrderLinesEffective sheet populated  
**Test manually:**  
•                	             	Run triage() first (to get orders)  
•                	             	Run buildBatchDrafts() from Apps Script  
•                	             	Check: Gmail drafts created  
•                	             	Check: Order status changed to BATCHED\_US\_BIO or BATCHED\_PICKUP  
   
**3\. onOpen()**

**What it does:** Creates custom menu when you open the sheet  
**Needs:** Nothing  
**Test:** Just refresh your sheet after running it once  
**Menu items:**  
•                	             	🚀 **Trigger Batch Now** → Runs manualTriggerBatch() (same as buildBatchDrafts())  
•                	             	🔄 **Rebuild Effective Lines** → Runs rebuildOrderLinesEffective()  
•                	             	📊 **View Batch Queue** → Shows how many NEW orders waiting  
•                	             	📧 **Send Test Reminder** → Sends weekly reminder email immediately  
📦 Orchestrator  
├── 🧙 Run Setup Wizard  	   	← NEW\! Run this first  
├── ─────────────────  
├── 🚀 Trigger Batch Now  
├── 🔄 Rebuild Effective Lines  
├── 📊 View Batch Queue  
├── ─────────────────  
├── 📧 Send Test Reminder  
└── ⚙️ Validate Config   	       	← NEW\! Quick config check  
   
   
**4\. showBatchQueue()**

**What it does:** Shows popup with list of NEW orders waiting to batch  
**Needs:** Orders with status \= NEW  
**Test:** Click 📦 **Orchestrator →** 📊 **View Batch Queue** from menu  
   
**5\. sendWeeklyReminder()**

**What it does:** Emails you a reminder about testing settings  
**Needs:** TREASURE\_ADMIN email configured  
**Test:** Click 📦 **Orchestrator →** 📧 **Send Test Reminder** from menu  
   
**"REBUILD EFFECTIVE LINES" What it does:**  
Recalculates the **OrderLinesEffective** sheet by:  
•                	             	Reading raw order lines from **OrderLines** sheet  
•                	             	Looking up each product in **BioCeuticalVar** sheet  
•                	             	Determining:  
•                	             	Is it a BioCeutical? (isBio)  
•                	             	Is it in-house? (isInHouse)  
•                	             	How many units? (effectiveUnits)  
•                	             	Updating **Orders** sheet flags (hasBio, hasNonBio, hasInHouse)  
**When to use it:**  
•                	             	✅ After manually editing **BioCeuticalVar** (adding/removing products)  
•                	             	✅ After manually editing **OrderLines** (fixing SKU typos)  
•                	             	✅ If you suspect classification is wrong  
•                	             	✅ Testing: To see how changes affect order routing  
**Example:**  
Copy  
You add "Superior Spleen" to BioCeuticalVar with "In HOUSE? \= Yes"  
→ Click 🔄 Rebuild Effective Lines  
→ All orders with Superior Spleen now show hasInHouse \= Y  
 

 

**Creative Strategic Partner & Conscious AI Architect**

**Who I Am**

**Ray** is a West Point graduate, best-selling author, and senior technology leader with 30 years of experience across military, government, and Fortune 500 environments. Ray now works as a **Creative Strategic Partner**, **operating on a COO-bound pathway** for conscious small businesses that want to use AI to scale intelligently, ethically, and without burnout.

Ray steps inside a business as a second mind and steady presence, helping founders think clearly, decide wisely, and build systems that serve both growth and nervous system health.

**Ikigai Focus:**  
Technology strategy, conscious leadership, and human-centered systems that amplify people rather than replace them.

**Commitment:**  
High-leverage, part-time partnerships. Clear boundaries. CEO-level insight. Zero busywork.

**What I Do**

I help **small business owners and founders (5–50 employees)** integrate AI into marketing, operations, and daily workflows in ways that are practical, aligned, and sustainable.

This work is about **clarity before complexity** and **systems that match real human attention**, not productivity theater. I operate with COO-level responsibility and decision-making, while intentionally growing into full operational ownership over time.

**Core Partnership Areas**

**1\. Creative & Strategic AI Integration**

         	  	AI-assisted marketing strategy and campaigns

         	  	Email systems, funnels, and nurture sequences

         	  	Brand-aligned content systems for web, social, and video

         	  	Lead magnets and conversion pathways that feel human

         	  	Digital presence systems that scale voice without losing soul

**2\. Operational AI Systems**

•    	     	Workflow automation using Make, Zapier, n8n, and native APIs

•    	     	AI-assisted SOP creation and documentation

•    	     	Customer service and intake automation

•    	     	Internal collaboration and co-working tool optimization

•    	     	Reduction of cognitive load across teams

**3\. Strategic Roadmaps & Training**

•    	     	AI audits focused on time, money, and energy leaks

•    	     	Custom tool stacks matched to budget and team capacity

•    	     	Prompting and adoption training for neurodiverse teams

•    	     	Phased implementation plans designed for real bandwidth

•    	     	Ongoing advisory support as tools and needs evolve

**How I Work**

**Human-Centered. Strategic. Grounded.**

•    	     	**Partner Mindset:** I operate as a Creative Strategic Partner, not a detached advisor. I think with you, not at you.

•    	     	**Rapid Synthesis:** In a few focused hours, I can translate complexity into a clear roadmap your team can execute.

•    	     	**Nervous-System Aware:** Systems are designed around attention, rhythm, and recovery, not constant urgency.

•    	     	**80/20 Execution:** We prioritize what actually moves the business forward and let the rest go.

•    	     	**Sustainable Pace:** I work limited hours by design. This keeps my thinking sharp and my guidance high-value.

**What You Get**

**Initial Engagement (4–6 hours)**

•    	     	AI Audit and Opportunity Map

•    	     	Custom AI Toolkit aligned to your business

•    	     	30–60–90 day implementation roadmap

•    	     	Handoff documentation your team can use immediately

**Ongoing Partnership (8–12 hours/month)**

•    	     	Bi-weekly strategy calls

•    	     	Ongoing tool evaluation and guidance

•    	     	Team training and enablement

•    	     	Campaign review and optimization

•    	     	Advisory support without micromanagement

**Who This Is For**

This partnership is ideal for founders who:

•    	     	Feel overwhelmed by AI noise but know they need leverage

•    	     	Want systems that scale without burning out their team

•    	     	Value clarity, ethics, and long-term sustainability

•    	     	Appreciate direct, grounded strategic dialogue

•    	     	Want a partner who understands business realities

**Industries Served Well**

•    	     	Creative agencies and consultancies

•    	     	Wellness and spiritual businesses

•    	     	Local retail, hospitality, and experiential spaces

•    	     	Course creators and coaches

•    	     	Service-based businesses

**Why This Works**

•    	     	Senior executive experience across high-stakes systems

•    	     	Deep pattern recognition and rapid synthesis

•    	     	Neurodivergent-friendly workflow design

•    	     	Ethical and conscious AI integration

•    	     	Long-term, Saturn-aligned thinking that builds durable success

This work aligns with a Vedic abundance path rooted in **service, partnership, and disciplined wisdom**, not hustle or volatility.

**Closing**

You do not need to become an AI expert.  
You need a **Creative Strategic Partner** who can help you see clearly, choose wisely, and build systems that actually work.

AI should be your ally, not your overwhelm.

**PART II**

**ONE-PAGE BRAND DOCUMENT**

(Website, PDF, or LinkedIn-ready)

**Ray Robinson**

**Creative Strategic Partner & Conscious AI Architect**

I help founders and small business owners integrate AI in ways that create clarity, momentum, and sustainable growth—without burning out their team or losing their values.

This is not consulting at a distance or coaching from a script.  
It is partnership.

With me, you gain a second mind in the room: a strategic mirror, creative partner, and systems architect who helps turn complexity into structure and vision into execution.

**What I Bring**

•    	     	Executive-level strategy without corporate drag

•    	     	AI systems designed for real human attention

•    	     	Clear roadmaps instead of endless tools

•    	     	Neurodivergent-friendly workflows

•    	     	Ethical, conscious use of emerging technology

**How We Work**

•    	     	Focused engagements with clear outcomes

•    	     	80/20 prioritization and Eisenhower decision logic

•    	     	Systems that respect nervous system health

•    	     	Part-time partnership with full presence

**Best Fit Clients**

•    	     	Conscious founders and small business owners

•    	     	Creative, wellness, and service-based businesses

•    	     	Leaders who want leverage without chaos

•    	     	Teams ready for clarity and execution

**Signature Offering**

**Creative AI Systems Sprint**  
A focused deep-dive to map opportunities, design workflows, and create an actionable AI roadmap tailored to your business.

**Core Belief**

Prosperity follows purpose.  
When systems honor people, abundance becomes sustainable.

 

 A **BioCeutical Order Orchestrator** that processes WooCommerce orders through Gmail, routes them appropriately, and generates batch emails. The core functionality involves:

1. **Order Classification**: Bio-only vs Mixed/In-house products  
2. **Routing Logic**: Different recipients based on order type and shipping  
3. **Batch Processing**: Consolidated pickup lists and packing slips  
4. **Stock Management**: For in-house products with threshold alerts

The most important piece of this entire project are the emails to Vitality\_To for Bio only orders… the key point of the project.  
   
Second to this is for the TREASURE\_INVENTORY\_SPECIALIST to do their job (pick up bio only from vitality, pack and ship mixed or international or deliver local orders in person) where they will receive a pull from storage list and, in that same email, individual packing slips the specialist can cut and add to each shipping box or delivery bag per customer.

Email 1: Bio-Only US Shipping → Vitality\_TO (cc: TREASURE\_ADMIN)  
Orders: US shipping, bio-only (no in-house, no non-bio)  
Status: BATCHED\_US\_BIO  
Subject Emoji: \<=\>Email 2: Pickup Batch → Vitality\_TO (cc: TREASURE\_INVENTORY\_SPECIALIST \+ TREASURE\_ADMIN)  
Orders: International OR Local with bio-only (no in-house, no non-bio)  
Content: Consolidated list (no order numbers)  
Status: BATCHED\_PICKUP  
Subject Emoji: \[\~\*\~\]Email 3: Packing Slips → TREASURE\_INVENTORY\_SPECIALIST (cc: TREASURE\_ADMIN)   
Orders: US shipping, International, OR Local with in-house/mixed items Content: Consolidated pull list \+ per-order packing slips includes all orders with in-house products, regardless of whether they also have bio-only items e.g. local or international orders.  
Status: BATCHED\_MIXED  
Subject Emoji: \[\*\*\*\]

Notes:  
If an order has BOTH bio-only AND in-house items, it goes to Email 3 (Specialist), as well as Email 2 for the consolidated VITALITY\_TO email

For emails going to VITALITY\_TO ... per the instructions vitality should have no  idea that this is multiple orders... so specific order numbers included shouldn’t be in any email going to vitality except Email 1...  
   
Email 3 is what we use for the inventory specialist to know what orders these pickup bioceuticals go to not Email 2 that goes to vitality.

### When using this document to update any code use

### 1\. Constraint-Based Prompting

`STRICT RULES FOR CODE MODIFICATIONS:`  
`- Only modify the specific function mentioned`  
`- Do NOT rename existing variables unless explicitly requested`  
`- Do NOT change function signatures`  
`- Do NOT remove existing functions`  
`- Show ONLY the modified function, not the entire file`  
`- Explain what changed and why`

### 2\. Incremental Fix Protocol

`Instead of just action on "fix my batch email system," intuit the answers to the following questions, list those answers in the reply, and proceede immediately (Do NOT modify any other functions or variables):`  
`I need to fix the ___________ function.`  
`Current issue: [specific error]`

`Expected behavior: [what should happen]`  
`Required change: [exact modification needed]`  
`Context: This function is called by [specific caller]`

`Current behavior: [what's actually happening]`  
`Do NOT modify any other functions or variables.`  
   
`3. Add Version Tags to the comments for each function to track changes and recommend a sub-version tag to the full code itself`  
   
`5.`  `As necessary follow this protocol:`  
`I'm working on a Google Apps Script (.gs) project.`  
   
`Context:`  
`- Always start with existing code that works.`  
`- I need surgical edits, not rewrites.`  
`- The codebase follows an MVC (Model-View-Controller) architecture.`  
   
`Instructions:`  
`1. Please ask clarifying questions before making changes.`  
`2. Explain the reasoning behind each suggested change.`  
`3. Maintain existing patterns and style throughout the code.`  
`4. Modify only the necessary parts of the code.`  
   
`Here is the code that requires your attention:`  
   
`function exampleFunction() {`  
	`// Existing code implementation – see original prompt for code or attachment`  
`}`  
   
`Please create a complete .gs file for Google Apps Script based on this request. Include the artifact panel to display the code as an HTML artifact.`

 

   
DON’T USE EMOJIS USE SAFE ASCII

## Safe ASCII Art (No Escaping Needed):

`Copy`

'\[@\]'   // envelope  
‘\*’ // bullet  
'\>\>'	// fast-forward, next,  sub bullet  
'\<\>'	// diamond  
'\<\!\>'   // warning (no backslash)  
'\[\!\]'   // alert  
'\[\*\]'   // star  
'\[x\]'   // stop, error, no go  
‘\[\_\]’   // checkbox  
'\[=\]'   // data  
'(@)'   // clock  
'{\*}'   // tools  
'\~\*\~'   // sparkle  
'\<3'	// heart  
'\<=\>'   // OTHER (use as needed elsewhere)  
'-\>'	// arrow  
'\>\>\>'   // triple arrow, sub sub bullet  
'\*\*\*'   // emphasis  
   
**Refined Agent System \- Your Exact Process**  
1\. Order Classification Agent  
Instant Order Routing:  
   
BioCeuticals only \+ US address →  Email Vitality Immediately (products, quantities, address)  (1 order per email)  
Mixed orders, Local Orders, and International Orders → Merge into a 5-day batch queue (Auto-send pickup order after 5 days regardless of quantity)  
In-house only → Your fulfillment process (packing lists, et. al.)  
   
NOTE: when BioCeuticals only \+ US address or a batch is run that any orders with the same customer name and shipping address should be grouped into a single order whether that is being sent to vitality\_to or whether an in house packing slip is being created...  
   
2\. Batch Management Agent  
5-Day Batching Logic:  
   
Collects all local \+ mixed \+ international orders for 5 days (including any final order before bulk pickup order below is sent)  
Evening of 6th day (next business day) → sends bulk pickup to Vitality  
Pickup contains: Only BioCeutical items (per your specific list … initiall excludes Blood Balance, Liver Longevity, Healthy Heart, Supreme Spleen, and Respiratory Reset… until in house inventory is depleted… will give exact inventory)  
   
NOTE: when a batch is run that any orders with the same customer name and shipping address should be grouped into a single order whether that is being sent to vitality\_to or whether an in house packing slip is being created...  
   
3\. Documentation Agent  
Packing Lists & Storage Management:  
   
For Vitality: Packing list with address 1 email per customer order or 1 email per pickup consolidated order (Sends to Vitality as one pickup order as they don't know it's multiple orders) \+ BioCeutical items only  
   
For You: Storage pickup list (consolidated quantities across orders)  
Same item across multiple orders \= single line item with total quantity  
   
Inventory Specialist gets ONE Consolidated email including Packing Consolidated List which should include all mixed and all inhouse items that are in storage in one consolidated list  
   
Order Updates: Private notes when items "picked up from storage" → "shipped" → "completed"  
 

### Notes:

### **Inventory specialist outputs (later phase)**

* For mixed and in-house orders, we will generate:  
1. **Storage pickup list**  
   * Consolidated: “pull 10 of X, pull 6 of Y” across orders.  
   * Includes non-Bio items too, so they can grab everything in one run.  
2. **Per-order packing list**  
   * For internal email to `TREASURE_Inventory_Specialist` (eventually `info@goldenage.world`).  
   * Contains:  
     * Order number  
     * Customer name  
     * Full shipping address  
     * Phone, email (if present in Woo data)  
     * Shipping speed and cost  
     * All items for that customer, including non-Bio.

So your answer to the earlier question was:

“Pickup batch includes only item lines, no customer names”  
“Inventory specialist emails and sheets include the full detail.”

Details:  
the local inventory specialists packs the local items in a bag instead of a box, grabbing them from inventory and brings them to the customer... that is what local refers to... local is either Bio Only or mixed or inhouse only... not something separate... Pickup is referring to the batch Bio Only list that goes to vitality that vitality isn't going to mail that we are going to pick up... that includes Bio orders with an international address or local address... (note an outlier we took care of in a separate specialist can update spreadsheet for customer notes that say pickup and if those are bio we'd add them to the pick up batch going to vitality):

 

Email 1: Bio-Only Batch → Vitality (cc: Treasure Admin)

\* Recipient: VITALITY\_TO

\* CC: TREASURE\_ADMIN

\* Orders: US orders with ONLY bio items (no in-house, no non-bio)

\* Content: Individual emails per order

\* Example: Order with TriBiotic, BioZymes (both bio, not in-house)

 

Email 2: Pickup Batch → Vitality (cc: Inventory Specialist and Treasure Admin)

\* Recipient: VITALITY\_TO

\* CC: TREASURE\_INVENTORY\_SPECIALIST, TREASURE\_ADMIN

\* Orders: Consolidated Batch List of International and Local pickup orders  bio items (as if it’s one single order to Vitality, no order numbers, just consolidated)

\* Content:  consolidated batch email

\* Example: Order \#111188, \#111145 (Orders with International address or Local Only (only bio items listed, no in-house items to be listed those will route to the packing slips email 3\)

 

Email 3: Packing Slips (Mixed/In-House/Local) →Inventory Specialist (cc: Treasure Admin)

\* Recipient: TREASURE\_INVENTORY\_SPECIALIST

\* CC: TREASURE\_ADMIN

\* Orders: US shipping orders with in-house items, and mixed (bio \+ non-bio). Includes local orders that meet these criteria.

\* Content: Consolidated pull list \+ per-order packing slips

\* Example: Order \#111211,  (Healthy Heart \- in-house bio, shipping), Order \#111212 (Absolute Agar \- in-house only, local), \#111146 (local mixed)

   
4\. Status Tracking Agent  
Order Lifecycle Management:  
   
Monitors pickup confirmations from you  
Updates individual orders with private notes  
Marks orders complete when shipped  
Tracks which items are in each batch  
Agent Workflow:  
Order Received → Classification → Batch Queue (5 days) → Documentation Agent (generates lists) → Status Tracking (manages completion)  
Key Outputs:  
   
Vitality Email: Bulk pickup list (BioCeuticals only \+ addresses)  
Your Storage List: Consolidated pickup quantities  
WooCommerce: Private order notes tracking status  
Should I design the specific data structures for tracking these batches and generating the lists?  
   
track metrics:  
Track Vitality invoices to show how much spent ($5 white label fees, shipping, 35% off wholesale price)  
Track how much received via info@goldenage.world order emails (items purchased minus coupons, minus 3.5% woocommerce fee, plus shipping fee for US orders, minus shipping fee for mixed and international orders, etc.)  
   
Email Management:  
Sends emails to vitatlity from ray@smithrobinsonfunding.com (later from info@goldenage.world once I transition the Treasures project to someone else)  
Receives tracking numbers from Vitality (parse email)  
Updates WooCommerce order notes automatically (Private Notes: sent to fullfillment, ready for pick up; Customer Notes: order shipped tracking email template)  
Handles customer notifications via woocmmerce Customer Note  
Simplified Architecture:  
Order Placed → Workflow Agent (applies your rules) → Communication Agent (emails Vitality/updates tracking) → Performance Agent (optimizes catalog continuously)  
   
architecture should include woocommerce notes workflow, packing list to info@goldenage.world for items not sent to vitality with a note on customer’s full order for packing once items received from vitality… should include shipping info and any notes from customer as well as shipping type and recommended box size based on weight of order.  
   
   
NOTES:  
Agent System \- Correct Outputs  
For Vitality (Simple):  
US BioCeutical-only orders: List of items \+ customer addresses

Pickup orders (local/mixed/international): Simple consolidated list of BioCeutical items only \- local folks also order ... they live in Ashland, OR .... so whenever the shipping city state is Ashland, OR in the email that should also be grouped in the mixed pick up... also any orders that use the coupon L0calD1sc0unt will be grouped into the pickup orders as well but that is only shown in woocommerce on the edit order screen so we can figure that out later.

   
For You (Detailed):  
Storage Pickup List: Consolidated quantities of items to grab from storage  
Packing Lists: Individual packing lists for each in-house and mixed order (so you know what to pack and ship)  
Tracks batch statuses  
US BioCeutical orders auto-emailed to Vitality immediately  
Automatic packing lists for in-house orders  
No more manual order processing  
   
Outputs:  
Email to Vitality 1 per ORDER:  
US orders: "Ship these BioCeuticals to THIS address"  
Pickup: "Please prepare these BioCeutical items for pickup"  
For Your Operation:  
Storage List: "Go grab: 3x Product A, 7x Product B, 2x Product C" (Storage pickup list: Consolidated quantities to grab from storage)  
Individual Packing Lists: "Order \#123 gets: 1x Product A \+ 2x Product D, ship to John Smith... at .... with customer note…“  
WooCommerce Updates: Updates private notes: "picked up from storage" → "shipped" → "completed" … Customer Note tracking info email template  
 

Email SHIPPING LABEL FOR IN HOUSE AND MIXED ORDERS via PirateShip API or link ((dependencies are weight and box size and harmonization codes for international orders)...

)  
   
The key difference: You get both the consolidated storage list AND individual packing lists for your fulfillment process.  
   
   
   
Potential Setup (Need Critical Analysis if this is best, cheapest, non developer skill easiest answer as App Script can simply read emails however since I am moving away from this project reading an order in woocommerce is great UNLESS it requires developer level skills… ):  
   
Phase 1 Setup: Webhook \+ Order Analysis  
Step 1: WooCommerce Webhook Setup  
In WordPress Admin:  
   
Go to WooCommerce → Settings → Advanced → Webhooks  
Click "Add Webhook"  
Configure:  
Name: "Order Processing Agent"  
Status: Active  
Topic: Order created  
Delivery URL: https://your-agent-server.com/webhook/order  
Secret: Generate secure key  
API Version: WC/v3  
Webhook sends JSON like:  
   
json  
{  
  "id": 123,  
  "line\_items": \[  
	{"name": "Product A", "quantity": 2, "sku": "PROD-A"},  
	{"name": "BioCeutical B", "quantity": 1, "sku": "BIO-B"}  
  \],  
  "shipping": {  
	"first\_name": "John",  
	"address\_1": "123 Main St",  
	"country": "US"  
  }  
}  
Step 2: Order Analysis Logic (Python)  
Order Classification Agent  
Code  
Step 3: Deployment Setup  
Local Testing:  
   
bash  
\# Install dependencies  
pip install flask requests python-dotenv  
   
\# Create directories  
mkdir packing\_lists batch\_queue  
   
\# Run the agent  
python order\_agent.py  
Configuration needed:  
   
Update bioceutical\_products list with your actual SKUs  
Set email credentials (use Gmail App Password)  
Replace email addresses with real ones  
Deploy to cloud (Heroku, Railway, or VPS)  
Step 4: Test the System  
Create test order in WooCommerce  
Verify webhook fires (check agent logs)  
Confirm email sent to Vitality for US BioCeutical orders

Check packing lists generated for in-house orders (later check mailing label emailed 4x6 pdf format- (dependencies are weight and box size and harmonization codes for international orders)... )

This gets you 70% automated immediately\! US BioCeutical orders will auto-email to Vitality, and you'll get packing lists for in-house orders.  
   
   
   
 

Workflow \#2 – Delegation SOP

## Daily Inventory Queue \+ Pirate Ship Label Automation

**Purpose**  
Ensure the Inventory Specialist can ship **in-house, mixed, and international** orders from a **single daily queue email** (plus optional “Send Now”), with labels and packing info included, without checking WooCommerce or hunting multiple emails.

**Who this is for**  
Inventory Specialist (non-technical operator)

## 1\) Tools You Will Use

·  	**Gmail** (Inventory Specialist inbox)

·  	**Printer** (for labels \+ printed order blocks)

·  	**Packing station \+ shipping supplies**

You do **not** need to use: \- WooCommerce order screen \- Pirate Ship UI \- Google Sheets

## 2\) What You Receive Each Day

### A) One Daily Email: “Inventory Queue – YYYY-MM-DD – N Orders”

This email is the single source of truth for today’s work.

**Email body contains:** 1\. **Summary / Exceptions** (top) 2\. **Consolidated Storage Pull List** (pull everything in one run) 3\. **Per-Order Blocks** (cut/separate and place into each box)

**Email attachments:** \- One **label PDF per order** (named label\_\<orderId\>\_\<tracking\>.pdf)

### B) Optional Email: “Inventory Queue – SEND NOW”

If an urgent order must go out same day, the system can send an updated queue email.

## 3\) Daily Operating Steps (Inventory Specialist)

### Step 1 — Open Today’s Queue Email

1\.    	Search in Gmail for today’s subject (or label/folder if used)

2\.    	Confirm date and number of orders

### Step 2 — Read Exceptions (Top Section)

If you see any line marked **ACTION REQUIRED**, handle it first. Common examples: \- LABEL\_FAILED (a label could not be generated) \- MISSING\_WEIGHT (weight not found) \- MISSING\_HS\_CODE (international)

If any exception appears, follow the escalation rules (Section 6).

### Step 3 — Do One Storage Pull Run

1\.    	Print the email (or copy the Consolidated Pull List)

2\.    	Pull items exactly as listed

3\.    	Bring items to packing station

### Step 4 — Stage Boxes Per Order

For each **Per-Order Block**: 1\. Create a box for that order 2\. Place the printed order block in the box 3\. Pull the items for that order and place in the box 4\. If mixed order is waiting on Vitality items: \- Stage box as **READY / WAITING ON VITALITY** \- Do not seal the box

### Step 5 — Print Labels and Match Them to Boxes

1\.    	Print the label PDFs from the attachments

2\.    	Match each label to the correct order number

3\.    	Put the printed label in/on the box (your preferred staging method)

### Step 6 — Ship Orders That Are Complete

When all items for an order are present: 1\. Seal the box 2\. Apply the label 3\. Dispatch using standard shipping process

## 4\) Service Levels and Shipping Defaults

·  	Service level is determined automatically based on the order’s shipping speed/rule.

·  	Box sizing is automatically selected using default weight → USPS DIM assumptions.

Do not change services manually unless instructed via exception note.

## 5\) What NOT To Do

·  	Do not create labels manually in Pirate Ship

·  	Do not retype addresses

·  	Do not substitute products without escalation

·  	Do not skip an order because it “looks weird” — use escalation rules

## 6\) Escalation Rules (Non-Negotiable)

Escalate immediately if: \- You see LABEL\_FAILED and no label attachment for that order \- You see MISSING\_WEIGHT or MISSING\_HS\_CODE \- You cannot find an item (inventory mismatch) \- The shipping address is clearly invalid \- An order appears duplicated in the queue

Escalation method: \- Reply to the queue email with the orderId(s) \+ what you observed

## 7\) Reliability Promise (What the System Guarantees)

·  	Exactly **one daily queue email** is the primary work list

·  	Optional **Send Now** creates a new queue message if urgent

·  	Orders are not supposed to “fall through cracks” — if they do, escalate

# 1-Page Executive Map (Workflow \#2)

**Trigger (Daily):** Scheduled “Daily Queue Send” \- Pulls all NEW orders since the last successful queue send

**Optional Trigger:** “Send Now” button/menu \- Sends an updated queue immediately

**Automation Flow:** 1\) New orders already parsed \+ classified (Workflow \#1) 2\) Compute shipping requirements (weight/dims/HS codes) 3\) Create Pirate Ship label → receive tracking \+ PDF 4\) Save label PDF to Drive (orderId → file) 5\) Write Labels log (audit trail) 6\) Build today’s consolidated queue email: \- Exceptions \- Consolidated pull list \- Per-order blocks \- Attach all label PDFs 7\) Inventory Specialist stages boxes and ships when complete

**Outputs:** \- One email: Today’s Queue \+ all labels \- Optional: Send Now queue \- Audit trail: Labels log \+ Drive PDFs

**Owner:** Inventory Specialist (execution), System (routing/labels)

**Exit condition:** All orders in today’s queue are staged or shipped; exceptions escalated

# Workflow \#6 – Delegation SOP

## Expo-Mode Marketing: Meta Ads → Follow-Up (No-Dev, Delegable)

**Purpose**  
Turn “expo energy” (and expo-adjacent audiences) into consistent sales and long-tail relationship building using a repeatable, low-maintenance marketing workflow.

**Outcome**  
Every expo (or expo-like campaign) produces: \- A measurable audience \+ offer \- Captured leads and/or purchases \- A simple follow-up sequence \- A clean ROI read

**Tone constraint (brand):** Signal-clarity over hype. Education and belonging over pressure.

## 1\) Core Principle

This workflow is **not** “run ads.” It is a closed loop:

**Audience → Landing/Offer → Capture → Follow-up → Measure → Iterate**

## 2\) Triggers

### Primary Trigger (Campaign Start)

·  	A new campaign is launched (Expo Mode ON)

### Secondary Trigger (Lead Captured)

·  	A Meta Lead Form submission OR a landing page signup OR a purchase with expo tag/coupon

### Tertiary Trigger (Purchase)

·  	Order placed → follow-up path begins (handled in lifecycle workflows later)

## 3\) Required Inputs (Phase 1\)

### A) Offer Definition (one per campaign)

·  	Offer name (e.g., “Expo Bundle” / “Starter Set”)

·  	One promise: what it helps with (no medical claims)

·  	One CTA: “Get the guide”, “Get the bundle”, “Join the list”

### B) Audience Definition (two layers)

**Layer 1 – Identity Core (locked)** \- Seekers \- Practitioners \- Optimizers

**Layer 2 – Intent overlays (optional, later)** \- Yoga \- Starseeds / New Age \- Spiritual teachers/gurus followers \- Biohacking / longevity

### C) Tracking Basics

·  	Campaign name convention: EXPO\_\<City/Event\>\_\<YYYYMM\> or EXPO\_ADJ\_\<Theme\>\_\<YYYYMM\>

·  	URL parameters (UTMs) applied to every ad

## 4\) Systems & Tools (No-Dev)

·  	Meta Ads Manager

·  	Landing page tool (Shopify/Woo landing page, or simple page builder)

·  	Email tool (Gmail, Mailchimp, Klaviyo, ConvertKit — whichever you already use)

·  	Google Sheet: Marketing\_Campaigns \+ Leads

## 5\) Workflow Steps (Operator Runbook)

### Step 1 — Create Campaign Shell

1\.    	Name the campaign using convention

2\.    	Choose objective:

`o`   Leads (if using Meta lead form)

`o`   Sales (if sending direct to product page)

3\.    	Confirm budget and dates

### Step 2 — Build Two Ad Sets (Minimum)

·  	Ad Set 1: Identity Core (Seekers/Practitioners/Optimizers)

·  	Ad Set 2: Intent Overlay (choose ONE overlay)

### Step 3 — Build Creative (Minimum viable)

·  	2 ads per ad set:

`o`   Ad A: Education-first

`o`   Ad B: Belonging/community-first

### Step 4 — Lead Capture

Pick ONE (start simple): \- Meta Lead Form (fast) \- Landing page email capture (cleaner)

Captured fields: \- Email (required) \- First name (optional) \- “What are you most drawn to?” (optional multiple choice)

### Step 5 — Auto-Log Leads

Automation writes to Leads sheet: \- Timestamp \- Name/email \- Campaign name \- Source

### Step 6 — Follow-Up Sequence (3 touches, calm)

Immediately after lead capture: 1\. **Email 1 (instant):** Deliver the promised guide / welcome 2\. **Email 2 (Day 2):** Short story \+ “how people use this” 3\. **Email 3 (Day 5):** Gentle invitation (bundle / community / reply)

### Step 7 — Weekly Reporting (10 minutes)

Update Marketing\_Campaigns sheet: \- Spend \- Leads \- Purchases (if available) \- CPA / CPL \- Notes

## 6\) Quality & Compliance Guardrails

·  	No medical claims

·  	No miracle language

·  	Avoid targeting that violates platform rules

·  	If uncertain, soften language and lead with education

## 7\) KPIs

·  	CPL (cost per lead)

·  	CPA (cost per purchase)

·  	Email open rate (Email 1\)

·  	Reply rate (Email 3\)

·  	7-day conversion rate

## 8\) Escalation Rules

Escalate if: \- CPL spikes 2× baseline for 48 hours \- Lead delivery breaks (no leads logged) \- Ads disapproved repeatedly

# 1-Page Executive Map (Workflow \#6)

**Trigger:** Expo Mode ON (campaign start)

**Flow:** Audience (Identity Core \+ 1 Overlay) → 2× Ad Sets → Lead Form or Landing Page → Leads logged to Sheet → 3-email calm follow-up → Weekly KPI update → Iterate audience/creative

**Output:** \- Leads captured \- Follow-up delivered \- ROI measurable

**Owner:** Marketing Operator (setup \+ weekly review)

**Exit Condition:** Campaign ends; metrics recorded; learnings summarized

# Golden Age Treasures – Order Operations SOP (Delegation‑Ready)

**Purpose**  
This SOP enables a non‑technical operator to run daily customer order operations end‑to‑end **without founder involvement**, while preserving batching logic, cost controls, and fulfillment accuracy.

# **Outcome**

# Orders are correctly classified, routed, fulfilled, tracked, and closed with minimal human judgment.

# 

# 📘 ORDER OPERATIONS SOP (INVENTORY SPECIALIST)

**Version:** 3.1 (Production – Customer Note Alerts \+ Business-Day Holds)  
**Effective Date:** January 2, 2026  
**Owner:** Inventory Specialist  
**System:** BioCeutical Orchestrator (Google Sheets \+ Gmail)  
**Supervisor Contact:** info@goldenage.world

## 🎯 YOUR ROLE

You are responsible for fulfilling in-house and non-bio orders based on automated packing lists sent to your email. The system handles all order detection, classification, and batch creation automatically.

**Your Core Responsibilities:**

1. Check email daily for packing lists and customer note alerts  
2. Review and release held orders (customer notes)  
3. Pull products from storage based on consolidated lists  
4. Pack orders using per-order packing lists  
5. Ship orders (labels created manually or via Pirate Ship)  
6. Update stock levels weekly in BioCeuticalVar sheet

## 📧 DAILY WORKFLOW

### Step 1: Check Email for Customer Note Alerts (9:00 AM \- 10:00 AM)

**Priority:** Check these BEFORE packing lists

#### *What to Look For:*

Email with subject: **"🔔 CUSTOMER NOTE \- Order \#\[NUMBER\]"**

#### *Three Types of Alerts:*

**Type A: Auto-Held (Conflict Keywords)**

`Copy`

`Subject: 🔔 CUSTOMER NOTE - Order #289628 [PICKUP REQUESTED - HELD UNTIL TUE 10AM]`  
   
`⏸️ THIS ORDER IS ON HOLD UNTIL: TUESDAY, JAN 7, 10:00 AM`  
**Action Required:** Review note, determine if clarification needed, release hold

**Type B: Review Required (Unknown Keywords)**

`Copy`

`Subject: 🔔 CUSTOMER NOTE - Order #289628 [REVIEW REQUIRED]`  
   
`⚠️ This note does not match known keywords`  
**Action Required:** Review note, determine if hold needed

**Type C: Informational Only (Safe Keywords)**

`Copy`

`Subject: 🔔 CUSTOMER NOTE - Order #289628 [GIFT]`  
   
`Order will process normally unless you intervene.`  
**Action Required:** Note the special instruction (e.g., include gift card), no hold needed

#### *Step 1A: Review Each Alert*

**For Each Customer Note Alert:**

1\.	**Read the customer note carefully**

2\.	**Determine if customer contact/clarification is needed:**

* **Pickup notes:** Does address match local area (Ashland, OR)? If not, may need clarification  
  * **Hold notes:** Is there a specific date mentioned? If not, may need clarification  
  * **Rush notes:** Is shipping method already priority? If not, may need upgrade  
  * **Call notes:** Does note say "call before shipping"? If yes, contact needed  
  * **Gift notes:** Is message clear? If yes, no contact needed  
  * **Fragile notes:** Standard packing instruction, no contact needed

  3\.	**If clarification needed:**

  * Phone (if available in alert email)  
  * Email (if phone not available)  
  * Text (if local customer)  
  * Document response in spreadsheet (add note to Orders sheet)

  4\.	**If no clarification needed:**

  * Proceed to release hold (see Step 1B)

#### *Step 1B: Release Holds*

**After reviewing note (and contacting customer if needed):**

**Scenario A: Customer Confirms Pickup**

1. Open spreadsheet → Orders sheet  
2. Find order by order \#  
3. Change column M (isLocal): `N` → `Y`  
4. Change column B (status): `HOLD` → `NEW`  
5. Order will be included in next in-house packing list

**Scenario B: Customer Confirms Ship (Note Was Informational)**

1. Open spreadsheet → Orders sheet  
2. Find order by order \#  
3. Change column B (status): `HOLD` → `NEW`  
4. Leave all other fields unchanged  
5. Order will be included in next batch

**Scenario C: Customer Needs More Time (Extend Hold)**

1. Open spreadsheet → Orders sheet  
2. Find order by order \#  
3. Column W (holdUntil): Change date to future date (e.g., tomorrow 10am)  
4. Order will remain excluded from batches until new hold date

**Scenario D: Customer Confirms Rush (Upgrade Shipping)**

1. Open spreadsheet → Orders sheet  
2. Find order by order \#  
3. Change column R (isPriority): `N` → `Y`  
4. Change column B (status): `HOLD` → `NEW`  
5. Order will be flagged as priority in packing list

**Scenario E: Gift/Fragile (No Hold Needed)**

1. Note the special instruction for packing  
2. No spreadsheet changes needed  
3. Order processes normally

#### *Step 1C: Immediate Release Options (If Urgent)*

**Use When:** Customer needs order shipped today (can't wait until 8pm batch)

**Option 1: Release Hold \+ Wait for Batch (Standard)**

* **Use When:** It's morning/afternoon (before 4pm), not urgent  
* **Action:** Change status to `NEW`, order included in 8pm batch  
* **Timeline:** 10 hours

**Option 2: Release Hold \+ Trigger Full Batch (Multiple Orders)**

* **Use When:** It's late afternoon (after 4pm), multiple orders ready  
* **Action:** Change status to `NEW`, then **📦 Orchestrator → 🚀 Trigger Batch Now**  
* **Timeline:** 3 minutes  
* **Note:** Batches ALL orders with status \= `NEW`

**Option 3: Batch Single Order Only (Customer Waiting)**

* **Use When:** Customer on phone, only one order ready  
* **Action:** **📦 Orchestrator → 📦 Batch Single Order**, enter Order ID  
* **Timeline:** 2 minutes  
* **Note:** Batches ONLY the specific order

### Step 2: Check Email for Packing Lists (After Holds Reviewed)

**When:** After reviewing customer note alerts (usually by 10:00 AM)

**What to Look For:** Email with subject line **"Storage Pickup List \- \[DATE\]"**

#### *Email Structure:*

`Copy`

**`STORAGE PICKUP LIST - 1-2-26`**  
**`============================================================`**  
**`CONSOLIDATED ITEMS TO PULL:`**  
**`============================================================`**  
   
`IN-HOUSE BIOCEUTICALS:`  
  `Blood Balance - 120 caps x2`  
  `Respiratory Reset - 240 caps x1`  
   
`NON-BIO ITEMS:`  
  `Crystal Bracelet (#CRY-001) x1`  
  `Incense - Sandalwood (#INC-SS) x3`  
   
`Orders included: 289616, 289617`  
   
`============================================================`  
**`PER-ORDER PACKING LIST:`**  
**`============================================================`**  
   
`Order #289616 - Ship`  
`John Doe`  
`123 Main St`  
`Portland, OR 97201`  
`503-555-1234`  
`john@example.com`  
`Shipping: Priority Mail - $8.50`  
   
`Items:`  
  `- Blood Balance - 120 caps x1`  
  `- Crystal Bracelet (#CRY-001) x1`  
   
`------------------------------------------------------------`  
   
`Order #289617 - Local Pickup`  
`Jane Smith`  
`jane@example.com`  
   
`Items:`  
  `- Blood Balance - 120 caps x1`  
  `- Respiratory Reset - 240 caps x1`  
  `- Incense - Sandalwood (#INC-SS) x3`  
   
`------------------------------------------------------------`

### Step 3: Pull Products from Storage

**Use the "CONSOLIDATED ITEMS TO PULL" section:**

1. Go to storage area  
2. Pull exact quantities listed  
3. Bring to packing station  
4. Check off each item as you pull it

**Tips:**

* Pull all items at once (don't go back and forth)  
* Double-check SKUs for non-bio items (in parentheses)  
* In-house BioCeuticals don't have SKUs listed (you know where they are)

### Step 4: Pack Orders

**Use the "PER-ORDER PACKING LIST" section:**

**For each order:**

1\.	**Read the order header:**

* Order \# (e.g., 289616\)  
  * Ship or Local Pickup  
  * Customer name  
  * Address (if shipping)  
  * Phone/email  
  * Shipping method & cost

  2\.	**Pack the items listed:**

  * Use appropriate box size  
  * Include packing slip (print from WooCommerce or handwrite)  
  * Add any marketing materials (optional)  
  * **Check for special instructions** (gift card, fragile, etc.)

  3\.	**Label the box:**

  * Write order \# on outside  
  * If local pickup: Set aside in pickup area  
  * If shipping: Create label (see Step 5\)

### Step 5: Create Shipping Labels

**Option A: Manual (Current Process)**

1. Go to Pirate Ship website  
2. Enter customer address  
3. Select shipping method (from packing list)  
4. Print label  
5. Attach to box

**Option B: Automated (Phase 2 \- Future)**

* Labels will be auto-generated and attached to packing list email  
* Just print and attach

### Step 6: Ship Orders

**USPS Pickup:** Schedule pickup via Pirate Ship (if \>5 packages)  
**Drop-Off:** Take to post office (if \<5 packages)  
**Local Pickup:** Text customer when ready (phone \# in packing list)

### Step 7: Update WooCommerce (Manual \- For Now)

**For each shipped order:**

1. Log into WooCommerce admin  
2. Find order by order \#  
3. Change status to "Completed"  
4. Add tracking number in order notes  
5. WooCommerce will auto-email customer

**Future:** This will be automated in Phase 3B

## ⏰ UNDERSTANDING HOLD TIMING

### Your Work Schedule:

* **Work Days:** Monday \- Friday  
* **Work Hours:** 9:00 AM \- 4:00 PM PST  
* **Off Days:** Saturday, Sunday

### Hold Duration Rules:

| Order Arrives | Hold Until | Duration | Your Action Window |
| ----- | ----- | ----- | ----- |
| **Mon 9am-4pm** | Tue 10am | 25 hours | Tue 9am-4pm |
| **Mon 4pm-midnight** | Wed 10am | 42 hours | Wed 9am-4pm |
| **Tue 9am-4pm** | Wed 10am | 25 hours | Wed 9am-4pm |
| **Tue 4pm-midnight** | Thu 10am | 42 hours | Thu 9am-4pm |
| **Wed 9am-4pm** | Thu 10am | 25 hours | Thu 9am-4pm |
| **Wed 4pm-midnight** | Fri 10am | 42 hours | Fri 9am-4pm |
| **Thu 9am-4pm** | Fri 10am | 25 hours | Fri 9am-4pm |
| **Thu 4pm-midnight** | **Mon 10am** | 90 hours | **Mon 9am-4pm** |
| **Fri anytime** | **Tue 10am** | 88-112 hours | **Tue 9am-4pm** |
| **Sat anytime** | **Tue 10am** | 64-88 hours | **Tue 9am-4pm** |
| **Sun anytime** | **Tue 10am** | 40-64 hours | **Tue 9am-4pm** |

### What Happens at 10am (Hold Expiration):

**If you released hold (status \= NEW):**

* Hold expires (no effect, already released)  
* Order included in 8pm batch ✅

**If you did NOT release hold (status \= HOLD):**

* Hold expires but order remains HOLD  
* Order excluded from batch ⏸️  
* Order remains held until you manually change to NEW

**Key Point:** Hold expiration does NOT auto-release. You must manually change status to NEW.

## 📊 WEEKLY TASKS

### Monday Morning: Stock Level Check

1\.	Open BioCeuticalVar sheet (link in your bookmarks)

2\.	Check "In House Stock" column for 5 in-house products:

* Blood Balance  
  * Liver Longevity  
  * Healthy Heart  
  * Superior Spleen  
  * Respiratory Reset

  3\.	If stock is low (\<5 units):

  * Update stock level in sheet (manual count)  
  * Email info@goldenage.world if reorder needed

**System Auto-Alerts (You Don't Need to Do Anything):**

* ≤3 units: 480-cap variations disabled  
* ≤1 unit: 240-cap and 480-cap variations disabled  
* 0 units: All variations disabled

### Friday Afternoon: Review Events Sheet

1. Open Events sheet (link in your bookmarks)  
2. Look for rows with type \= "error" or classification \= "ignored"  
3. If you see errors:  
   * Screenshot the row  
   * Email info@goldenage.world with screenshot \+ order \# (if applicable)

**Common Errors (Not Your Fault):**

* Missing SKU in BioCeuticalVar  
* Duplicate order ID  
* Email parsing failure (WooCommerce format changed)

## 🚨 TROUBLESHOOTING

### Problem: "Order not found" error when batching single order

**Cause:** Order ID entered incorrectly

**Solution:**

1. Double-check Order ID in Orders sheet (column A)  
2. Copy-paste Order ID instead of typing  
3. Try again

### Problem: Order auto-held but shouldn't be

**Cause:** Customer note contains conflict keyword but is actually benign

**Example:** "Thank you for the quick pickup of my call yesterday" (contains "pickup" and "call")

**Solution:**

1. Review note, confirm it's benign  
2. Change status from `HOLD` to `NEW`  
3. Order will process in next batch

### Problem: Order NOT auto-held but should be

**Cause:** Customer note uses different wording (not in keyword list)

**Example:** "I'll come by to collect this" (means pickup, but doesn't say "pickup")

**Solution:**

1. Manually change status from `NEW` to `HOLD`  
2. Determine if customer contact needed  
3. Email info@goldenage.world to add new keyword to detection list

### Problem: Customer doesn't respond before hold expires

**Timeline:**

* Day 1 (9:00 AM): Alert received, customer contacted (if needed)  
* Day 1 (5:00 PM): No response, follow-up email sent (if critical)  
* Day 2 (9:00 AM): No response, second follow-up (if critical)  
* Day 2 (5:00 PM): Still no response

**Action:**

1. If order is pickup-related: Release hold, process as SHIP (use original address)  
2. If order is hold-related: Keep on hold for 7 days, then contact supervisor  
3. If order is rush-related: Release hold, process as normal shipping  
4. Document decision in Orders sheet (add note in empty column)

### Problem: Full batch triggers but order not included

**Cause:** Order status is still `HOLD` (you forgot to change to `NEW`)  
**Solution:**

1. Change status to `NEW`  
2. Trigger batch again (safe to run multiple times)  
3. Order will be included this time

### Problem: Single-order batch fails with error

**Cause:** Order missing required data (no items, no address, etc.)

**Solution:**

1. Check Events sheet for error details  
2. Check OrderLines sheet \- does order have items?  
3. Check Orders sheet \- does order have shipping address?  
4. Fix missing data, try again  
5. If still fails, email info@goldenage.world with Order ID

### Problem: Packing list email not received

**Cause:** Batch didn't run (trigger failed) or no NEW orders

**Solution:**

1. Check Orders sheet \- are there orders with status \= `NEW`?  
2. If yes, manually trigger batch: **📦 Orchestrator → 🚀 Trigger Batch Now**  
3. If no, no action needed (no orders to process)  
4. If batch still doesn't send, email info@goldenage.world

## 📈 PERFORMANCE EXPECTATIONS

| Metric | Target | Notes |
| ----- | ----- | ----- |
| **Morning Review Time** | 9:00-10:00 AM | All holds reviewed before expiration |
| **Customer Contact Time** | \<1 hour | Contact customer (if needed) within 1 hour of review |
| **Hold Release Time** | Before 10:00 AM | Release holds before expiration |
| **Packing Completion** | By 2:00 PM | All orders packed and labeled |
| **Shipping Completion** | By 4:00 PM | All orders shipped or ready for pickup |
| **Accuracy** | 100% | Correct items, correct quantities, correct addresses |

## 🎓 KEY TAKEAWAYS

1. **Check customer note alerts BEFORE packing lists** (9am priority)  
2. **Hold duration depends on when order arrives** (weekday vs weekend, before/after 4pm)  
3. **You have until 10am to review** (hold expiration time)  
4. **Hold expiration does NOT auto-release** (you must manually change status)  
5. **Determine if customer contact needed** (not all notes require contact)  
6. **Weekend orders wait until Tuesday** (skip weekend \+ Monday review)  
7. **You can always release early** (if note is clear)  
8. **Use single-order batch for urgent requests** (customer waiting)  
9. **Email info@goldenage.world for technical issues** (not your fault)  
10. **Document decisions in spreadsheet** (for audit trail)

## 📞 ESCALATION

**When to Contact Supervisor (info@goldenage.world):**

* Customer note is ambiguous (can't determine intent after review)  
* Customer requests something impossible (e.g., ship to two addresses)  
* Customer is angry/demanding (needs leadership response)  
* Technical issue (order stuck in HOLD, can't change status)  
* System error (batch fails, emails not sending)  
* Missing SKU in BioCeuticalVar (can't fulfill order)

**When to Handle Yourself:**

* Customer confirms pickup/ship/hold (straightforward)  
* Customer wants gift packaging (standard request)  
* Customer requests careful packing (standard request)  
* Note is informational only (no action needed)  
* Stock level low (update sheet, email supervisor)

## ✅ TRAINING CHECKLIST

**Before You Start:**

*  Read this SOP in full  
*  Understand the difference between auto-hold and safe keywords  
*  Practice releasing holds in test spreadsheet  
*  Know when customer contact is needed vs optional  
*  Bookmark key sheets (Orders, BioCeuticalVar, Events)

**Week 1 (Supervised):**

*  Supervisor reviews all customer note alerts with you  
*  Supervisor observes how you handle reviews  
*  Supervisor checks all hold releases

**Week 2 (Independent):**

*  You handle customer note alerts independently  
*  Supervisor spot-checks 1-2 orders  
*  Weekly check-in meeting

**Week 3+ (Fully Delegated):**

*  You operate autonomously  
*  Supervisor only involved for escalations  
*  Monthly review meetings

## 📝 QUICK REFERENCE: CUSTOMER NOTE KEYWORDS

### Conflict Keywords (Auto-Hold):

* pickup, pick up, pick-up, local  
* hold, wait, delay, don't ship, do not ship  
* call, phone, contact, reach out  
* rush, urgent, asap, emergency, expedite

### Safe Keywords (No Hold):

* gift, present, surprise  
* fragile, careful, delicate, breakable  
* thank you, thanks

### Unknown Keywords:

* Anything else → System sends "REVIEW REQUIRED" alert  
* You determine if hold needed

## 📋 DAILY CHECKLIST

**Every Morning (9:00 AM \- 10:00 AM):**

*  Check email for customer note alerts  
*  Review each alert, determine if contact needed  
*  Contact customers (if needed)  
*  Release holds (change status to NEW)  
*  Check email for packing lists

**Mid-Day (10:00 AM \- 2:00 PM):**

*  Pull products from storage (consolidated list)  
*  Pack orders (per-order list)  
*  Create shipping labels  
*  Check for special instructions (gifts, fragile, etc.)

**Afternoon (2:00 PM \- 4:00 PM):**

*  Ship orders (USPS pickup or drop-off)  
*  Text customers for local pickups  
*  Update WooCommerce (mark completed)  
*  Check for late-arriving customer note alerts

**Before Leaving (4:00 PM):**

*  Verify no holds expiring today are still HOLD  
*  Check tomorrow's holds, plan morning review  
*  Email supervisor if any orders need extended hold

**Questions?** Email info@goldenage.world anytime. Customer notes are critical for satisfaction \- take your time and review carefully\! 🔔

OLDER INFO

## 1\. Your Role (Operator Summary)

You are responsible for: \- Monitoring the **Orchestrator inbox** \- Sending **pre‑drafted emails** (no writing from scratch) \- Performing **physical actions only** (packing / pickup) \- Confirming statuses when prompted

You are **not** responsible for: \- Deciding how orders are routed \- Calculating quantities \- Remembering batching rules \- Writing customer emails

If something does not clearly fit this SOP → escalate.

## 2\. Systems You Will Use

* **Gmail**  
  Labels: Orchestrator/Inbox, Order, Tracking, Ignore, Errors  
* **Google Sheets**  
  Tabs: Orders, OrderLines, OrderLinesEffective, Events  
* **WooCommerce Admin**  
  Used only to view private notes and confirm completion

## 3\. Daily Workflow (What You Do Each Day)

### Step 1: Check the Orchestrator Inbox

1\.    	Open Gmail

2\.    	Go to **Label: Orchestrator/Inbox**

3\.    	Do **not** manually move or re‑label emails

Automation will: \- Register new orders \- Ignore non‑orders \- Detect duplicates

If emails remain unlabeled for more than 10 minutes → flag.

### Step 2: Review Draft Emails to Vitality

1\.    	Open **Drafts**

2\.    	Look for drafts addressed to **Vitality**

There are only two valid draft types:

**A. Individual US Bio‑Only Orders**  
Subject contains: BioCeutical Order \#XXXX

**B. Pickup Batch Orders**  
Subject contains: FOR PICKUP

3\.    	Review only for:

·  	Obvious formatting issues

·  	Missing items (rare)

4\.    	Click **Send**

⚠️ Do not edit quantities or routing logic.

### Step 3: Physical Actions

Depending on draft type:

* **US Bio‑Only Order**  
  → No action required (Vitality ships directly)  
* **Pickup Batch**  
  → Go to storage and pick up listed items

You will also receive: \- A **Storage Pickup List** (consolidated quantities) \- **Individual Packing Lists** (per order)

### Step 4: Packing & Shipping (In‑House)

1\.    	Use **Individual Packing Lists**

2\.    	Pack only items listed for that order

3\.    	Ship using standard process

Do **not** guess or substitute items.

### Step 5: Confirm Status Updates

After pickup or shipping:

1\.    	Check Google Sheets → Orders

2\.    	Confirm the following transitions occurred:

`o`   Sent to fulfillment

`o`   Picked up from storage

`o`   Shipped

`o`   Completed

If a status did not update automatically → flag.

## 4\. How Batching Works (Do Not Override)

·  	The system tracks the **oldest pickup‑eligible order**

·  	A **5‑day window** starts from that order’s creation time

·  	**All newer orders**, even seconds old, are included

·  	At the end of that window → **one pickup batch is sent**

You never decide when to batch.  
You only act when a draft appears.

## 5\. What Is Automated vs Manual

### Fully Automated

·  	Order classification

·  	Bio vs non‑Bio detection

·  	US / Local / International routing

·  	Quantity normalization

·  	Draft creation

·  	Customer notification templates

### Human Required

·  	Physical pickup

·  	Physical packing

·  	Shipping execution

·  	Financial review (separate SOP)

## 6\. Escalation Rules (Very Important)

Escalate immediately if: \- An order appears twice \- A customer address looks invalid \- An item is missing from storage \- A Vitality draft looks incorrect \- Gmail labels stop applying

Do **not** invent solutions.

## 7\. Success Criteria

You are doing this correctly if: \- Orders move without manual routing \- Drafts appear automatically \- No customer emails are written manually \- No order waits longer than 5 days for pickup

# 1‑Page Executive Map (Founder / Operator)

**Purpose:** High‑level understanding of the system at a glance.

## Order Orchestration Map

**Trigger**  
New WooCommerce order exists

↓

**Intake & Classification**  
(New order vs tracking vs ignore)

↓

**Normalization**  
SKU → Units → Bio detection → Geography

↓

**Routing Decision** \- US Bio‑Only → Immediate Vitality Ship \- Local / Mixed / Intl → Pickup Batch Queue \- In‑House Only → Internal Packing

↓

**Batch Logic**  
Oldest pickup order anchors 5‑day window → send one consolidated batch

↓

**Documentation** \- Vitality emails \- Storage pickup list \- Individual packing lists

↓

**Execution** \- Vitality ships or prepares pickup \- In‑house packing & shipping

↓

**Status & Tracking** \- Woo private notes \- Tracking parsed \- Customer notified

↓

**Metrics & Oversight** \- Spend \- Revenue \- Error rate

**Key Insight:**  
This is not “order processing.”  
This is a **distributed fulfillment control system** designed to run without the founder.

 

notes from the boss to save for later: ability to order directly from WhatsApp and automation Auto inquiries directly to our fulfillment team Vitatlity. Masked Goldenage.shop email that vitality uses to respond to customer inquires by clicking link right in the email is there still a fedex or other profram where we drop off products and they list them and sell on etsy or something similar

 

 

## Treasures Automation Status

This automation closes the chapter on founder-led operations while preserving quality, care, and accountability. The system is designed to absorb order volume, exceptions, and growth without reintroducing daily cognitive load at the executive level. Orders move correctly, information reaches the appropriate operators, and continuity does not depend on individual memory, vigilance, or availability. Talent shifts from execution into architecture, oversight, and decision-making, creating space for higher-order work across operations, strategy, and creative leadership.

This document tracks progress toward a fully self-running operational state that surfaces only true edge cases and eliminates the need for operational re-entry. “Done” means classification remains accurate, delegation occurs automatically, batching follows intentional rules, and communication resolves without emotional or mental overhead. Human involvement is reserved for physical actions when required and conscious decisions when impact warrants attention. Capacity is intentionally redirected toward advanced creative projects, COO-level responsibilities, and C-suite execution for AI-enabled leadership.

 

## What “done” looks like

•                          	Orders auto-classified and routed correctly  
•                          	Vitality emails drafted correctly (individual \+ batch)  
•                          	Packing lists \+ storage pickup lists auto-generated  
•                          	WooCommerce order notes updated automatically  
•                          	Tracking parsed \+ customers notified  
•                          	You only touch **physical actions \+ edge exceptions**  
•                          	**All workflows below completed**  
 

## 📊 Summary Table: What's Done vs What's Next

| Feature | V1 Status | V2 | Phase 2 | Phase 3+ |
| :---- | :---- | :---- | :---- | :---- |
| Order detection | ✅ Done | \- | \- | \- |
| Product parsing | ✅ Done | ✅ Fix \* | \- | \- |
| Bio classification | ✅ Done | \- | \- | \- |
| US Bio-only drafts | ✅ Done | \- | \- | \- |
| Pickup batch drafts | ✅ Done | \- | \- | \- |
| In-house packing lists | ❌ Missing | ✅ Build | \- | \- |
| Stock depletion | ❌ Missing | \- | ✅ Build | \- |
| Priority shipping | ❌ Missing | \- | \- | ✅ Build |
| Business-day batching | ❌ Missing | \- | \- | ✅ Build |
| Auto-send (no drafts) | ❌ Missing | \- | \- | ✅ Build |
| Workflow 2-5 | Partial | Partial | ✅ Build |   |
| Workflow 6 | \- | \- | \- | ✅ Build |

 

## Automate Treasures (Contain \+ Exit)

**Role:** Cash-flow stabilizer \+ systems proving ground  
**Goal:** Remove *you* from the loop while preserving revenue

This is **not** a growth project.  
It is a **liberation project**.

### Strategic Reframe

Treasures exists to:

·   	Fund runway

·   	Provide real-world automation patterns

·   	Become a *case study*, not a lifestyle

### Success Definition (Binary)

Treasures is “done” when:

·   	Orders, fulfillment, and support require **\<30 min/day**

·   	No creative or strategic decisions are required from you

·   	It can run unattended for 30 days without anxiety

### What You Actually Need to Build

(Anything else is distraction.)

**A. Operational Spine**

·   	Email classification \+ routing (order / tracking / noise)  
→ already scoped in your AI Marketing Agent Suite notes

·   	Order → fulfillment → confirmation automation

·   	Exception-only alerts (you only see anomalies)

**B. Marketing Stasis**

·   	One evergreen offer

·   	One evergreen traffic source (even if small)

·   	No optimization, no experimentation

**C. Hard Stop**

·   	Fixed automation sprint (e.g., 10–14 deep-work sessions)

·   	Then *no more improvements*

This is below your creative ceiling. Treat it accordingly.

 

## V2 (Next Immediate Update) \- In-House Fulfillment

**Goal:** Split mixed orders into **Vitality portion** \+ **In-house portion**  
**Scope:**  
•                          	✅ Fix leading \* in shipping addresses (cosmetic)  
•                          	✅ Add InHousePacking sheet (like OrderLinesEffective but for in-house items)  
•                          	✅ Create **in-house packing list drafts** (separate from Vitality)  
•                          	✅ Use "In House Stock" column to classify items  
•                          	✅ Generate consolidated in-house list (grouped by SKU)  
•                          	✅ Send to INVENTORY\_SPECIALIST\_EMAIL (new Config key)  
**Testing Focus:**  
•                          	Mixed orders correctly split into 2 drafts (Vitality \+ In-house)  
•                          	In-house items excluded from Vitality emails  
•                          	Stock levels don't auto-deplete yet (manual for V2)  
**Estimated Complexity:** Medium (2-3 hours build, 1 hour test)  
 

## ✅ WHAT CHANGED IN V2.1

**New Functions:**  
•                          	✅ scheduledBatchCheck() \- Respects BATCH\_TIME config (runs hourly, only batches at correct hour)  
•                          	✅ validateConfig() \- Checks if all required config keys exist  
•                          	✅ checkConfigOnStartup() \- Emails you if config is broken  
•                          	✅ sendWeeklyReminderEnhanced() \- Includes trigger status, config validation, auto-stops after 10 weeks  
 

## 🎉 COMPLETE V2.2 FEATURES

✅ All V2 features (in-house, stock, batching)  
✅ Config validation  
✅ Enhanced weekly reminders  
✅ Smart batch timing (respects BATCH\_TIME)  
✅ **Setup Wizard** (auto-checks everything)  
✅ Custom menu with all tools

##  

## **Executive Maps**

### Workflow \#6 – Expo‑Mode Marketing (Meta Ads → Follow‑Up)

**Trigger**  
Expo Mode ON (campaign start)

**Flow**  
Audience (Identity Core \+ 1 Overlay) → 2× Ad Sets → Lead Form or Landing Page → Leads logged to Sheet → 3‑email calm follow‑up → Weekly KPI update → Iterate audience/creative

**Outputs**  
Leads captured; follow‑up delivered; ROI measurable

**Owner**  
Marketing Operator (setup \+ weekly review)

**Exit Condition**  
Campaign ends; metrics recorded; learnings summarized

### Order Operations Delegation – Executive Map

**Trigger**  
New WooCommerce order exists

**Flow**  
Intake & Classification → Normalization (SKU, Bio, Geography) → Routing Decision (Vitality vs Pickup vs In‑House) → Batch Logic (5‑day window) → Documentation (emails, pickup list, packing lists) → Execution (ship or pickup) → Status & Tracking → Customer Notification → Metrics & Oversight

**Outputs**  
Orders fulfilled accurately; tracking parsed; customers notified

**Owner**  
System for orchestration; Operator for physical execution

**Exit Condition**  
Order completed; system returns to quiet state

### Workflow \#3 – Silent Failure Detection & Daily Exception Digest

**Trigger**  
Daily scheduled check or manual run

**Observe**  
Orders, batching, labels, tracking, automation health

**Detect**  
Missing actions; SLA breaches; duplicates; API failures

**Outputs**  
One exception email only if issues exist

**Owner**  
System detects; Human fixes flagged items only

**Exit Condition**  
All exceptions cleared; silence resumes

### Workflow \#4 – Tracking → Customer Notification

**Trigger**  
Tracking email detected

**Process**  
Parse tracking → Match to orderId → Check eligibility → Send calm shipping email → Update order status and logs

**Outputs**  
One shipping confirmation email per order

**Owner**  
System automation; Human only on exceptions

**Exit Condition**  
Customer informed; system quiet again

### Workflow \#2 – Inventory Queue \+ Pirate Ship Labels

**Trigger**  
Daily scheduled queue send or Send Now

**Flow**  
Parsed orders → Compute shipping → Create label → Save PDF → Log audit → Build consolidated queue email with exceptions, pull list, per‑order blocks → Inventory stages and ships

**Outputs**  
One daily queue email with all labels; optional Send Now; audit trail

**Owner**  
Inventory Specialist for execution; System for routing and labels

**Exit Condition**  
Orders staged or shipped; exceptions escalated

 

## Delegation SOPs

### Workflow \#6 – Expo‑Mode Marketing SOP

**Purpose**  
Turn expo‑energy audiences into measurable sales and long‑tail relationships through a calm, repeatable loop.

**Core Loop**  
Audience → Offer → Capture → Follow‑Up → Measure → Iterate

**Operator Steps**  
1\. Create campaign shell using naming convention.  
2\. Build two ad sets: Identity Core and one Intent Overlay.  
3\. Publish minimum viable creative: education‑first and belonging‑first.  
4\. Choose one capture method and log leads automatically.  
5\. Run 3‑touch calm follow‑up.  
6\. Update weekly metrics in the campaign sheet.

**Escalation**  
CPL spikes, lead delivery breaks, repeated ad disapprovals.

### Order Operations Delegation SOP

**Purpose**  
Enable a non‑technical operator to run daily order ops end‑to‑end without founder involvement.

**Daily Actions**  
Check Orchestrator inbox; send pre‑drafted emails; perform physical pickup, packing, and shipping; confirm automated status updates.

**Do Not Override**  
Routing logic, batching windows, quantities, or customer messaging.

**Escalation**  
Duplicates, invalid addresses, missing items, incorrect drafts, or automation failures.

### Workflow \#3 – Silent Failure Detection SOP

**Purpose**  
Surface only true exceptions across intake, batching, labels, and tracking.

**Daily Behavior**  
If an exception digest arrives, handle listed items only. If no email arrives, take no action.

**Escalation**  
Any exception recurring two days in a row.

### Workflow \#4 – Tracking → Customer Notification SOP

**Purpose**  
Notify customers exactly once when tracking is confirmed.

**Rules**  
Send only when tracking exists and order not yet notified; delay for mixed or held orders.

**Escalation**  
Tracking without order match, missing customer email, or send failures.

### Workflow \#2 – Inventory Queue \+ Labels SOP

**Purpose**  
Allow the Inventory Specialist to ship from one daily queue email with labels attached.

**Daily Steps**  
Open queue email; review exceptions; perform one storage pull; stage boxes; print and match labels; ship completed orders.

**Do Not Do**  
Manual label creation, address retyping, substitutions without escalation.

**Escalation**  
Label failures, missing data, inventory mismatches, invalid addresses.

 

 

## 🎯 V2 FEATURE CHECKLIST

**Core Fixes:**  
•                          	 Fix leading \* in shipping addresses  
•                          	 Extract phone from billing block  
•                          	 Extract shipping method \+ cost  
•                          	 Detect priority shipping  
**In-House Fulfillment:**  
•                          	 Classify 5 in-house products (Blood Balance, Liver Longevity, Healthy Heart, Superior Spleen, Respiratory Reset)  
•                          	 Split mixed orders into Vitality \+ In-house drafts  
•                          	 Generate consolidated storage pickup list  
•                          	 Generate per-order packing list  
•                          	 Email to TREASURE\_INVENTORY\_SPECIALIST  
•                          	 Create InHousePackingList sheet  
**Stock Management:**  
•                          	 Auto-decrement stock (120→1, 240→2, 480→4 units)  
•                          	 Update BioCeuticalVar "In House Stock" column  
•                          	 Update BioCeuticalVar "In HOUSE?" at thresholds (≤3, ≤1, ≤0)  
•                          	 Create StockLedger audit trail  
•                          	 Alert when stock crosses threshold  
**Batch Logic:**  
•                          	 Create BatchHistory sheet  
•                          	 Track LAST\_VITALITY\_BATCH\_TS and LAST\_INHOUSE\_BATCH\_TS  
•                          	 Collect orders since last batch (not age-based)  
•                          	 Handle first batch ever (cutoff: 2025-12-07)  
•                          	 Skip Friday/Saturday → send Sunday  
**Priority Shipping:**  
•                          	 Detect "Shipping: Priority" in order email  
•                          	 US Priority → batch next day at BATCH\_TIME  
•                          	 International Priority → notify admin (manual decision)  
•                          	 Admin notification with queue details  
**UI/UX:**  
•                          	 Custom menu: 📦 Orchestrator  
•                          	 Manual batch trigger function  
•                          	 Protected sheets with allowed ranges  
•                          	 GO\_LIVE config flag  
**Reminders:**  
•                          	 Weekly reminder email (10 weeks)  
•                          	 Draft-to-send gap warning  
•                          	 Hard-coded date reminder  
•                          	 GO\_LIVE status check  
•                          	 Batch timing review  
•                          	 Stock level summary  
•                          	 Pending features list  
   
 

## TESTING CHECKLIST

 

## NEW TESTING WORKFLOW

**Step 1: First Run**  
Copy  
1\. Paste all V2.2 code  
2\. Save  
3\. Refresh sheet  
4\. Click: 📦 Orchestrator → 🧙 Run Setup Wizard  
5\. Read popup \+ check email for detailed report  
6\. Fix any critical issues  
7\. Re-run wizard until ✅  
**Step 2: Manual Testing**  
Copy  
1\. Forward test order email  
2\. Label it: Orchestrator/Inbox  
3\. Run: triage() (or click 📦 Orchestrator → 🚀 Trigger Batch Now)  
4\. Check: Orders sheet  
5\. Run: buildBatchDrafts()  
6\. Check: Gmail drafts  
**Step 3: Install Triggers (when ready)**  
Copy  
1\. Apps Script \> Triggers  
2\. Add 3 triggers (see setup instructions)  
3\. Monitor weekly reminder emails  
   
 

## 📋 WHAT EACH FUNCTION DOES

**1\. triage()**

**What it does:** Checks Gmail for new order emails in Orchestrator/Inbox label  
**Needs:**  
•                            	Emails labeled with Orchestrator/Inbox  
•                            	Emails from ORDER\_SENDERS addresses  
**Test manually:**  
•                            	Forward an old order email to yourself  
•                            	Label it Orchestrator/Inbox  
•                            	Run triage() from Apps Script  
•                            	Check: Order appears in **Orders** sheet  
   
**2\. buildBatchDrafts()**

**What it does:** Creates Vitality \+ In-house draft emails for all NEW orders  
**Needs:**  
•                            	Orders in **Orders** sheet with status \= NEW  
•                            	OrderLinesEffective sheet populated  
**Test manually:**  
•                            	Run triage() first (to get orders)  
•                            	Run buildBatchDrafts() from Apps Script  
•                            	Check: Gmail drafts created  
•                            	Check: Order status changed to BATCHED\_US\_BIO or BATCHED\_PICKUP  
   
**3\. onOpen()**

**What it does:** Creates custom menu when you open the sheet  
**Needs:** Nothing  
**Test:** Just refresh your sheet after running it once  
**Menu items:**  
•                            	🚀 **Trigger Batch Now** → Runs manualTriggerBatch() (same as buildBatchDrafts())  
•                            	🔄 **Rebuild Effective Lines** → Runs rebuildOrderLinesEffective()  
•                            	📊 **View Batch Queue** → Shows how many NEW orders waiting  
•                            	📧 **Send Test Reminder** → Sends weekly reminder email immediately  
📦 Orchestrator  
├── 🧙 Run Setup Wizard      	← NEW\! Run this first  
├── ─────────────────  
├── 🚀 Trigger Batch Now  
├── 🔄 Rebuild Effective Lines  
├── 📊 View Batch Queue  
├── ─────────────────  
├── 📧 Send Test Reminder  
└── ⚙️ Validate Config       	← NEW\! Quick config check  
   
   
**4\. showBatchQueue()**

**What it does:** Shows popup with list of NEW orders waiting to batch  
**Needs:** Orders with status \= NEW  
**Test:** Click 📦 **Orchestrator →** 📊 **View Batch Queue** from menu  
   
**5\. sendWeeklyReminder()**

**What it does:** Emails you a reminder about testing settings  
**Needs:** TREASURE\_ADMIN email configured  
**Test:** Click 📦 **Orchestrator →** 📧 **Send Test Reminder** from menu  
   
**"REBUILD EFFECTIVE LINES" What it does:**  
Recalculates the **OrderLinesEffective** sheet by:  
•                            	Reading raw order lines from **OrderLines** sheet  
•                            	Looking up each product in **BioCeuticalVar** sheet  
•                            	Determining:  
•                            	Is it a BioCeutical? (isBio)  
•                            	Is it in-house? (isInHouse)  
•                            	How many units? (effectiveUnits)  
•                            	Updating **Orders** sheet flags (hasBio, hasNonBio, hasInHouse)  
**When to use it:**  
•                            	✅ After manually editing **BioCeuticalVar** (adding/removing products)  
•                            	✅ After manually editing **OrderLines** (fixing SKU typos)  
•                            	✅ If you suspect classification is wrong  
•                            	✅ Testing: To see how changes affect order routing  
**Example:**  
Copy  
You add "Superior Spleen" to BioCeuticalVar with "In HOUSE? \= Yes"  
→ Click 🔄 Rebuild Effective Lines  
→ All orders with Superior Spleen now show hasInHouse \= Y  
 

 

**Creative Strategic Partner & Conscious AI Architect**

**Who I Am**

**Ray** is a West Point graduate, best-selling author, and senior technology leader with 30 years of experience across military, government, and Fortune 500 environments. Ray now works as a **Creative Strategic Partner**, **operating on a COO-bound pathway** for conscious small businesses that want to use AI to scale intelligently, ethically, and without burnout.

This role is not traditional consulting. It is partnership.

Ray steps inside a business as a second mind and steady presence, helping founders think clearly, decide wisely, and build systems that serve both growth and nervous system health.

**Ikigai Focus:**  
Technology strategy, conscious leadership, and human-centered systems that amplify people rather than replace them.

**Commitment:**  
High-leverage, part-time partnerships. Clear boundaries. CEO-level insight. Zero busywork.

**What I Do**

I help **small business owners and founders (5–50 employees)** integrate AI into marketing, operations, and daily workflows in ways that are practical, aligned, and sustainable.

This work is about **clarity before complexity** and **systems that match real human attention**, not productivity theater. I operate with COO-level responsibility and decision-making, while intentionally growing into full operational ownership over time.

**Core Partnership Areas**

**1\. Creative & Strategic AI Integration**

             	AI-assisted marketing strategy and campaigns

             	Email systems, funnels, and nurture sequences

             	Brand-aligned content systems for web, social, and video

             	Lead magnets and conversion pathways that feel human

             	Digital presence systems that scale voice without losing soul

**2\. Operational AI Systems**

•        	Workflow automation using Make, Zapier, n8n, and native APIs

•        	AI-assisted SOP creation and documentation

•        	Customer service and intake automation

•        	Internal collaboration and co-working tool optimization

•        	Reduction of cognitive load across teams

**3\. Strategic Roadmaps & Training**

•        	AI audits focused on time, money, and energy leaks

•        	Custom tool stacks matched to budget and team capacity

•        	Prompting and adoption training for neurodiverse teams

•        	Phased implementation plans designed for real bandwidth

•        	Ongoing advisory support as tools and needs evolve

**How I Work**

**Human-Centered. Strategic. Grounded.**

•        	**Partner Mindset:** I operate as a Creative Strategic Partner, not a detached advisor. I think with you, not at you.

•        	**Rapid Synthesis:** In a few focused hours, I can translate complexity into a clear roadmap your team can execute.

•        	**Nervous-System Aware:** Systems are designed around attention, rhythm, and recovery, not constant urgency.

•        	**80/20 Execution:** We prioritize what actually moves the business forward and let the rest go.

•        	**Sustainable Pace:** I work limited hours by design. This keeps my thinking sharp and my guidance high-value.

**What You Get**

**Initial Engagement (4–6 hours)**

•        	AI Audit and Opportunity Map

•        	Custom AI Toolkit aligned to your business

•        	30–60–90 day implementation roadmap

•        	Handoff documentation your team can use immediately

**Ongoing Partnership (8–12 hours/month)**

•        	Bi-weekly strategy calls

•        	Ongoing tool evaluation and guidance

•        	Team training and enablement

•        	Campaign review and optimization

•        	Advisory support without micromanagement

**Who This Is For**

This partnership is ideal for founders who:

•        	Feel overwhelmed by AI noise but know they need leverage

•        	Want systems that scale without burning out their team

•        	Value clarity, ethics, and long-term sustainability

•        	Appreciate direct, grounded strategic dialogue

•        	Want a partner who understands business realities

**Industries Served Well**

•        	Creative agencies and consultancies

•        	Wellness and spiritual businesses

•        	Local retail, hospitality, and experiential spaces

•        	Course creators and coaches

•        	Service-based businesses

**Why This Works**

•        	Senior executive experience across high-stakes systems

•        	Deep pattern recognition and rapid synthesis

•        	Neurodivergent-friendly workflow design

•        	Ethical and conscious AI integration

•        	Long-term, Saturn-aligned thinking that builds durable success

This work aligns with a Vedic abundance path rooted in **service, partnership, and disciplined wisdom**, not hustle or volatility.

**Closing**

You do not need to become an AI expert.  
You need a **Creative Strategic Partner** who can help you see clearly, choose wisely, and build systems that actually work.

AI should be your ally, not your overwhelm.

**PART II**

**ONE-PAGE BRAND DOCUMENT**

(Website, PDF, or LinkedIn-ready)

**Ray Robinson**

**Creative Strategic Partner & Conscious AI Architect**

I help founders and small business owners integrate AI in ways that create clarity, momentum, and sustainable growth—without burning out their team or losing their values.

This is not consulting at a distance or coaching from a script.  
It is partnership.

With me, you gain a second mind in the room: a strategic mirror, creative partner, and systems architect who helps turn complexity into structure and vision into execution.

**What I Bring**

•        	Executive-level strategy without corporate drag

•        	AI systems designed for real human attention

•        	Clear roadmaps instead of endless tools

•        	Neurodivergent-friendly workflows

•        	Ethical, conscious use of emerging technology

**How We Work**

•        	Focused engagements with clear outcomes

•        	80/20 prioritization and Eisenhower decision logic

•        	Systems that respect nervous system health

•        	Part-time partnership with full presence

**Best Fit Clients**

•        	Conscious founders and small business owners

•        	Creative, wellness, and service-based businesses

•        	Leaders who want leverage without chaos

•        	Teams ready for clarity and execution

**Signature Offering**

**Creative AI Systems Sprint**  
A focused deep-dive to map opportunities, design workflows, and create an actionable AI roadmap tailored to your business.

**Core Belief**

Prosperity follows purpose.  
When systems honor people, abundance becomes sustainable.

 

 

   