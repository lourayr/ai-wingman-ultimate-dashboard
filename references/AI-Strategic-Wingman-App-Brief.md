# AI Strategic Wingman App: Project Brief

## Vision

Build a Next.js application that helps consultants deliver **AI strategy and marketing campaigns** to clients by integrating with:
- **GhostwriterOS** (AI agent orchestration)
- **Synthesise.ai** (workflow automation)
- **Custom GPTs** (strategy, agent selection, workflow design, JV kits)

The app acts as a **strategic command center** that:
1. Authenticates into external platforms
2. Pulls client data and business context
3. Generates personalized AI strategy roadmaps
4. Builds marketing campaigns using your proven frameworks
5. Outputs deliverables (roadmaps, workflows, promotional kits)

---

## Core Functionality (MVP)

### 1. **Authentication & Integration Hub**
- OAuth connections to GhostwriterOS and Synthesise.ai
- Store API keys securely (Vercel environment variables)
- Dashboard showing connection status for each platform

### 2. **Client Onboarding Wizard**
Guided questionnaire based on your frameworks:
- **Frame/Floor/Ceiling questions** (strategic positioning)
- Business model, audience, pain points
- Current tech stack and AI maturity level
- Goals: automation, marketing, operations, or all three

### 3. **AI Strategy Generator**
Calls your **Biz Strategy Agent GPT** via OpenAI API to:
- Analyze client responses
- Generate strategic roadmap (3/6/12 month milestones)
- Recommend AI agent architecture
- Identify automation opportunities

### 4. **Marketing Campaign Builder**
Uses **JV Partner Kit Agent GPT** to create:
- Positioning statements
- Email sequences
- Social media content calendar
- Partner/affiliate promotional materials

### 5. **Workflow Automation Designer**
Integrates **AutoFlow Architect GPT** to:
- Map business processes
- Generate Make/Zapier/n8n workflow blueprints
- Export as visual flowcharts + implementation checklists

### 6. **Agent Selection & Deployment**
Uses **AI Agent Selection Agent GPT** to:
- Recommend which GhostwriterOS agents to deploy
- Configure agent parameters
- Push configurations to GhostwriterOS via API

### 7. **Deliverables Export**
- Generate PDF reports (strategy roadmap, campaign brief)
- Export Markdown documents
- Create shareable client portals

---

## Tech Stack (Matching Your Course Setup)

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Hosting** | Vercel |
| **Database** | Vercel Postgres |
| **Authentication** | NextAuth.js (OAuth for external platforms) |
| **AI Integration** | OpenAI API (for custom GPTs) |
| **External APIs** | GhostwriterOS, Synthesise.ai |
| **Styling** | Tailwind CSS (purple/cyan theme from your brand) |
| **Version Control** | GitHub |
| **Development** | Claude Code (Cursor IDE) |

---

## Database Schema (Vercel Postgres)

### **Tables**

#### `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `clients`
```sql
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  business_name VARCHAR(255),
  industry VARCHAR(100),
  onboarding_data JSONB, -- Stores questionnaire responses
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `strategies`
```sql
CREATE TABLE strategies (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id),
  roadmap JSONB, -- Generated strategy document
  status VARCHAR(50), -- draft, approved, in_progress
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `campaigns`
```sql
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id),
  campaign_type VARCHAR(100), -- email, social, jv_partner
  content JSONB, -- Generated marketing materials
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `integrations`
```sql
CREATE TABLE integrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  platform VARCHAR(50), -- ghostwriter, synthesise
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP
);
```

---

## Phase 1: Foundation (Week 1)

### Day 1-2: Project Setup
```bash
npx create-next-app@latest ai-wingman-app
cd ai-wingman-app
npm install @vercel/postgres next-auth openai axios
```

**File structure:**
```
ai-wingman-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── clients/route.ts
│   │   ├── strategies/route.ts
│   │   └── integrations/
│   │       ├── ghostwriter/route.ts
│   │       └── synthesise/route.ts
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── clients/page.tsx
│   │   └── strategies/page.tsx
│   ├── onboarding/page.tsx
│   └── layout.tsx
├── components/
│   ├── ClientCard.tsx
│   ├── StrategyBuilder.tsx
│   └── IntegrationStatus.tsx
└── lib/
    ├── db.ts
    ├── openai.ts
    └── integrations.ts
