# AI Wingman Skills: Guardrails, Rules & Decision Frameworks
### Custom Business Logic for CEO Autonomy

---

## OVERVIEW

This document defines the specific business rules and decision logic that drive each skill's guardrails. Ray can customize these rules at any time; they are not hardcoded but stored in the database and reviewed weekly.

---

## CORE OPERATING PARAMETERS

These parameters define Ray's boundaries and operating philosophy. All skills reference these.

### Energy & Capacity Parameters

| Parameter | Current Value | Logic | Adjustable |
|-----------|---------------|-------|-----------|
| **Deep Work Target** | 20 hours/week | Minimum quality work time | Yes (per week) |
| **Meeting Threshold** | 6 hours/day | Max back-to-back meetings | Yes (per day) |
| **Decision Fatigue Limit** | 15 decisions/day | Above this, quality drops | Yes (per day) |
| **Context Switch Cost** | 15 minutes | Time lost per tool switch | Yes (for calculation) |
| **Recovery Minimum** | 5 hours/week | Protected time, no work | Yes (per week) |
| **Hyperfocus Duration** | 6 days max | Before forced recovery | Yes (per period) |

### Financial Parameters

| Parameter | Current Value | Logic | Adjustable |
|-----------|---------------|-------|-----------|
| **Order Verification Threshold** | $300 | Flag for manual check | Yes |
| **Client Minimum Investment** | $500 | Too small, refer elsewhere | Yes |
| **Pipeline Alert Threshold** | $5,000 | Below this = urgent action | Yes |
| **Revenue Drop Alert** | 30% week-over-week | Investigate potential problem | Yes |
| **Deal Size for Manual Review** | $20,000+ | Flag before committing | Yes |

### Prospect & Outreach Parameters

| Parameter | Current Value | Logic | Adjustable |
|-----------|---------------|-------|-----------|
| **Min Follower Count** | 10,000 | Too small audience | Yes |
| **Max Follower Count** | 100,000 | Too large, harder to close | Yes |
| **Min Engagement Rate** | 1% | Below this = low quality | Yes |
| **Daily Outreach Target** | 30 | Qualified outreach sent | Yes |
| **Call Booking Target** | 1/day | Calls booked | Yes |
| **Acceptable Close Rate** | 20% | Below this = audit quality issue | Yes |
| **Max Contacts Without Response** | 5 | Then move to nurture | Yes |
| **Follow-up Timing** | D+1, D+3, D+7 | When to follow up | Yes |

---

## SKILL-BY-SKILL GUARDRAIL DECISION TREES

### SKILL-001: Daily Intelligence Brief

**Purpose:** Surface the three things Ray actually needs to know today.

**Guardrail Tree:**

```
START: Compile morning brief

├─ SECTION 1: Calendar Check
│  ├─ Are there 6+ consecutive meeting hours?
│  │  ├─ YES → ADD ALERT: "No deep work window today"
│  │  └─ NO → Continue
│  ├─ Are there focus blocks (2+ hour uninterrupted)?
│  │  ├─ YES → HIGHLIGHT: "Focus window 10-12 AM"
│  │  └─ NO → ADD FLAG: "Schedule focus block today"
│  └─ Any event requiring 15+ minute prep?
│     ├─ YES → List prep requirements
│     └─ NO → Continue
│
├─ SECTION 2: Email Priority
│  ├─ Any email with is:important AND subject contains ["urgent", "critical", "issue", "help"]?
│  │  ├─ YES → FLAG_URGENT_CLIENT
│  │  ├─ From known client? → ELEVATED_PRIORITY
│  │  └─ NO → Continue
│  ├─ Count important + unread
│  │  ├─ >15? → ADD NOTE: "Inbox heavy today"
│  │  └─ ≤15? → Continue
│  └─ Any decision-blocking emails?
│     ├─ YES → Add to PRIORITY_1
│     └─ NO → Continue
│
├─ SECTION 3: Business Signals
│  ├─ Treasures: How many orders received?
│  │  ├─ 0 by noon? → FLAG: "Check WooCommerce connectivity"
│  │  ├─ >5? → Healthy signal
│  │  └─ 1-4? → Normal
│  ├─ AI Wingman: Any client at milestone?
│  │  ├─ YES → Consider for today's focus
│  │  └─ NO → Continue
│  └─ Shadow Ops: KPI on track?
│     ├─ YES → Continue
│     └─ NO → Note trend
│
├─ SECTION 4: Personal State
│  ├─ Is recovery time scheduled this week?
│  │  ├─ <2 hours → ADD ALERT: "Schedule recovery"
│  │  └─ ≥2 hours → OK
│  ├─ Is deep work protected today?
│  │  ├─ YES → Highlight as priority
│  │  └─ NO → Suggest when to create it
│  └─ Is Ray on track with courses?
│     ├─ YES → Optional motivation note
│     └─ NO → Gentle reminder (don't push)
│
└─ OUTPUT: Generate brief (5 bullets max)
   - PRIORITY 1: [Deep work opportunity]
   - PRIORITY 2: [Decision needed]
   - SIGNAL: [Health check]
   - OPPORTUNITY: [One thing to not miss]
   - TOMORROW: [What's coming]
```

