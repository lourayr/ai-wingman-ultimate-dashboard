# AI Wingman Skills System: Executive Summary
### One Dashboard, Infinite Clarity

---

## WHAT YOU'RE GETTING

Three comprehensive documents that transform the AI Wingman Dashboard from a mockup into a fully autonomous operating system:

### 1. **SKILL_WINGMAN_IMPROVED.md** (54 KB)
The master specification. Defines 13 skills across 6 operational domains (Calm Control, Treasures, AI Wingman, Shadow Operator, Flow OS, Personal Coherence). Each skill follows the 6-field format: NAME, TRIGGER, CONTEXT, STEPS, TOOLS, GUARDRAILS.

**Use this when:** You need to understand what each skill does, when it runs, and what decisions it makes.

### 2. **SKILL_IMPLEMENTATION_GUIDE.md** (22 KB)
The technical roadmap. Covers database schema, API route structure, scheduled execution setup, troubleshooting, and a 6-week rollout plan.

**Use this when:** You're ready to build. It walks from foundation (Week 1) through production deployment (Week 6), with code examples and testing checklists.

### 3. **SKILL_GUARDRAILS_AND_RULES.md** (23 KB)
The decision logic. Defines guardrail decision trees, customizable thresholds, scenario-based logic, and how to tune the system over time.

**Use this when:** You need to understand when a skill stops and asks for judgment, or when you want to adjust guardrails (e.g., "raise order verification threshold from $300 to $500").

---

## THE CORE PHILOSOPHY

**Better ops don't just keep the lights on. They open doors you didn't know were there.**

The AI Wingman Skills System is built on three operating principles:

**1. Spaciousness as the Outcome.** Ray runs four distinct areas (Treasures, AI Wingman, Shadow Operator, Personal). He has ADHD and context-switches easily. The system protects his attention by surfacing three priorities daily, not 30. It absorbs the operational drag so Ray can do strategic thinking.

**2. Autonomy with Judgment Gates.** Skills run automatically, but every decision point where human judgment matters includes a guardrail. The system never:
- Auto-sends outreach without Ray's approval
- Auto-processes refunds
- Auto-marks deals as won
- Exposes credentials or sensitive data

Ray stays in control.

**3. Simple Rules Beat Complex Algorithms.** Every skill uses clear if/then logic with explicit thresholds. When a threshold is unclear, the system surfaces it and asks. Over time, Ray refines thresholds based on real data. The system learns his patterns and adjusts.

---

## QUICK START: 6-WEEK ROLLOUT

### Week 1: Foundation (Calm Control Start)

**Deploy:** SKILL-001 (Daily Brief) + SKILL-002 (Weekly Reset)

- Set up Neon Postgres database
- Connect Gmail + Google Calendar APIs
- Run morning brief manually, review output
- Adjust guardrails based on first output

**Outcome:** Ray wakes to a 3-priority brief instead of inbox chaos.

### Week 2-3: Treasures Data

**Deploy:** SKILL-003 (Order Monitor) + SKILL-004 (Weekly Revenue)

- Connect WooCommerce email parsing
- Run order monitoring for one full week
- Verify routing accuracy >95%
- Surface revenue summary in dashboard

**Outcome:** Every order is tracked, flagged if needed, and revenue is clear.

### Week 4: Pipeline Tracking

**Deploy:** SKILL-005 (Client Intake Processor) + SKILL-006 (Pre-Call Brief)

- Test with real client intake (if available) or mock data
- Verify profile is built correctly
- Check that pre-call brief is generated 2 hours before call
- Review AI-recommended services for accuracy

**Outcome:** New clients are onboarded automatically, strategy calls are prepped in seconds.

### Week 5: Shadow Operator

**Deploy:** SKILL-008 (Outreach Queue) + SKILL-009 (Audit Prep)

- Set up prospect tracker (Google Sheets or DB)
- Run outreach queue for one week
- Verify follow-up messages are being generated correctly
- Test audit prep with 2-3 real prospects