```

### Day 3-4: Database Setup
1. Create Vercel Postgres database
2. Run schema migrations
3. Build API routes for CRUD operations
4. Test with sample data

### Day 5-7: Authentication
1. Configure NextAuth.js
2. Add OAuth providers (Google, GitHub)
3. Build integration connection flows
4. Store encrypted tokens in database

---

## Phase 2: Core Features (Week 2-3)

### Client Onboarding Flow
**Route:** `/onboarding`

Multi-step form with your strategic questions:
1. **Frame Questions** (vision, positioning)
2. **Floor Questions** (current state, constraints)
3. **Ceiling Questions** (growth potential, resources)
4. **White Rabbit Questions** (breakthrough opportunities)

**Component:** `OnboardingWizard.tsx`
```tsx
const steps = [
  { title: "Frame", questions: frameQuestions },
  { title: "Floor", questions: floorQuestions },
  { title: "Ceiling", questions: ceilingQuestions },
  { title: "White Rabbit", questions: whiteRabbitQuestions }
];
```

### Strategy Generation Engine
**Route:** `/api/strategies/generate`

```typescript
// lib/openai.ts
export async function generateStrategy(clientData: ClientData) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are the Biz Strategy Agent. Generate a comprehensive AI strategy roadmap..."
      },
      {
        role: "user",
        content: JSON.stringify(clientData)
      }
    ]
  });
  
  return parseStrategyResponse(response);
}
```

### Marketing Campaign Builder
**Route:** `/dashboard/campaigns/new`

Integrates JV Partner Kit Agent to generate:
- Positioning statements
- Email sequences (5-7 emails)
- Social posts (LinkedIn, Twitter, Instagram)
- Partner promotional materials

---

## Phase 3: External Integrations (Week 4)

### GhostwriterOS Integration
**API Endpoint:** `https://api.ghostwriteros.ai/v1/agents`

**Features:**
- List available agents
- Deploy agent configurations
- Monitor agent performance
- Pull conversation logs

**Component:** `GhostwriterDashboard.tsx`

### Synthesise.ai Integration
**API Endpoint:** `https://api.synthesise.ai/v1/workflows`

**Features:**
- Create workflow templates
- Deploy workflows to client accounts
- Monitor execution status
- Export workflow documentation

**Component:** `SynthesiseWorkflows.tsx`

---

## Phase 4: Deliverables & Export (Week 5)

### PDF Report Generator
Use `@react-pdf/renderer` to create:
- **Strategy Roadmap** (branded, multi-page)
- **Campaign Brief** (marketing materials)
- **Workflow Documentation** (automation blueprints)

### Client Portal
**Route:** `/portal/[clientId]`

Shareable link where clients can:
- View their strategy roadmap
- Access marketing materials
- Download deliverables
- Track implementation progress

---

## Design System (Your Brand)

### Color Palette
```css
:root {
  --primary-purple: #8B5CF6;
  --primary-cyan: #06B6D4;
  --dark-bg: #0F172A;
  --card-bg: #1E293B;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
}
```

### Typography
- **Headings:** Inter (bold, tracking-tight)
- **Body:** Inter (regular)
- **Code:** JetBrains Mono

### Components
- Glassmorphic cards with subtle gradients
- Purple-to-cyan gradient accents
- Dark mode by default
- Smooth transitions and micro-interactions

---

## MVP Feature Priority

### Must-Have (Launch)
✅ User authentication  
✅ Client onboarding wizard  
✅ Strategy generation (via OpenAI API)  
✅ Basic dashboard (clients, strategies)  
✅ PDF export  