**Customizable Rules:**

Ray can define what "urgent" means for him. Default keywords: `urgent, critical, help, issue, asap, blocker`. Can add/remove:

```json
{
  "urgent_keywords": ["urgent", "critical", "help", "issue"],
  "client_identifier_fields": ["from_email_domain", "from_name"],
  "deep_work_minimum": 120,  // minutes
  "meeting_max_consecutive": 6,  // hours
  "recovery_minimum_weekly": 300  // minutes
}
```

### SKILL-002: Weekly Reset

**Purpose:** Identify what moved the needle and what needs adjustment.

**Guardrail Tree:**

```
START: Weekly review (Sunday 5 PM)

├─ TREASURES HEALTH
│  ├─ Compare revenue to prior week
│  │  ├─ ↑ >25%? → CELEBRATE (what changed?)
│  │  ├─ ↓ >25%? → FLAG_REVENUE_CONCERN (investigate)
│  │  └─ ±10-25%? → Normal
│  ├─ New products in top 3?
│  │  ├─ YES → Note trend (customer interest? old stock clear?)
│  │  └─ NO → Continue
│  └─ Any product with 0 orders x2 weeks?
│     ├─ YES → Consider discontinuing or repricing
│     └─ NO → Continue
│
├─ AI WINGMAN PIPELINE
│  ├─ New clients this week?
│  │  ├─ 0? → FLAG: "Pipeline going dry, focus on outreach"
│  │  ├─ 1? → OK
│  │  └─ 2+? → Excellent
│  ├─ Stalled clients >14 days?
│  │  ├─ >50% of pipeline? → FLAG: "System breakdown, investigate"
│  │  └─ <30%? → Normal
│  └─ Any won deals this week?
│     ├─ YES → Calculate revenue + celebrate
│     └─ NO → Note and reassess positioning
│
├─ SHADOW OPS PIPELINE
│  ├─ Outreach sent vs. target (210/week)
│  │  ├─ <150? → FLAG: "Below target, capacity issue?"
│  │  ├─ 150-210? → On track
│  │  └─ >210? → Excellent
│  ├─ Audits sent vs. committed?
│  │  ├─ 0? → FLAG: "No audits, funnel broken"
│  │  └─ >0? → Continue
│  ├─ Calls booked?
│  │  ├─ 0? → FLAG: "Pipeline stall, revisit messaging"
│  │  ├─ 1-5? → Normal
│  │  └─ 5+? → Excellent momentum
│  └─ Close rate this week?
│     ├─ <15%? → FLAG: "Audit quality issue, revisit approach"
│     ├─ 15-25%? → Healthy
│     └─ 25%+? → Excellent
│
├─ PERSONAL ENERGY
│  ├─ Deep work hours this week?
│  │  ├─ <15? → FLAG: "Energy fragmented, protect next week"
│  │  ├─ 15-20? → Target met
│  │  └─ 20+? → Hyperfocus, recovery needed next week
│  ├─ Recovery time protected?
│  │  ├─ <2 hours? → FLAG: "Schedule recovery"
│  │  └─ ≥2 hours? → OK
│  └─ Course progress this week?
│     ├─ On pace? → Note
│     └─ Behind? → Gentle nudge (optional)
│
├─ IDENTIFY SINGLE HIGHEST-LEVERAGE CHANGE FOR NEXT WEEK
│  ├─ Is there one blocker affecting multiple areas?
│  │  ├─ YES → Fix that first (biggest leverage)
│  │  └─ NO → Tackle highest-value opportunity
│
└─ OUTPUT: 5-bullet reset
   - WHAT WORKED: [One thing that went smoothly]
   - WHAT DIDN'T: [One thing that didn't go as planned]
   - SIGNAL: [Revenue trend, pipeline health, energy state]
   - NEXT WEEK: [One change that would help most]
   - CELEBRATION: [One win to acknowledge]
```