**Outcome:** Daily outreach is managed, audits are prepped, calls are tracked.

### Week 6: Optimization + Monitoring

**Deploy:** SKILL-010 (Automation Detector) + SKILL-011 (Tool Health)

- Run first automation opportunity scan
- Identify top 3 repetitive tasks to automate next
- Check tool connection health
- Review system with Ray, fine-tune thresholds

**Outcome:** System is running, Ray knows what's working and what needs adjustment.

---

## THE 13 SKILLS AT A GLANCE

| # | Skill | Domain | Trigger | Purpose |
|---|-------|--------|---------|---------|
| **001** | Daily Intelligence Brief | Calm Control | 6 AM weekdays | Surface 3 priorities from calendar, email, pipeline, energy |
| **002** | Weekly Clarity Reset | Calm Control | 5 PM Sundays | Review what moved the needle, identify one leverage point |
| **003** | Order Monitor | Treasures | Real-time + 6 PM | Catch every order, route correctly, flag exceptions |
| **004** | Weekly Revenue Summary | Treasures | 8 AM Mondays | Track revenue, best sellers, reorder alerts |
| **005** | Client Intake Processor | AI Wingman | On complete submission | Validate client, recommend services, prep for strategy call |
| **006** | Pre-Call Strategy Brief | AI Wingman | 2 hrs before call | Build one-page brief with context, questions, DNA status |
| **007** | Weekly Pipeline Review | AI Wingman | 4 PM Fridays | Classify clients (Active/Stalled/New), surface action items |
| **008** | Outreach Queue Manager | Shadow Ops | 9 AM weekdays | Manage daily outreach, follow-ups, call bookings |
| **009** | Audit Prep Builder | Shadow Ops | On positive response | Auto-generate audit outline, talking points, hooks |
| **010** | Automation Detector | Flow OS | 4 PM Sundays | Find repetitive tasks, map to automation tools |
| **011** | Tool Health Monitor | Flow OS | 8 AM daily | Check API connections, refresh tokens, recommend next tool |
| **012** | Energy & Recovery Check | Personal | 6 PM Sundays | Track deep work, recovery time, energy state |
| **013** | Learning Progress Tracker | Personal | 6 PM Sundays | Monitor course progress, surface gentle nudges |

---

## GUARDRAILS: WHEN THE SYSTEM STOPS AND ASKS

### Critical Guardrails (Never Override)

**1. Outreach:** Never auto-send. Ray must review and approve every message.

**2. Refunds:** Never process automatically. Requires Ray's explicit action.

**3. Credentials:** Never expose tokens, keys, or sensitive data.

**4. Do-Not-Contact:** Never contact prospects with "do_not_contact" flag.

**5. Deal Closure:** Never mark deals as won without Ray confirmation.

### Adjustable Guardrails

These have thresholds Ray can tune:

- **Order verification:** Default $300 high-value threshold (adjustable)
- **Client minimum:** Default $500 investment (adjustable)
- **Prospect range:** Default 10K–100K followers (adjustable)
- **Revenue alert:** Default 30% week-over-week drop (adjustable)
- **Deep work target:** Default 20 hours/week (adjustable)
- **Energy recovery:** Default 5 hours/week (adjustable)

See **SKILL_GUARDRAILS_AND_RULES.md** for full decision trees and how to customize.

---

## DATA FLOWS: How Information Moves

### Inbound (What the system reads)

```
Gmail                              Google Calendar
  ↓                                     ↓
Important + Unread                    Today's Events
  ↓                                     ↓
        ↓ SKILL-001: Daily Brief ←
        ↓ SKILL-002: Weekly Reset ←
        
WooCommerce Emails → SKILL-003: Order Monitor
                  → SKILL-004: Revenue Summary

Onboarding Form Submissions → SKILL-005: Client Processor
                            → SKILL-006: Call Brief

Client Pipeline DB → SKILL-007: Pipeline Review

Prospect Tracker → SKILL-008: Outreach Queue
               → SKILL-009: Audit Prep

All of the above → SKILL-012: Energy Check
               → SKILL-013: Learning Tracker
```

