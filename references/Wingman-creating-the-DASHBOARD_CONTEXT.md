# AI Strategic Wingman — Complete Dashboard Context
### The single file to give ChatGPT (or any AI) to understand this project in full

> **How to use this file:** Paste the entire contents into ChatGPT before asking it any questions
> about the dashboard, codebase, or what to build next. Everything it needs is here.

---

## EXECUTIVE SUMMARY

**What is this?**
AI Strategic Wingman is a Next.js 14 web application deployed at
`https://ai-wingman-app.vercel.app` (GitHub: `github.com/lourayr/AI-Wingman-App`).

It serves two purposes simultaneously:
1. **A tool Ray uses to run his AI consulting practice** — onboard clients, build their profiles,
   launch GPTs with their data pre-loaded, track pipeline, and run daily CEO-level intelligence
2. **A product he sells to other CEOs** — the dashboard itself IS the demo. When a client sees
   their own Gmail, Calendar, and business intelligence on one screen, they want to buy it.

**Who built it:** Ray Robinson (The Future Co / Metta Mentor / AI Strategic Wingman brand),
built iteratively with Claude Code over multiple sessions.

**The big idea:**
> "Biggest companies built tools giving them an unfair advantage.
>  AI levels the playing field. AI as a teammate. Spaciousness as the outcome."

Ray has ADHD. The dashboard is designed to give him — and his clients — command-level clarity
without the cognitive load of managing 14 different tools.

---

## BUSINESS CONTEXT — Who Ray Is

| Attribute | Detail |
|---|---|
| Name | Ray Robinson |
| Email | ray@thefutureco.net |
| Primary brand | AI Strategic Wingman (this app) |
| Personal brand | Metta Mentor (mettamentor.com) |
| Published framework | Golden Age Leadership (book + workshops) |
| Background | 30 years: military, technology, consulting |
| Identity | Neurodivergent (ADHD) — shapes how all systems are designed |
| Mission | Transform operational chaos into AI-enabled systems that protect attention |

**Ray's four operating areas (all need dashboard support):**
1. **Treasures** — WooCommerce store (Golden Age Treasures), bio/in-house product routing
2. **AI Wingman** — Consulting practice: onboard clients, run GPT sessions, track pipeline
3. **Shadow Operator** — Creator outreach → audits → booked calls → consulting partnerships
4. **Personal / Real Estate** — Pipeline being developed

**Ray's current pain points the dashboard solves:**
- Time fragmentation across 4 areas (ADD/80-20 problem)
- Repetitive tasks that steal execution bandwidth
- Needing to be in Treasures when he wants to be monetizing Shadow Ops / CEO CALM
- Finishing 2 courses (Monetise by Kyle Deneyssen, AI Income Workshop VIP)
- Setting up tools from API to direct login across all platforms

---

## TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | SSR + API routes + Server Actions |
| Database | Neon Postgres (serverless) | `@neondatabase/serverless`, edge-compatible |
| Auth | JWT via `jose` library | Single-password ops gate, httpOnly cookie |
| Google OAuth | Custom OAuth 2.0 flow | Gmail + Calendar, tokens in `user_tokens` table |
| Styling | Tailwind CSS v3 | Dark theme: `bg-slate-950`, purple/cyan brand |
| Icons | Lucide React | Used throughout |
| Hosting | Vercel | Auto-deploy on `main` branch push |
| Domain | vercel.app (free tier) | `ai-wingman-app.vercel.app` |

**Design system:**
- Background: `bg-slate-950` (near-black)
- Cards: `bg-slate-900/50 border border-slate-800`
- Primary gradient: `from-purple-600 to-cyan-600` (buttons, headings)
- Status colors: green = live/complete, yellow = draft/pending, cyan = strategy, red = urgent

---

## COMPLETE FILE STRUCTURE (Current State)