**Customizable Rules:**

```json
{
  "revenue_alert_threshold": 0.30,  // 30% down triggers flag
  "stalled_client_days": 14,  // >14 days = stalled
  "outreach_target_weekly": 210,  // 30/day × 7
  "audit_target_weekly": 5,  // Depends on Ray's capacity
  "call_booking_target_weekly": 5,
  "acceptable_close_rate": 0.20,  // 20% minimum
  "deep_work_target_weekly": 1200,  // minutes
  "recovery_target_weekly": 300  // minutes
}
```

### SKILL-003: Order Monitor

**Purpose:** Catch every order, route correctly, flag issues before they escalate.

**Guardrail Tree:**

```
START: New WooCommerce order received

├─ PARSE ORDER DATA
│  ├─ Can we extract order ID, customer, items, total?
│  │  ├─ YES → Continue
│  │  └─ NO → FLAG: "Email parsing failed, manual review needed"
│  
├─ DETERMINE ROUTING
│  ├─ All items in BIO product list?
│  │  ├─ YES → routing = BIO
│  │  └─ NO → Continue
│  ├─ All items in IN_HOUSE list?
│  │  ├─ YES → routing = IN_HOUSE
│  │  └─ NO → Continue
│  ├─ Mix of both?
│  │  ├─ YES → routing = MIXED
│  │  └─ NO (unknown product) → FLAG: "Routing ambiguous"
│  
├─ CHECK ORDER EXCEPTIONS
│  ├─ Order value > $300?
│  │  ├─ YES → FLAG: "High-value order"
│  │  ├─ Known customer with history? → Check for flags
│  │  └─ New customer? → Manual verification
│  ├─ Same item ordered 3+ times in one order?
│  │  ├─ YES → FLAG: "Bulk order"
│  │  ├─ Normal bulk product? → OK
│  │  └─ Unusual? → Possible reseller (note)
│  ├─ Customer has prior refund/dispute?
│  │  ├─ YES → FLAG: "Prior issue with this customer"
│  │  └─ NO → Continue
│  └─ Refund/dispute/chargeback language in email?
│     ├─ YES → FLAG: "Customer service issue"
│     └─ NO → Continue
│  
├─ CHECK INVENTORY
│  ├─ Is ordered product at low inventory?
│  │  ├─ <5 units? → TRIGGER: "Reorder alert"
│  │  └─ ≥5 units? → Continue
│  
├─ LOG ORDER
│  └─ Create DB record with all flags
│  
└─ NOTIFY IF FLAGS EXIST
   └─ If any flags → notify Ray with summary
   └─ If no flags → silent success
```

**Customizable Rules:**

```json
{
  "high_value_threshold": 300,  // USD
  "bulk_order_quantity": 3,  // same item 3+ times
  "inventory_reorder_level": 5,  // units
  "refund_keyword_list": ["refund", "chargeback", "dispute", "return"],
  "verification_required_keywords": ["urgent", "issue", "help"],
  "new_customer_verification": true,  // Auto-flag new customers >$300
  "bulk_order_verification": true
}
```

### SKILL-005: Client Intake Processor

**Purpose:** Validate new clients and route appropriately.

**Guardrail Tree:**

