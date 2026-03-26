# Dashboard Templates Reference

This file provides design specifications and templates for the Calm Operations Dashboard, the core deliverable of every AI Wingman engagement.

---

## DESIGN PHILOSOPHY

The dashboard is not a data dump. It is an attention management tool. A founder should open it, get the answer to "how is my business doing right now?", and close it in under 2 minutes. If it takes longer, the dashboard has failed.

**Core Principles:**
- Single pane of glass: one view, no click-throughs for critical info
- Three-zone architecture: Alerts / Active Work / Health
- Color-coded status: green (healthy), amber (needs attention within 48h), red (action required now)
- Mobile-first: founders check phones constantly; the dashboard must work on a 6-inch screen
- Update frequency: real-time where possible, daily minimum, never stale data
- Under 20-minute daily ritual: the Focus Fortress Setup means the founder reviews the dashboard and makes all key decisions in a single morning block

---

## THREE-ZONE ARCHITECTURE

### Zone A: Critical Metrics and Alerts (Top 20% of screen)

This zone answers: "Is anything on fire?"

**Typical widgets:**
- Revenue tracker (daily/weekly/monthly vs. target)
- Pipeline value and conversion rate
- Blocked items requiring founder decision
- Overdue tasks or missed deadlines
- System alerts (broken automations, integration errors)

**Design rules:**
- Maximum 5 widgets in Zone A
- Each widget is one number or one status indicator
- Red items auto-surface to the top
- No charts in Zone A; save visual complexity for Zone B

### Zone B: Active Workflows and Status (Middle 50% of screen)

This zone answers: "What is actually happening right now?"

**Typical sections:**
- Active projects with status bars (on track / at risk / blocked)
- Open orders or service requests in pipeline
- Campaign performance (if marketing is active)
- Team task completion rate (this week)
- Client communication queue (unanswered items)

**Design rules:**
- Organized by business function, not by tool
- Each section collapsible for progressive disclosure
- Status uses consistent color coding (green/amber/red)
- Click-through available for detail but never required for daily review

### Zone C: Health Indicators (Bottom 30% of screen)

This zone answers: "Is the business sustainable this month?"

**Typical indicators:**
- Team bandwidth (utilization without burnout signals)
- Upcoming deadlines (next 7 and 30 days)
- Cash flow position or financial health snapshot
- Automation health (are all automations running?)
- Customer satisfaction or NPS trend
- Calendar density for next week

**Design rules:**
- Trend arrows (up/down/flat) preferred over raw numbers
- Weekly comparison, not daily (reduces noise)
- Flag leading indicators of problems, not just trailing metrics

---

## DASHBOARD TYPES BY BUSINESS

### Service Business Dashboard
Focus: Client pipeline, project delivery, team utilization
- Zone A: Revenue this month, active client count, overdue deliverables
- Zone B: Project kanban by client, team capacity view, pending proposals
- Zone C: Utilization rate, upcoming deadlines, client satisfaction

### E-commerce Dashboard
Focus: Orders, inventory, customer lifecycle
- Zone A: Revenue today/week, orders pending fulfillment, inventory alerts
- Zone B: Order pipeline, marketing campaign performance, top products
- Zone C: Customer retention rate, shipping/fulfillment health, return rate

### Creative Agency Dashboard
Focus: Projects, deadlines, client communication
- Zone A: Active project count, items awaiting client feedback, revenue pipeline
- Zone B: Project timelines, team assignments, content calendar
- Zone C: Client communication queue, upcoming deadlines, resource availability

### Wellness/Coaching Business Dashboard
Focus: Client sessions, bookings, content, community
- Zone A: Bookings this week, revenue vs. target, cancellation rate
- Zone B: Client session schedule, content publishing calendar, program enrollment
- Zone C: Client progress indicators, waitlist status, community engagement

---

## IMPLEMENTATION APPROACHES

### Approach 1: Notion Dashboard (Budget: Free-$10/mo)
Best for: solopreneurs and teams under 5
- Use Notion databases for each data type
- Build dashboard views using linked databases
- Zapier/Make connections for automated data ingestion
- Limitation: not real-time, update depends on automation frequency

### Approach 2: Google Sheets + Looker Studio (Budget: Free-$20/mo)
Best for: data-driven businesses, teams comfortable with spreadsheets
- Google Sheets as data layer (automated via Apps Script or Make)
- Looker Studio for visualization
- Advantage: powerful charts and filtering
- Limitation: requires some technical setup

### Approach 3: Custom HTML Dashboard (Budget: $50-200 one-time)
Best for: clients wanting a branded, dedicated experience
- Single HTML file with embedded JavaScript
- Pulls data via API connections or Google Sheets JSON
- Deployable on Netlify/Vercel for free hosting
- Advantage: fully customizable, fast, mobile-ready
- Limitation: requires initial build time

### Approach 4: Dedicated Tool (Budget: $30-100/mo)
Best for: teams wanting ongoing features and support
- Options: Databox, Geckoboard, Klipfolio, Cyfe
- Pre-built integrations with common business tools
- Advantage: minimal technical setup, ongoing updates
- Limitation: monthly cost, potential for tool-stack bloat (ironic but real)

---

## DASHBOARD DELIVERY CHECKLIST

Before handing off any dashboard to a client:

- [ ] Founder can answer "how is the business doing?" in under 2 minutes
- [ ] All three zones populated with real client data
- [ ] Color coding consistent and intuitive
- [ ] Mobile view tested and functional
- [ ] Data sources documented (where does each number come from?)
- [ ] Update frequency documented (how often does each widget refresh?)
- [ ] Ownership assigned (who monitors if something breaks?)
- [ ] Team trained on how to read and act on the dashboard
- [ ] Backup plan if primary data source goes down
- [ ] Client has approved the layout and metrics selection