### Outbound (What the system surfaces)

```
CEO Command Dashboard
  ├─ Morning Brief (SKILL-001)
  ├─ Weekly Reset (SKILL-002)
  ├─ Orders & Revenue (SKILL-003, SKILL-004)
  ├─ Client Pipeline (SKILL-005, SKILL-007)
  ├─ Tool Health (SKILL-011)
  └─ Energy/Recovery (SKILL-012)

Shadow Ops Dashboard
  ├─ Client Cards (SKILL-005)
  ├─ Pre-Call Briefs (SKILL-006)
  ├─ Outreach Queue (SKILL-008)
  └─ Audit Prep (SKILL-009)

Flow OS Dashboard
  ├─ Automation Opportunities (SKILL-010)
  ├─ Tool Connections (SKILL-011)
  ├─ Learning Queue (SKILL-013)
  └─ Weekly Reset (SKILL-002)

Notifications/Alerts
  ├─ Urgent client emails (SKILL-001)
  ├─ High-value orders (SKILL-003)
  ├─ New client intake (SKILL-005)
  ├─ Stalled prospects (SKILL-008)
  └─ Energy alerts (SKILL-012)
```

---

## TECH STACK SUMMARY

| Layer | Tech | Purpose |
|-------|------|---------|
| **Framework** | Next.js 14 (App Router) | Full-stack TypeScript app |
| **Database** | Neon Postgres | All data storage, queries |
| **APIs** | Google (Gmail, Calendar), WooCommerce, OpenAI | Data sources + synthesis |
| **Hosting** | Vercel | Deployment, cron jobs, env vars |
| **Frontend** | React + TypeScript + Tailwind | Dashboard UI |
| **Authentication** | NextAuth.js + OAuth | User sign-in, token management |
| **Scheduling** | Vercel Cron | Trigger skills on schedule |

No external dependencies on Make.com or n8n required (though they can integrate via webhooks for advanced automations).

---

## CUSTOMIZATION PATHS

### For Ray: Adjust Guardrails

You can modify any guardrail without touching code. Update via a simple JSON config:

```json
{
  "skill": "SKILL-003",
  "rule": "high_value_threshold",
  "change": 300 → 500,
  "reason": "Most orders are $300-400, too many false flags"
}
```

See **SKILL_GUARDRAILS_AND_RULES.md** for full customization guide.

### For Developers: Add New Skills

Follow the 6-field template. Example:

1. **NAME:** What does it do? (one sentence)
2. **TRIGGER:** When should it run? (scheduled or event-based)
3. **CONTEXT:** What does it need to know? (business rules, data requirements)
4. **STEPS:** Step-by-step process (written for a new employee)
5. **TOOLS:** What systems does it need? (APIs, databases, external services)
6. **GUARDRAILS:** When should it stop and ask the human? (decision gates)

### For Developers: Add New Data Sources

If you want to connect a new tool (e.g., Notion, Slack, HubSpot):

1. Create OAuth route (follow Gmail pattern in **SKILL_IMPLEMENTATION_GUIDE.md**)
2. Create fetch function (lib/[tool]-fetch.ts)
3. Integrate into relevant skills (add to step 1 of appropriate skill)
4. Test with guardrails

---

## SUCCESS METRICS

### Week 1-2: Foundation
- ✓ Morning brief runs daily, 0 errors
- ✓ Weekly reset runs, all data accurate
- ✓ Ray finds brief useful (subjective feedback)

### Week 3-4: Data Integrity
- ✓ Order routing accuracy >95%
- ✓ Revenue totals match WooCommerce reports
- ✓ Client onboarding complete within 1 hour of submission
- ✓ Pre-call briefs generated correctly

### Week 5-6: Full Operations
- ✓ Outreach queue managed, follow-ups scheduled
- ✓ Audits prepped, links working
- ✓ Tool health checks running, no missed API failures
- ✓ Ray's decision time reduced 40-50% (fewer context switches)