```
START: New client submission detected (status = 'complete')

├─ VALIDATE REQUIRED FIELDS
│  ├─ business_name exists AND non-empty?
│  │  ├─ NO → REJECT: "Incomplete submission"
│  │  └─ YES → Continue
│  ├─ email exists AND is valid format?
│  │  ├─ NO → REJECT: "Can't follow up without email"
│  │  └─ YES → Continue
│  ├─ 90-day goal exists?
│  │  ├─ NO → FLAG: "Goal not stated, add to discovery call"
│  │  └─ YES → Continue
│  
├─ CHECK INVESTMENT CAPACITY
│  ├─ investment_capacity < $500?
│  │  ├─ YES → FLAG_TOO_SMALL
│  │  ├─ Suggest free audit or consulting call instead
│  │  └─ Still track for potential upsell later
│  ├─ investment_capacity > $20,000?
│  │  ├─ YES → FLAG_REVIEW_REQUIRED (verify legitimacy)
│  │  └─ Continue
│  
├─ CHECK CAMPAIGN DNA
│  ├─ Section 6 (Campaign DNA) complete?
│  │  ├─ NO → FLAG: "Missing DNA, add to call agenda"
│  │  └─ YES → Ready for GhostwriterOS injection
│  
├─ CHECK FOR RED FLAGS
│  ├─ Does application look like spam/bot test?
│  │  ├─ YES → REJECT (don't create pipeline record)
│  │  └─ NO → Continue
│  ├─ Does client mention specific competitor or say "already working with X"?
│  │  ├─ YES → FLAG: "Existing solution, note competing platform"
│  │  └─ Continue
│  
├─ RECOMMEND SERVICES
│  ├─ Call /api/gpt/recommend-services with 29-field profile
│  ├─ Return: [Service 1, Service 2] with rationale
│  
├─ CREATE PIPELINE RECORD
│  ├─ status = "intake_complete"
│  ├─ Set investment_capacity (bucketed)
│  ├─ Set recommended_services
│  ├─ Set created_at = now
│  
├─ CREATE SHADOW OPS CLIENT CARD
│  ├─ Populate all 6 section tabs
│  ├─ Make profile copy-paste ready for GPT
│  ├─ Add "Next: Schedule Discovery Call" action
│  
└─ NOTIFY RAY
   ├─ Message: "New client [Name] ready in Shadow Ops"
   ├─ If DNA missing → "Note: Complete Campaign DNA on discovery call"
   ├─ If >$20K → "Note: Manual review recommended"
   └─ If <$500 → "Note: Below typical project size, offer alternative"
```

**Customizable Rules:**

```json
{
  "minimum_investment": 500,  // USD
  "maximum_investment_auto_approve": 20000,  // USD
  "required_fields": ["business_name", "email", "90_day_goal"],
  "ideal_investment_range": [5000, 15000],  // USD (for targeting)
  "spam_indicators": ["free audit", "no budget", "just curious"],
  "redirect_alternatives": {
    "under_500": "Free 30-min consultation or DIY tools list",
    "over_20000": "Schedule discovery to confirm scope"
  }
}
```

### SKILL-008: Outreach Queue

**Purpose:** Manage daily outreach safely and effectively.

**Guardrail Tree:**

```
START: Daily outreach queue (9 AM)

├─ PULL PROSPECTS READY FOR OUTREACH
│  ├─ Prospects in "opener_ready" stage?
│  │  ├─ YES → Surface with pre-approved messages (if any)
│  │  └─ NO → Check for follow-ups
│  
├─ CHECK FOLLOW-UP TIMING
│  ├─ Any prospects at D+1 (24h no response)?
│  │  ├─ YES → Generate Day 1 follow-up message
│  │  └─ Continue
│  ├─ Any prospects at D+3?
│  │  ├─ YES → Generate Day 3 follow-up message
│  │  └─ Continue
│  ├─ Any prospects at D+7?
│  │  ├─ YES → Generate Day 7 follow-up message
│  │  └─ Continue
│  ├─ Any prospects at D+14 with NO response?
│  │  ├─ YES → Move to "nurture list" (pause outreach for 30 days)
│  │  └─ Continue
│  
├─ CHECK FOR DO-NOT-CONTACT FLAGS
│  ├─ Any prospect with "do_not_contact" flag?
│  │  ├─ YES → BLOCK (skip this prospect)
│  │  └─ Continue
│  ├─ Any prospect contacted >5 times?
│  │  ├─ YES → STOP
│  │  ├─ Move to nurture list
│  │  └─ Wait 30 days before recontacting
│  
├─ VALIDATE PROSPECT PROFILE
│  ├─ For each prospect ready to contact:
│  │  ├─ Follower count in 10K-100K range?
│  │  │  ├─ NO → SKIP or flag for manual override
│  │  │  └─ YES → Continue
│  │  ├─ Engagement rate ≥ 1%?
│  │  │  ├─ NO → FLAG: "Low engagement, poor quality"
│  │  │  └─ YES → Continue
│  │  ├─ Account looks like bot (rapid follower growth, zero engagement)?
│  │  │  ├─ YES → SKIP (flag as "bot_alert")
│  │  │  └─ NO → Continue
│  
├─ SURFACE DAILY QUEUE
│  └─ List prospects in order: 
│      1. Priority 1: D+1 and D+3 follow-ups (time-sensitive)
│      2. Priority 2: New openers (most promising first by engagement)
│      3. Priority 3: D+7 follow-ups (lower urgency)
│  
├─ DISPLAY TALLY
│  ├─ Outreach sent this week (vs. 210 target)
│  ├─ Response rate % this week
│  ├─ Audits sent this week
│  ├─ Calls booked this week (vs. 5 target)
│  ├─ Close rate % this week
│  
├─ CHECK FOR ALERTS
│  ├─ Outreach <15 today?
│  │  ├─ YES → WARNING: "Below pace, will miss weekly target"
│  │  └─ Continue
│  ├─ Response rate <6%?
│  │  ├─ YES → FLAG: "Low response, revisit messaging"
│  │  └─ Continue
│  ├─ No calls booked this week?
│  │  ├─ YES → FLAG: "Funnel stalled, investigate"
│  │  └─ Continue
│  
└─ REQUIRE RAY APPROVAL BEFORE SENDING
   └─ Ray must review and approve each message (no auto-send)
```