```
ai-wingman-app/
├── app/
│   ├── page.tsx                          # Redirects / → /dashboard
│   ├── layout.tsx                        # Root layout, Inter font, auth check for nav
│   ├── globals.css                       # Tailwind base styles
│   ├── manifest.ts                       # PWA web app manifest
│   │
│   ├── dashboard/page.tsx               # → DashboardMockup component
│   ├── onboarding/page.tsx              # → OnboardingWizard (6 steps, 29 fields)
│   ├── onboarding/summary/page.tsx      # → SummaryEditor (editable brief + DNA section)
│   ├── gpts/page.tsx                    # → GPTLauncher (11 GPTs, 5 categories)
│   ├── ceo/page.tsx                     # → CEOCommandDashboard (standalone)
│   ├── flow/page.tsx                    # → FlowOSDashboard (standalone)
│   ├── shadow/page.tsx                  # → ShadowOpsDashboard (standalone)
│   ├── ops/page.tsx                     # → WingmanOpsDashboard (JWT-protected)
│   ├── ops/login/page.tsx               # Server Action login form
│   │
│   └── api/
│       ├── onboarding/
│       │   ├── route.ts                 # GET (load by session) + POST (upsert)
│       │   ├── setup/route.ts           # GET — creates/migrates DB table (idempotent)
│       │   └── list/route.ts            # GET — all submissions (admin, no status filter)
│       ├── auth/
│       │   ├── logout/route.ts          # Clears ops session cookie
│       │   └── google/
│       │       ├── route.ts             # GET — initiates Google OAuth (sets state cookie)
│       │       └── callback/route.ts    # GET — exchanges code, stores token, → /ceo
│       ├── gmail/route.ts               # GET — Gemini summary + important emails
│       ├── calendar/route.ts            # GET — today's Google Calendar events
│       ├── tokens/setup/route.ts        # GET — creates user_tokens table
│       ├── gpt/[slug]/route.ts          # Server-side redirect to ChatGPT (URL masking)
│       └── test-db/route.ts             # DB health check
│
├── components/
│   ├── CEOCommandDashboard.tsx          # CEO Command tab (full-density, live data)
│   ├── DashboardMockup.tsx              # Main dashboard shell: all 5 tabs
│   ├── FlowOSDashboard.tsx              # Flow OS tab (mostly mock, future)
│   ├── GPTLauncher.tsx                  # AI Tools: 11 GPTs with prompt injection
│   ├── Navigation.tsx                   # Top nav (CEO Command, Flow OS, Shadow Ops added)
│   ├── OnboardingWizard.tsx             # 6-step client intake (steps 1–5 + DNA step 6)
│   ├── PresentationViewer.tsx           # Gamma-style slide deck viewer
│   ├── ShadowOpsDashboard.tsx           # Shadow Ops tab with client intelligence
│   ├── SummaryEditor.tsx                # Editable post-onboarding brief (with DNA section)
│   └── WingmanOpsDashboard.tsx          # Ops queue (/ops route, JWT-protected)
│
├── lib/
│   ├── auth.ts                          # JWT session create/verify/clear
│   ├── db.ts                            # Neon SQL client singleton
│   ├── google-auth.ts                   # Google OAuth URL builder + token exchange + refresh
│   └── google-fetch.ts                  # getGoogleAccessToken() + googleFetch() with auto-refresh
│
├── middleware.ts                        # Protects /ops/* with JWT check
├── SKILL.md                             # 16-skill agent instruction library (AI Wingman ops)
└── package.json
```

---

## DATABASE SCHEMA (Current — includes all migrations)

### Table: `onboarding_submissions`

Run `GET /api/onboarding/setup` once after any new deploy to create/migrate.

```sql
CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id              TEXT UNIQUE NOT NULL,   -- localStorage UUID, client-generated
  status                  TEXT NOT NULL DEFAULT 'draft',   -- 'draft' | 'complete'
  current_step            INTEGER NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- STEP 1: Business Overview
  email                   TEXT,
  business_name           TEXT,
  website                 TEXT,
  industry_model          TEXT,
  team_structure          TEXT,
  revenue_trajectory      TEXT,

  -- STEP 2: Goals & Challenges
  primary_goal            TEXT,
  biggest_challenge       TEXT,
  tech_stack              TEXT,
  strengths_gaps          TEXT,

  -- STEP 3: Resources & Assets
  investment_capacity     TEXT,
  success_metrics         TEXT,
  existing_assets         TEXT,
  untapped_opportunity    TEXT,

  -- STEP 4: Growth & Scaling
  scaling_bottleneck      TEXT,
  timeline                TEXT,
  ai_comfort              TEXT,    -- 'Early adopter' | 'Curious but cautious' | etc.
  dream_scenario          TEXT,

  -- STEP 5: Identity & Differentiation
  uvp                     TEXT,
  ideal_client            TEXT,
  unconventional_approach TEXT,
  anything_else           TEXT,

  -- STEP 6: Campaign DNA (optional — powers GhostwriterOS)
  brand_bio               TEXT,
  brand_voice             TEXT,
  banned_words            TEXT,
  persuasive_premise      TEXT,
  testimonials            TEXT,
  content_keywords        TEXT,
  offer_keywords          TEXT
);
```