### Nice-to-Have (V1.1)
- GhostwriterOS integration  
- Synthesise.ai integration  
- Campaign builder  
- Client portal  

### Future (V2.0)
- White-label branding  
- Team collaboration  
- Analytics dashboard  
- Mobile app  

---

## Development Workflow

### Step 1: Initialize Project
```bash
npx create-next-app@latest ai-wingman-app --typescript --tailwind --app
cd ai-wingman-app
git init
git add .
git commit -m "Initial commit: AI Wingman App"
```

### Step 2: Create GitHub Repo
```bash
gh repo create ai-wingman-app --public --source=. --remote=origin
git push -u origin main
```

### Step 3: Connect to Vercel
1. Go to vercel.com/new
2. Import `ai-wingman-app` from GitHub
3. Framework Preset: **Next.js**
4. Deploy

### Step 4: Setup Database
1. Vercel dashboard → **Storage** → **Create Database**
2. Select **Postgres**
3. Copy connection string
4. Add to `.env.local`:
```bash
POSTGRES_URL="postgres://..."
```

### Step 5: Add Environment Variables
```bash
# Vercel dashboard → Settings → Environment Variables
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://ai-wingman-app.vercel.app
OPENAI_API_KEY=sk-...
GHOSTWRITER_API_KEY=...
SYNTHESISE_API_KEY=...
```

### Step 6: Develop with Claude Code
Use Cursor IDE with Claude Code to:
- Generate components
- Write API routes
- Debug issues
- Refactor code

### Step 7: Deploy Updates
```bash
git add .
git commit -m "Add client onboarding wizard"
git push
```
Vercel auto-deploys on push to `main`.

---

## Next Steps

**I can help you:**

1. **Generate the complete file structure** with starter code
2. **Build the onboarding wizard** with your strategic questions
3. **Create API routes** for OpenAI integration
4. **Design the dashboard UI** with your brand colors
5. **Write the database schema** and migration scripts

**What would you like to start with?**

A. Generate complete project scaffolding  
B. Build onboarding wizard first  
C. Setup database and API routes  
D. Design dashboard UI mockup  
E. Something else (specify)

---

# Claude Code Prompt: AI Strategic Wingman App

```markdown
Build a Next.js 14 app (App Router, TypeScript, Tailwind CSS) that combines three React components into a single application with role-based access control.

## Project Structure

Create a new Next.js app with these routes:

1. **Public Route:** `/onboarding` - Client-facing intake form
2. **Public Route:** `/dashboard` - Client dashboard view  
3. **Protected Route:** `/ops` - Wingman operations center (password protected)

## Requirements

### 1. Authentication System

Create a simple password-based auth for the ops center:

- **Password:** `w1ng0ps6113`
- Store auth state in session/cookie
- Redirect unauthorized users from `/ops` to login page
- Show "Access Ops Center" button in navigation when authenticated

**File:** `app/api/auth/ops/route.ts`
```typescript
// POST endpoint that validates password
// Returns JWT or session token
// Stores in httpOnly cookie
```

**File:** `middleware.ts`
```typescript
// Protect /ops route
// Check for valid session
// Redirect to /ops/login if unauthorized
```

### 2. Navigation Component

**File:** `components/Navigation.tsx`

Create a persistent navigation bar with:
- Logo: "AI Strategic Wingman" (gradient purple-to-cyan)
- Links: "Client Onboarding" | "Dashboard" | "Ops Center" (if authenticated)
- Active route highlighting
- Responsive mobile menu

### 3. Route Pages

**File:** `app/onboarding/page.tsx`
```typescript
import OnboardingWizard from '@/components/OnboardingWizard';

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
```

**File:** `app/dashboard/page.tsx`
```typescript
import DashboardMockup from '@/components/DashboardMockup';

export default function DashboardPage() {
  return <DashboardMockup />;
}
```

**File:** `app/ops/page.tsx`
```typescript
import WingmanOpsDashboard from '@/components/WingmanOpsDashboard';