**Customizable Rules:**

```json
{
  "min_followers": 10000,
  "max_followers": 100000,
  "min_engagement_rate": 0.01,  // 1%
  "daily_outreach_target": 30,
  "weekly_outreach_target": 210,
  "weekly_call_target": 5,
  "acceptable_close_rate": 0.20,  // 20%
  "acceptable_response_rate": 0.08,  // 8%
  "follow_up_days": [1, 3, 7],  // D+1, D+3, D+7
  "max_contacts_without_response": 5,
  "nurture_pause_days": 30,
  "require_manual_approval": true,  // Never auto-send
  "bot_indicators": ["follower_spike", "zero_engagement", "paid_follows"]
}
```

---

## SCENARIO-BASED DECISION LOGIC

### Scenario 1: Revenue Down 35% This Week

```
TRIGGER: Weekly reset detects revenue drop

IF revenue_change < -0.30:
  ├─ Call Ray: What happened?
  │  ├─ External factor (promo ended, seasonal)? → Note and adjust targets
  │  ├─ Product issue (quality, reviews)? → Flag for investigation
  │  ├─ Traffic issue (marketing paused)? → Resume or investigate
  │  └─ Fulfillment issue (shipping delays)? → Urgent fix
  
  ├─ Check trending
  │  ├─ Is this a one-week dip or continuing trend?
  │  ├─ If continuing → investigate deeper
  │  └─ If one-time → note as anomaly
  
  └─ Surface suggestion
     └─ "Revenue down 35%. Before next week, clarify: is this temporary
         or a new normal? This affects Q1 planning."
```

### Scenario 2: Client Pipeline Under $5K

```
TRIGGER: Weekly reset calculates pipeline < $5000

IF pipeline_value < 5000:
  ├─ Check client stages
  │  ├─ How many active? (should increase outreach if <3)
  │  ├─ How many won this month? (track close velocity)
  │  └─ How many new this week? (leading indicator)
  
  ├─ Surface alert
  │  └─ "Pipeline at risk: $[X] total. Recommendations:
  │      1) Increase Shadow Ops outreach
  │      2) Follow up with stalled clients
  │      3) Run a promotion or content campaign"
  
  └─ Set action
     └─ Next week's #1 priority: rebuild pipeline
```

### Scenario 3: Zero Calls Booked This Week (Shadow Ops)

```
TRIGGER: Weekly reset shows 0 calls booked

IF calls_booked_this_week == 0:
  ├─ Diagnose the funnel break
  │  ├─ Is outreach being sent? (if no → resume)
  │  ├─ Are people responding? (if low → revise messaging)
  │  ├─ Are audits being prepared? (if no → prepare)
  │  └─ Are prospects responding to audits? (if no → revisit content)
  
  ├─ Surface diagnostic
  │  ├─ Outreach sent this week: [N]
  │  ├─ Response rate: [%]
  │  ├─ Audits sent: [N]
  │  ├─ Responses to audits: [%]
  │  └─ "The funnel is broken at: [stage]"
  
  └─ Recommendation
     └─ "Pick one: Increase outreach? Revise opener message?
         Revise audit approach? Or audit [prospect name] and book a call?"
```

### Scenario 4: Client Investment >$20K

```
TRIGGER: New client submitted with investment_capacity > $20000

IF client.investment_capacity > 20000:
  ├─ Verify legitimacy
  │  ├─ Does business description match budget?
  │  ├─ Is there obvious misalignment?
  │  └─ Does client understand scope?
  
  ├─ Surface flag
  │  └─ "⚠️ [Client Name] indicated $[X] budget. This is above typical
  │      project size. Before committing: (1) Confirm scope, (2) Verify
  │      budget is real, (3) Ensure clear deliverables."
  
  └─ Recommendation
     └─ "Schedule discovery call to clarify expectations and scope.
         Consider whether this should be a custom build or a partnership."
```