### Table: `user_tokens`

Run `GET /api/tokens/setup` once, or it auto-creates on first Google OAuth.

```sql
CREATE TABLE IF NOT EXISTS user_tokens (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT        NOT NULL DEFAULT 'ray',
  service       TEXT        NOT NULL,           -- 'google'
  access_token  TEXT,
  refresh_token TEXT,
  expires_at    TIMESTAMPTZ,
  scope         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, service)
);
```

---

## ENVIRONMENT VARIABLES

```bash
# Neon Postgres
DATABASE_URL=postgresql://...neon.tech/...

# Ops dashboard JWT auth
JWT_SECRET=long-random-string
OPS_PASSWORD=single-password-for-ops-access

# Google OAuth (Gmail + Calendar)
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://ai-wingman-app.vercel.app/api/auth/google/callback
```

---

## ALL ROUTES (Complete Current List)

| Route | Method | Access | What it does |
|---|---|---|---|
| `/` | GET | Public | Redirects → `/dashboard` |
| `/dashboard` | GET | Public | Main dashboard shell (5 tabs) |
| `/onboarding` | GET | Public | 6-step client intake wizard |
| `/onboarding/summary?session=<id>` | GET | Public | Editable brief + DNA section + GPT launch |
| `/gpts` | GET | Public | 11 GPTs with client data injection |
| `/ceo` | GET | Public | CEO Command Dashboard (standalone) |
| `/flow` | GET | Public | Flow OS Dashboard (standalone) |
| `/shadow` | GET | Public | Shadow Ops Dashboard (standalone) |
| `/ops` | GET | JWT-protected | Ops execution queue |
| `/ops/login` | GET/POST | Public | Single-password login |
| `/api/onboarding` | GET | Public | Load submission by session ID (29 fields) |
| `/api/onboarding` | POST | Public | Upsert draft/complete submission |
| `/api/onboarding/setup` | GET | Public | Create/migrate DB table (idempotent) |
| `/api/onboarding/list` | GET | Public | All submissions, no status filter, newest first |
| `/api/auth/google` | GET | Public | Start Google OAuth (sets state cookie) |
| `/api/auth/google/callback` | GET | Public | Exchange code, store token, → /ceo?connected=google |
| `/api/gmail` | GET | Public | Gemini digest + important emails + order count |
| `/api/calendar` | GET | Public | Today's Google Calendar events |
| `/api/tokens/setup` | GET | Public | Create user_tokens table |
| `/api/gpt/[slug]` | GET | Public | Server-side redirect to ChatGPT (URL masking) |
| `/api/auth/logout` | GET | Public | Clear ops-session cookie → /dashboard |
| `/api/test-db` | GET | Public | DB connectivity check |

---

## THE FIVE DASHBOARD TABS

The main entry point is `/dashboard` (DashboardMockup.tsx).
It contains 5 tabs rendered inline:

```
Tab 1: Strawman (demo clients — hardcoded, for pitching)
Tab 2: Real     (live DB clients from /api/onboarding/list)
Tab 3: CEO Command (→ CEOCommandDashboard component)
Tab 4: Flow OS (→ FlowOSDashboard component)
Tab 5: Shadow Ops (→ ShadowOpsDashboard component)
```

CEO Command, Flow OS, and Shadow Ops also exist as standalone pages
at `/ceo`, `/flow`, `/shadow` for direct linking.

---

## TAB-BY-TAB BREAKDOWN

### TAB 1 — STRAWMAN (Demo Clients)
**Status: Mock data, intentional**

Four hardcoded clients used for pitching and demos:
- **TechStart Inc** (E-Commerce, $1.2M ARR) — opens modal with full brief + action buttons
  (Strategy GPT, GhostwriterOS campaign URL, Gamma presentation)