export default function OpsPage() {
  return <WingmanOpsDashboard />;
}
```

**File:** `app/ops/login/page.tsx`
```typescript
// Password entry form
// Submit to /api/auth/ops
// Redirect to /ops on success
// Show error message on failure
```

### 4. Component Integration

Copy the three uploaded TypeScript files into the components directory:

- `components/OnboardingWizard.tsx` (from "Client Onboarding Wizard CLIENT.tsx")
- `components/DashboardMockup.tsx` (from "AI Wingman Dashboard UI.tsx")
- `components/WingmanOpsDashboard.tsx` (from "Wingman-Operations-Dashboard-NON-CLIENT-FACING.tsx")

**Modifications needed:**
- Ensure all lucide-react icons are imported correctly
- Add proper TypeScript types for all props
- Make components fully responsive
- Add loading states where appropriate

### 5. Layout & Styling

**File:** `app/layout.tsx`
```typescript
import Navigation from '@/components/Navigation';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

**File:** `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-purple: #8B5CF6;
  --primary-cyan: #06B6D4;
}

body {
  @apply bg-slate-950 text-slate-100;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-slate-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-slate-700 rounded-full;
}
```

### 6. Session Management

**File:** `lib/auth.ts`
```typescript
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function createSession() {
  const token = await new SignJWT({ role: 'ops' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET);
  
  cookies().set('ops-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400, // 24 hours
    path: '/'
  });
}

export async function verifySession() {
  const token = cookies().get('ops-session')?.value;
  if (!token) return false;
  
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export function clearSession() {
  cookies().delete('ops-session');
}
```

### 7. Environment Variables

**File:** `.env.local`
```bash
JWT_SECRET=your-random-secret-key-here
OPS_PASSWORD=w1ng0ps6113
```

### 8. Dependencies

Install these packages:
```bash
npm install lucide-react jose
npm install --save-dev @types/node
```

## Design Requirements

- **Color Scheme:** Dark mode (slate-950 background)
- **Accent Colors:** Purple (#8B5CF6) and Cyan (#06B6D4) gradients
- **Typography:** Inter font family
- **Animations:** Smooth transitions, subtle hover effects
- **Responsive:** Mobile-first, works on all screen sizes

## Security Notes

- Password is hardcoded for MVP (not production-ready)
- Use httpOnly cookies for session storage
- Add CSRF protection in production
- Rate limit login attempts in production

## Testing Checklist

After building, verify:
- [ ] Can access `/onboarding` without authentication
- [ ] Can access `/dashboard` without authentication
- [ ] Cannot access `/ops` without authentication
- [ ] Login at `/ops/login` with password `w1ng0ps6113` works
- [ ] Navigation shows "Ops Center" link only when authenticated
- [ ] All three components render correctly
- [ ] Mobile responsive on all routes
- [ ] Session persists across page refreshes

## File Structure Summary

```
ai-wingman-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── ops/
│   │           └── route.ts
│   ├── onboarding/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── ops/
│   │   ├── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   ├── OnboardingWizard.tsx
│   ├── DashboardMockup.tsx
│   └── WingmanOpsDashboard.tsx
├── lib/
│   └── auth.ts
├── middleware.ts
├── .env.local
└── package.json
```

Build this step-by-step, testing each route as you go. Start with the basic routing structure, then add authentication, then integrate the three components.
```

---

## Additional Context for Claude Code

When you paste this prompt into Claude Code (Cursor), also mention:

**"I have three TypeScript React component files that I'll attach to this conversation:**
1. **Client Onboarding Wizard CLIENT.tsx** - Use as `components/OnboardingWizard.tsx`
2. **AI Wingman Dashboard UI.tsx** - Use as `components/DashboardMockup.tsx`  
3. **Wingman-Operations-Dashboard-NON-CLIENT-FACING.tsx** - Use as `components/WingmanOpsDashboard.tsx`

**Please integrate these components into the Next.js app structure described above. The components are already styled and functional, just need to be wired into the routing and authentication system."**

---