---

## WEEKLY GUARDRAIL REVIEW

Every Sunday at 4:00 PM (before weekly reset), surface guardrail summary:

```
GUARDRAILS TRIGGERED THIS WEEK:

[ ] Order flags (high value, ambiguous routing, customer issues): [N]
[ ] Client flags (incomplete, too small, too large): [N]
[ ] Prospect flags (out of range, bot alert, low engagement): [N]
[ ] Energy flags (no deep work, overbooked, no recovery): [N]
[ ] Performance flags (below targets, concerning trends): [N]

HUMAN-JUDGMENT ITEMS PENDING:
[ ] [List specific decisions Ray needs to make]

RULES TO UPDATE:
[ ] [List any guardrails that feel misaligned]

NEXT WEEK'S FOCUS:
[ ] [Highest-priority guardrail category]
```

---

## CUSTOMIZING GUARDRAILS

### How to Adjust

Ray can customize any guardrail via a simple JSON config update. Example:

```json
{
  "skill_name": "SKILL-003",
  "rule": "high_value_threshold",
  "old_value": 300,
  "new_value": 500,
  "reason": "Most orders are $300-400, don't want too many flags",
  "effective_date": "2026-03-24",
  "reviewed_by": "Ray"
}
```

### Guardrail Audit Trail

Every change is logged:
- What changed
- When
- Why
- By whom
- Effect (did it reduce unnecessary flags?)

This helps Ray refine the system over time without losing data.

---

## GUARDRAILS THAT SHOULD NEVER BE OVERRIDDEN

Some guardrails are non-negotiable safety boundaries:

**1. Never auto-send outreach without Ray approval**
- Each message must be reviewed by Ray
- This prevents brand damage or contact spam

**2. Never process refunds automatically**
- Refunds require Ray's explicit action
- Customer service requires judgment

**3. Never expose sensitive data (credentials, tokens)**
- Store encrypted
- Never log token values
- Never send externally

**4. Never contact prospects with "do_not_contact" flag**
- Legal and ethical boundary
- Strict enforcement

**5. Never mark a deal as won without Ray confirmation**
- Only Ray signs deals or marks revenue
- AI can flag as "ready to close" but not close

---

## TESTING GUARDRAILS

Before deploying guardrails, test them in isolation:

```typescript
describe('Guardrail: High-Value Order Flag', () => {
  test('should flag orders >$300', () => {
    const order = { total: 350, customer: 'new' };
    const result = checkOrderGuardrails(order);
    expect(result).toContain('FLAG_HIGH_VALUE_ORDER');
  });
  
  test('should not flag orders ≤$300', () => {
    const order = { total: 250, customer: 'new' };
    const result = checkOrderGuardrails(order);
    expect(result).not.toContain('FLAG_HIGH_VALUE_ORDER');
  });
  
  test('should not flag high-value orders from known customers with clean history', () => {
    const order = { total: 500, customer: 'existing', history: 'clean' };
    const result = checkOrderGuardrails(order);
    expect(result).not.toContain('FLAG_HIGH_VALUE_ORDER');
  });
});
```

---

## GUARDRAIL AUDIT & OPTIMIZATION

Every 30 days, review guardrail effectiveness:

| Guardrail | Times Triggered | False Positives | Action Required | Effectiveness |
|-----------|-----------------|-----------------|-----------------|---------------|
| High-Value Orders | 8 | 1 | Adjust threshold up to $350 | 88% |
| Client Too Small | 3 | 0 | Keep as-is | 100% |
| Prospect Out of Range | 12 | 3 | Add "manual_override" option | 75% |
| Revenue Drop Alert | 1 | 0 | Keep as-is | 100% |

**Optimization goals:**
- False positive rate < 10%
- Catch 95%+ of actual issues
- Average guardrail resolution time < 5 min

---

## CONCLUSION

Guardrails aren't meant to constrain Ray. They're designed to catch edge cases and ask for judgment when it matters. The best guardrail is one that disappears — it does its job so quietly that Ray forgets it's there.

Over time, as Ray refines these rules, the system gets smarter. It learns what matters, what's noise, and when to escalate vs. when to handle autonomously.

**The goal: AI as a calm, knowledgeable teammate. Not a gatekeeper, but a guide.**