### Ongoing: Optimization
- ✓ Guardrail false positive rate <10%
- ✓ Skills catch 95%+ of edge cases
- ✓ Ray never manually checks a tool tab (everything in dashboard)
- ✓ System adapts as Ray refines thresholds

---

## SUPPORT & ITERATION

### First 30 Days

- Monitor skill execution logs daily
- Track which guardrails fire most often
- Identify false positives (adjust thresholds)
- Identify missed cases (add guardrails)

### Monthly Review

- Analyze guardrail effectiveness
- Calculate time saved per skill
- Gather Ray's feedback on accuracy
- Adjust parameters for Q1 goals

### Quarterly Evolution

- Add new skills as Ray's needs evolve
- Integrate new data sources (e.g., Stripe for revenue)
- Optimize slow-running skills
- Archive skills that are no longer useful

---

## HOW TO USE THESE DOCUMENTS

### Start Here

1. Read this summary first (you're doing it now ✓)
2. Review the 6-field template in **SKILL_WINGMAN_IMPROVED.md**
3. Pick one skill to understand deeply (recommend: SKILL-001)

### When Building

1. Use **SKILL_IMPLEMENTATION_GUIDE.md** for database schema and API routes
2. Reference **SKILL_GUARDRAILS_AND_RULES.md** for decision logic
3. Test each skill independently before integrating

### When Customizing

1. Update guardrails in **SKILL_GUARDRAILS_AND_RULES.md**
2. Test against real data
3. Log all changes with timestamps and reasons
4. Review effectiveness after 7 days

### When Troubleshooting

1. Check execution logs (in Vercel or Neon admin)
2. Review error message in **SKILL_IMPLEMENTATION_GUIDE.md** troubleshooting section
3. Test individual API route in isolation
4. Check guardrail decision tree for edge cases

---

## FINAL PRINCIPLES

These skills work because they follow three rules:

**1. Keep it simple.** If/then logic with clear thresholds. No black-box AI making judgment calls. Every decision is traceable and adjustable.

**2. Surface signal, not noise.** Ray's attention is limited. Skills only surface what actually matters, with guardrails screening out false positives.

**3. Ask before deciding.** When a situation requires judgment—a refund, a high-value order, a deal closure—the system stops and asks Ray. No override without explicit approval.

**The goal: Founder operating at their best. Not constantly managing tools, but staying connected to business health and strategy.**

---

## NEXT STEPS

1. **This week:** Set up database (Neon), deploy SKILL-001 and SKILL-002 in test mode
2. **Next week:** Connect WooCommerce and order monitoring
3. **Week 3:** Add client onboarding and pre-call briefs
4. **Week 4:** Launch Shadow Operator outreach and audits
5. **Week 5:** Run automation detector and finalize dashboard

**Expect:** By end of Week 6, Ray checks one dashboard 2-3 times daily for 15-20 minutes total, instead of 30-49 tabs, 30+ hours/week.

**Result:** More clarity. More spaciousness. More strategy. Less chaos.

---

## DOCUMENT MANIFEST

| Document | Size | Purpose | Audience |
|----------|------|---------|----------|
| **SKILL_WINGMAN_IMPROVED.md** | 54 KB | Master spec (13 skills, 6 domains) | Founders, PMs, architects |
| **SKILL_IMPLEMENTATION_GUIDE.md** | 22 KB | Technical build guide (schema, routes, deploy) | Developers, architects |
| **SKILL_GUARDRAILS_AND_RULES.md** | 23 KB | Decision logic (guardrails, thresholds, customization) | Founders, developers |
| **SKILL_EXECUTIVE_SUMMARY.md** | This doc | Overview, quick start, principles | Everyone |

**Total:** ~125 KB of actionable specification, implementation guidance, and customization framework.

---

## THE MISSION

> *Better ops don't just keep the lights on. They open doors you didn't know were there.*

This system turns Ray's operational chaos into calm command. It doesn't ask him to be more productive. It asks the question: **What if the founder could stay in strategy mode, while AI handles the obvious?**

That's what these skills deliver.