- **MettaMentor.com** (AI Consulting) — opens 4-tab modal:
  Tab: Client Brief (Ray's own full onboarding brief as demo)
  Tab: Strategy → PresentationViewer (Gamma-style slide deck)
  Tab: Campaign Plan → PresentationViewer
  Tab: Course Outline → PresentationViewer
- **RetailEdge** (Retail) — display only, no modal yet
- **HealthFirst** (Healthcare) — display only, no modal yet

**Key mechanism:** Clicking any action button in a modal auto-copies the brief to clipboard
before opening the GPT/tool link. User can paste immediately.

---

### TAB 2 — REAL CLIENTS
**Status: Live DB data**

- Fetches all submissions from `/api/onboarding/list` (no status filter — shows drafts + complete)
- Shows business name, email, industry, AI comfort level, real status badge, updated date
- **Clicking a client**: fetches the full 29-field profile via `/api/onboarding?session=<id>`,
  builds a complete brief (all 29 fields including Campaign DNA if filled), opens modal
- Modal has 3 action buttons: **Strategy GPT**, **Shadow Ops**, **View Form**
- Brief includes a `── CAMPAIGN DNA ──` section if Step 6 was filled

---

### TAB 3 — CEO COMMAND
**Status: Partial real, partial mock**

The CEO Command Dashboard (`CEOCommandDashboard.tsx`) is the flagship tab.

**What's real:**
- Live clock (second-by-second)
- Real Google Calendar events (when connected) in Schedule tab
- Real Gmail: Gemini "Weekly Email Summary" digest in Morning Brief
- Real Gmail: important unread emails in Inbox tab
- Real Gmail: Treasures order count
- Real client pipeline from Neon DB
- Tool Connector: Gmail + GCal connected/disconnected state from API

**What's mock (intentional placeholder for future integrations):**
- PRIORITIES list (hardcoded daily priorities)
- AI_INTEL flash cards (hardcoded intel items)
- PROJECTS status strip (hardcoded project names)
- SCHEDULE fallback (shown when Calendar not connected)
- ORDERS tab (WooCommerce email count, but order detail still mock)
- AUTOMATIONS health strip (Make.com — not yet API-connected)
- DECISIONS queue (hardcoded decision prompts)
- Tool Connector: Slack, Asana, Zoom, Notion, HubSpot, Stripe, Read.ai, ClickUp, Monday (all mock)

**Key design features:**
- Animated "Calm Score" ring (SVG, computed from client richness + pipeline data)
- All sections are collapsible (chevron toggles)
- Connect Gmail → Tool Connector → clicks "Gmail" when not connected → Google OAuth flow
- After OAuth: tools flip green, Gemini digest appears in Morning Brief

**Google OAuth flow:**
1. Click Gmail or Google Calendar in Tool Connector (when grey/disconnected)
2. → `GET /api/auth/google` (sets state cookie, redirects to Google)
3. → Google auth screen → user approves
4. → `GET /api/auth/google/callback` (verifies state, stores token in DB)
5. → Redirects to `/ceo?connected=google`
6. → Dashboard detects param, re-fetches Gmail + Calendar, tools go green

---

### TAB 4 — FLOW OS
**Status: Mostly mock**

`FlowOSDashboard.tsx` — daily rhythm, task management, calendar view.
Currently shows mock data. Designed for ADD-aware time management.
This is where SKILL-001 (Morning Focus Brief) and SKILL-014 (Course Tracker) would surface.

---

### TAB 5 — SHADOW OPS
**Status: Real DB data + intelligent prompts**

`ShadowOpsDashboard.tsx` — client intelligence and GPT launch center.

**6 section tabs per client:**
- `plan90` — 90-Day Acceleration Plan (AI-generated structure)
- `brief14` — 14-Day Quick Win Brief
- `monetize` — Monetization Map
- `gpts` — GPT Tool Launcher (copies full client profile + launches)
- `form` — Full Client Form (all 29 fields displayed, empty fields skip)
- `dna` — GhostwriterOS DNA Block (copy-ready for paste into campaign tool)

**Three GPT action buttons per client:**
All three copy a structured prompt and open the GPT:
1. **Strategy GPT** (`/api/gpt/biz-strategy`)
2. **Workflow Copilot** (`/api/gpt/workflow-copilot`)
3. **JV Partner Kit** (`/api/gpt/jv-partner-kit`)

Each prompt includes the full `buildFullProfileBlock()` — all 29 fields structured in sections
(BUSINESS / GOALS & CHALLENGES / RESOURCES / GROWTH / IDENTITY / CAMPAIGN DNA).

**DNA warning:** If Step 6 (Campaign DNA) is empty, a warning banner appears in the DNA tab
with a link to the onboarding wizard. This is correct behavior — it detects empty fields.

---

## ONBOARDING WIZARD — 6 STEPS, 29 FIELDS

`components/OnboardingWizard.tsx`

| Step | Name | Fields |
|---|---|---|
| 1 | Business Overview | email, businessName, website, industryModel, teamStructure, revenueTrajectory |
| 2 | Goals & Challenges | primaryGoal, biggestChallenge, techStack, strengthsGaps |
| 3 | Resources & Assets | investmentCapacity, successMetrics, existingAssets, untappedOpportunity |
| 4 | Growth & Scaling | scalingBottleneck, timeline, aiComfort, dreamScenario |
| 5 | Identity & Differentiation | uvp, idealClient, unconventionalApproach, anythingElse |
| 6 | Campaign DNA (optional) | brandBio, brandVoice, bannedWords, persuasivePremise, testimonials, contentKeywords, offerKeywords |

- Session ID stored in `localStorage` key `wingman-onboarding-session`
- Auto-saves to DB on each "Next" click (status: 'draft')
- On complete → redirects to `/onboarding/summary?session=<id>`
- All Step 6 fields are optional — no DNA is still valid

**IMPORTANT:** The DNA columns (`brand_bio` through `offer_keywords`) require the DB migration.
Run `GET /api/onboarding/setup` after any fresh deploy before collecting Step 6 data.

---

## SUMMARY EDITOR — POST-ONBOARDING

`components/SummaryEditor.tsx` — at `/onboarding/summary?session=<id>`

- Displays the full 29-field brief as an editable document
- Auto-saves every 1.5 seconds (debounced) + flushes on tab hide
- Campaign DNA section appears at the bottom (all 7 fields editable)
- **Copy to Clipboard** → copies `formatIntakeData()` string (all 29 fields formatted)
- If DNA filled → included in the copy with `── CAMPAIGN DNA ──` separator
- **Download as .txt** → browser download
- GPT Recommendation Engine: scores all 11 GPTs based on intake answers → shows top 2

---

## GPT LAUNCHER — 11 GPTS, 5 CATEGORIES

`components/GPTLauncher.tsx` at `/gpts`

All 11 GPT URLs live server-side in `app/api/gpt/[slug]/route.ts` (URL masking).

| Category | GPTs |
|---|---|
| Strategy | Biz Strategy Agent, Private Strategic Partner GPT |
| Automation | Workflow Engineering Copilot, AutoFlow Architect |
| Content | AI-Optimized Blog Creation GPT, JV Partner Kit Agent |
| Custom GPT | ArchitectGPT, AI Agent Selection Agent |
| Data | Data Helper Planning Agent, Data Collection & Cleaning Agent |
| Offer | Offer Stack Agent |

"Launch with my data" → copies full formatted intake brief to clipboard → opens GPT.

---

## GMAIL API — WHAT IT FETCHES

`app/api/gmail/route.ts`

When Google is connected, returns:
```json
{
  "connected": true,
  "email": "ray@smithrobinsonfunding.com",
  "importantCount": 3,
  "orderCount": 2,
  "geminiSummary": {
    "subject": "Weekly Email Summary",
    "date": "...",
    "body": "...(up to 2500 chars of Gemini AI email digest)...",
    "snippet": "..."
  },
  "calendarSummary": {
    "date": "...",
    "body": "...(daily calendar notification from Google)...",
    "snippet": "..."
  },
  "importantMessages": [
    { "id": "...", "subject": "...", "from": "...", "date": "...", "snippet": "..." }
  ]
}
```

**Gmail queries used:**
- Gemini digest: `subject:"Weekly Email Summary"` (maxResults: 1, most recent)
- Calendar summary: `from:calendar-notification@google.com` (maxResults: 1)
- Important emails: `is:important is:unread -category:promotions -category:social -category:updates -from:calendar-notification@google.com -subject:"Weekly Email Summary"` (maxResults: 8)
- Orders: `is:unread (subject:"New order" OR subject:"You have a new order" OR from:woocommerce)` (maxResults: 5)

---

## WHAT'S REAL VS MOCK — DEFINITIVE MAP

| Dashboard Area | Section | Real or Mock | Notes |
|---|---|---|---|
| CEO Command | Morning Brief — AI Email Digest | **REAL** (when Gmail connected) | Gemini Weekly Email Summary body |
| CEO Command | Morning Brief — Priorities | Mock | Hardcoded PRIORITIES array |
| CEO Command | Morning Brief — AI Intel Flash | Mock | Hardcoded AI_INTEL array |
| CEO Command | Morning Brief — Project Status | Mock | Hardcoded PROJECTS array |
| CEO Command | Schedule tab | **REAL** (when Calendar connected) | Live Google Calendar events |
| CEO Command | Schedule tab fallback | Mock | SCHEDULE array when not connected |
| CEO Command | Inbox tab | **REAL** (when Gmail connected) | is:important unread emails |
| CEO Command | Inbox tab fallback | Mock | ORDERS array (hardcoded Treasures orders) |
| CEO Command | Last Call tab | Mock | MEETING_MEMORY hardcoded |
| CEO Command | Stats: Priority Emails | **REAL** (Gmail) | importantCount from API |
| CEO Command | Stats: Meetings Today | **REAL** (Calendar) | event count from API |
| CEO Command | Stats: Orders Today | Mock | Hardcoded '3' |
| CEO Command | Stats: Clients | **REAL** | Neon DB count |
| CEO Command | Stats: Pipeline | **REAL** | Sum of investment_capacity from DB |
| CEO Command | Stats: Tools Live | **REAL** | Connected tool count |
| CEO Command | Client Pipeline | **REAL** | Neon DB, full 29-field on expand |
| CEO Command | Automation Health | Mock | Hardcoded AUTOMATIONS |
| CEO Command | Decision Queue | Mock | Hardcoded DECISIONS |
| CEO Command | Tool Connector: Gmail | **REAL** | OAuth, green when connected |
| CEO Command | Tool Connector: GCal | **REAL** | OAuth, green when connected |
| CEO Command | Tool Connector: others | Mock | Toggle-only, future integrations |
| Dashboard | Real Clients tab | **REAL** | Neon DB, full 29-field brief on click |
| Dashboard | Strawman tab | Mock | Intentional demo data |
| Shadow Ops | Client cards | **REAL** | Neon DB, all 29 fields |
| Shadow Ops | GPT prompts | **REAL** | Full profile injected into clipboard |
| Shadow Ops | DNA warning | **REAL** | Detects empty Step 6 fields |
| Onboarding | Steps 1–5 | **REAL** | Saves to Neon DB |
| Onboarding | Step 6 DNA | **REAL** (after DB setup) | Requires /api/onboarding/setup run |
| Flow OS | All | Mock | Not yet built |

---

## CHANGES MADE IN THIS DEVELOPMENT SESSION
*(Commits in order, most recent last)*

### 1. Navigation + New Pages (commit: `0e0eb52`)
- Added CEO Command, Flow OS, Shadow Ops to top nav
- Created `/ceo`, `/flow`, `/shadow` standalone pages
- Added Step 6 "Campaign DNA" to OnboardingWizard (7 optional fields)
- DB setup route: added 7 new DNA columns
- GET/POST onboarding routes: handle all DNA fields
- ShadowOpsDashboard: Client Form + GhostwriterOS DNA tabs
- Fixed "forms not showing" bug: removed `WHERE status = 'complete'` from list API

### 2. CEO Command Rewrite (commit: `93d4b2e`)
- Full rebuild with: animated Calm Score ring, live clock, 7 collapsible sections
- Mock data personalized to Ray: PRIORITIES, AI_INTEL, PROJECTS, SCHEDULE, ORDERS,
  AUTOMATIONS, MEETING_MEMORY, DECISIONS
- Real client pipeline from DB
- Tool Connector with 14 tools
- Calm Score computed from DB data richness

### 3. Collapsible + Full Profile + Client Actions (commit: `bba1792`)
- Every section collapsible with chevron toggle
- "Damien" replaced with "Wynter" throughout
- CEO Command: expanding a client fetches full 29-field DB profile
- Shadow Ops + Strategy GPT + Workflow Copilot buttons copy full profile to clipboard
- 4th action link per client: MettaMentor.com (for Metta Mentor demo) vs /dashboard
- Status badges (Complete / Draft) on every client card
- Removed status filter from list API

### 4. Google OAuth + Gmail + Calendar (commit: `a6f2d4a`)
- Created `lib/google-auth.ts` — OAuth URL builder + token exchange + refresh
- Created `lib/google-fetch.ts` — getGoogleAccessToken() with auto-refresh (5min threshold)
- Created `app/api/auth/google/route.ts` — initiate OAuth (state cookie)
- Created `app/api/auth/google/callback/route.ts` — exchange + store token
- Created `app/api/gmail/route.ts` — Gmail data endpoint
- Created `app/api/calendar/route.ts` — Calendar events endpoint
- Created `app/api/tokens/setup/route.ts` — create user_tokens table
- Fixed summary page: added 7 DNA fields to formData object
- Fixed SummaryEditor: added DNA to type, formatIntakeData, and document UI

### 5. Tool Connector OAuth Wiring (commit: `49800d4`)
- Gmail + GCal tools start disconnected (API updates on load)
- Clicking unconnected Gmail/GCal → redirects to `/api/auth/google`
- Other tools: mock toggle behavior unchanged

### 6. Gmail Intelligence Upgrade + OAuth Fix (commit: `5390828`)
- OAuth callback: auto-creates user_tokens table before INSERT
- fetchGoogleData() extracted as useCallback — re-runs immediately after ?connected=google
- Gmail API: now fetches Gemini "Weekly Email Summary" email body
- Gmail API: important emails only (is:important is:unread -promotions)
- Morning Brief: AI Email Digest card with Gemini summary
- Inbox tab: shows real priority emails when connected; inbox-zero state; falls back to mock
- Stats: importantCount replaces unreadCount

### 7. Real Clients Full Brief Fix (commit: `ae3a10c`)
- RealSubmission interface: added status, investment_capacity, ai_comfort
- FullClientData interface: complete 29-field type
- buildFullBrief() function: all 29 fields + DNA section
- openRealClient: now async — fetches full profile on click
- Real client modal: 3 action buttons (Strategy GPT, Shadow Ops, View Form)
- Status badge: shows real status (complete/draft)
- Cards: show AI comfort level tag

---

## KNOWN ISSUES / PENDING ACTIONS

### REQUIRES USER ACTION (not code changes):
1. **Run DB migration:** `GET /api/onboarding/setup`
   → Adds DNA columns to DB. Without this, Step 6 won't save.

2. **Run token table setup:** `GET /api/tokens/setup`
   → Creates user_tokens table. Auto-created on first OAuth now, but run manually to be safe.

3. **Google Cloud Console setup:**
   - Create project → enable Gmail API + Google Calendar API
   - Create OAuth 2.0 Web App credentials
   - Add redirect URIs: `https://ai-wingman-app.vercel.app/api/auth/google/callback`
     and `http://localhost:3000/api/auth/google/callback`
   - Copy Client ID + Client Secret

4. **Vercel env vars** (if not already set):
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

5. **Re-fill Step 6:** After running DB migration, go back to any existing onboarding
   session and fill Campaign DNA fields — they should save now.

### KNOWN CODE GAPS (not yet built):
- `RetailEdge` and `HealthFirst` strawman clients have no modal
- PresentationViewer HTML files (Strategy/Campaign/Course for MettaMentor) may not exist
- Slack, WooCommerce API, Notion, Stripe integrations are mock (see SKILL.md SKILL-013)
- `/api/onboarding/list` has no auth guard on the route itself (ops page is protected but route is open)
- Flow OS Dashboard is entirely mock
- The "second client form submission" the user filled out may need the DNA migration to show correctly

---

## DATA FLOW — FULL CLIENT JOURNEY

```
CLIENT JOURNEY:
  /onboarding
    → OnboardingWizard loads
    → Checks localStorage for session UUID (resume if exists)
    → User fills 6 steps (29 fields)
    → Each "Next" → POST /api/onboarding (status: 'draft')
    → Final step → POST /api/onboarding (status: 'complete')
    → Redirect → /onboarding/summary?session=<id>

  /onboarding/summary?session=<id>
    → Server fetches all 29 fields from DB
    → SummaryEditor renders as editable document
    → DNA section at bottom (7 optional fields)
    → Auto-saves 1.5s debounce
    → Copy button → formats all 29 fields → clipboard
    → GPT recommendation engine → suggests top 2 tools
    → Launch button → copies brief → opens /api/gpt/<slug> → ChatGPT

  /gpts
    → GPTLauncher checks sessionStorage first, then DB
    → "Launch with my data" → copies formatted prompt → opens GPT

ADMIN JOURNEY:
  /dashboard → Real Clients tab
    → Fetches /api/onboarding/list → shows all submissions
    → Click client → fetches /api/onboarding?session=<id> (full 29 fields)
    → Opens BriefModal with complete brief + 3 action buttons

  /dashboard → Shadow Ops tab
    → Fetches /api/onboarding/list → client cards
    → Expand client → 6 section tabs
    → GPT buttons → build full profile prompt → clipboard → open GPT

  /dashboard → CEO Command tab
    → Fetches /api/gmail → Gemini digest + important emails
    → Fetches /api/calendar → today's events
    → Fetches /api/onboarding/list → client pipeline
    → All data surfaces across 7 collapsible sections

GOOGLE AUTH:
  CEO Command → Tool Connector → Gmail (disconnected)
    → /api/auth/google → state cookie → Google OAuth
    → Google → /api/auth/google/callback
    → Verify state, exchange code, store token in user_tokens
    → Redirect → /ceo?connected=google
    → Dashboard detects param → re-fetches Gmail + Calendar → tools go green
```

---

## THE BRIEF FORMAT (What Gets Copied to GPTs)

Every GPT launch, client modal, and Shadow Ops action copies this format:

```
Start with this data and guide me to the right next steps, questions, and/or strategy:

Business Name: ...
Email: ...
Website: ...
Industry & Business Model: ...
Team Structure: ...
Revenue & Growth Trajectory: ...
Primary Goal (90 Days): ...
Biggest Challenge: ...
Current Tech Stack: ...
Team Strengths & Gaps: ...
Investment Capacity: ...
Success Metrics: ...
Existing Data & Assets: ...
Biggest Untapped Opportunity: ...
Scaling Bottleneck: ...
Implementation Timeline: ...
AI & Automation Comfort Level: ...
Dream Scenario (3 Years): ...
Unique Value Proposition: ...
Ideal Client Profile: ...
Unconventional Approach: ...
Anything Else: ...

── CAMPAIGN DNA ──   (only if Step 6 was filled)
Brand Bio: ...
Brand Voice: ...
Banned Words / Phrases: ...
Persuasive Premise: ...
Testimonials: ...
Content Keywords: ...
Offer Keywords: ...
```

---

## THE SKILL LIBRARY (SKILL.md)

A companion file (`SKILL.md`) defines 16 agent skills in a 6-field format
(NAME / TRIGGER / CONTEXT / STEPS / TOOLS / GUARDRAILS).

The 16 skills cover:
- SKILL-001: Daily 80/20 Morning Focus Brief (6:30 AM)
- SKILL-002: Weekly Clarity Reset (Sunday 5 PM)
- SKILL-003: Treasures Order Routing Monitor
- SKILL-004: Treasures Weekly Revenue Report
- SKILL-005: New Client Intake Auto-Processor
- SKILL-006: Pre-Call Client Strategy Brief Builder
- SKILL-007: Weekly Client Pipeline Review
- SKILL-008: CEO Command Morning Intel Pull (6 AM)
- SKILL-009: Connected Tools Health Check (8 AM)
- SKILL-010: Shadow Operator Daily Outreach Pipeline
- SKILL-011: Shadow Operator Prospect Audit Builder
- SKILL-012: Weekly Repetitive Task Elimination Audit
- SKILL-013: Tool Setup Assistant (API-to-Dashboard)
- SKILL-014: Course Progress Tracker
- SKILL-015: Three-Stream Revenue Pulse (Shadow/CEO CALM/Real Estate)
- SKILL-016: CEO CALM Dashboard Demo Scheduler

---

## WHAT COMES NEXT — PRIORITY ORDER

```
IMMEDIATE (unblock the foundation):
□ Run /api/onboarding/setup → DNA columns live
□ Run /api/tokens/setup → Google token table
□ Authenticate Gmail + Google Calendar → CEO Command goes live
□ Confirm all Real Clients appear → test full 29-field brief

NEXT SPRINT (wire the intelligence):
□ Schedule Morning Brief (SKILL-001) as daily agent
□ Surface Treasures order routing in Inbox tab (real WooCommerce API)
□ Connect Slack → next after Google
□ Auto-process new client forms (SKILL-005)

PRODUCT SPRINT (make it sellable):
□ CEO CALM demo mode (read-only view for prospects)
□ Three-stream revenue pulse in dashboard
□ Shadow Operator KPI surface in Flow OS
□ Flow OS real data (replace all mock)
```

---

*Last updated: 2026-03-23*
*App: https://ai-wingman-app.vercel.app*
*Repo: github.com/lourayr/AI-Wingman-App*
*Owner: Ray Robinson / The Future Co / AI Strategic Wingman*
*Companion files: SKILL.md (agent library) · READMEClaudewingman.md (original) · READMEClaudewing2.md (internals)*
