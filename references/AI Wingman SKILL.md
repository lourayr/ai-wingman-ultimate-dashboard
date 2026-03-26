# AI Wingman SKILL.md Implementation Guide
### From Specification to Execution

---

## PART 1: DEPLOYMENT ROADMAP

### Phase 0 (Week 1): Foundation Setup

Before any skills run, the infrastructure must be in place.

#### Database Schema

Create the following Neon Postgres tables:

```sql
-- Users and authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  timezone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- API credentials and OAuth tokens
CREATE TABLE user_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  service VARCHAR(50), -- gmail, calendar, stripe, etc.
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Treasures orders log
CREATE TABLE treasures_orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  order_id VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  items JSONB, -- array of {sku, name, qty, price}
  total_amount DECIMAL(10, 2),
  routing_type VARCHAR(50), -- BIO, IN_HOUSE, MIXED
  status VARCHAR(50), -- pending, routed, shipped, fulfilled
  flags JSONB, -- {high_value, inventory_alert, etc.}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Wingman client onboarding
CREATE TABLE onboarding_submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  business_name VARCHAR(255),
  industry VARCHAR(100),
  submission_data JSONB, -- all 29 fields from intake form
  status VARCHAR(50), -- in_progress, complete, processed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Client pipeline
CREATE TABLE clients_pipeline (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  submission_id INTEGER REFERENCES onboarding_submissions(id),
  client_name VARCHAR(255),
  status VARCHAR(50), -- intake_complete, call_scheduled, strategy_delivered, won, no_fit
  investment_capacity VARCHAR(50), -- 1k, 5k, 10k, 20k_plus
  estimated_value DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shadow Operator prospect tracking
CREATE TABLE prospects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  handle VARCHAR(255),
  platform VARCHAR(50), -- instagram, tiktok, youtube, linkedin
  follower_count INTEGER,
  engagement_rate DECIMAL(5, 2),
  stage VARCHAR(50), -- opener_ready, waiting_response, audit_ready, call_booked, won, no_fit
  last_action_date TIMESTAMP,
  flags JSONB, -- {bot_alert, contacted_before, etc.}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skill execution log (for debugging and audit)
CREATE TABLE skill_executions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  skill_name VARCHAR(100), -- e.g., SKILL-001
  triggered_at TIMESTAMP,
  status VARCHAR(50), -- success, success_with_flags, error
  output JSONB,
  guardrails_triggered JSONB, -- which guardrails fired?
  execution_time_ms INTEGER,
  error_message TEXT
);
```

#### API Routes Structure

Create these Next.js 14 API routes in `app/api/`:

```
app/api/
├── auth/
│   ├── google/route.ts           (OAuth flow)
│   └── [...nextauth]/route.ts    (NextAuth.js)
├── gmail/
│   ├── route.ts                  (fetch important/unread)
│   └── sync/route.ts             (background sync)
├── calendar/
│   ├── route.ts                  (fetch events)
│   └── focus-blocks/route.ts     (create/manage)
├── treasures/
│   ├── orders/route.ts           (create/list orders)
│   ├── weekly/route.ts           (revenue summary)
│   └── parse-email/route.ts      (webhook for WooCommerce)
├── wingman/
│   ├── onboarding/route.ts       (submit/fetch)
│   ├── clients/route.ts          (pipeline)
│   └── recommend-services/route.ts
├── shadow-ops/
│   ├── prospects/route.ts        (CRUD)
│   ├── kpi/route.ts              (daily/weekly tallies)
│   └── audits/route.ts
├── skills/
│   ├── morning-brief/route.ts    (SKILL-001)
│   ├── weekly-reset/route.ts     (SKILL-002)
│   ├── order-monitor/route.ts    (SKILL-003)
│   └── [other skills]/route.ts
└── webhooks/
    ├── woocommerce/route.ts
    └── zapier/route.ts
```

#### Environment Variables (Vercel)

```bash
# OAuth and API keys
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
OPENAI_API_KEY=...
WOOCOMMERCE_API_KEY=...
WOOCOMMERCE_STORE_URL=...

# Database
POSTGRES_URL=...

# App config
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://[your-app].vercel.app

# Feature flags
SKILL_DAILY_BRIEF_ENABLED=true
SKILL_ORDER_MONITOR_ENABLED=true
SKILL_PIPELINE_TRACKING_ENABLED=true
```

### Phase 1 (Weeks 2-3): Launch Calm Control

Start with the simplest skills first to validate the framework.

#### SKILL-001 & SKILL-002 First Implementation

```typescript
// app/api/skills/morning-brief/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchGmailImportant } from '@/lib/gmail-fetch';
import { fetchCalendarToday } from '@/lib/calendar-fetch';
import { fetchOrdersCount } from '@/lib/treasures-fetch';
import { generateBrief } from '@/lib/openai-synthesis';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    
    // Gather data
    const emails = await fetchGmailImportant(userId);
    const calendar = await fetchCalendarToday(userId);
    const orders = await fetchOrdersCount(userId);
    
    // Synthesize
    const brief = await generateBrief({
      emails,
      calendar,
      orders,
      userId
    });
    
    // Check guardrails
    const guardrails = checkGuardrails(brief);
    
    // Store and return
    await storeBrief(userId, brief, guardrails);
    
    return NextResponse.json({
      success: true,
      brief,
      guardrails: guardrails.length > 0 ? guardrails : null
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Run daily at 6 AM via cron job
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Fetch all users and run skill for each
  return GET(req);
}
```

#### Scheduled Execution (Vercel Cron)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/skills/morning-brief",
      "schedule": "0 6 * * 1-5" // Weekdays at 6 AM
    },
    {
      "path": "/api/skills/weekly-reset",
      "schedule": "0 17 * * 0" // Sundays at 5 PM
    },
    {
      "path": "/api/skills/order-monitor",
      "schedule": "0 18 * * *" // Daily at 6 PM
    }
  ]
}
```

### Phase 2 (Weeks 4-5): Add Treasures & Pipeline

Now integrate real data sources.

#### WooCommerce Email Parsing

```typescript
// app/api/webhooks/woocommerce/route.ts

export async function POST(req: NextRequest) {
  const email = await req.json();
  
  // Parse WooCommerce email
  const order = parseWooCommerceEmail(email.body);
  
  // Determine routing
  const routing = determineRouting(order.items);
  
  // Log to database
  await createOrder({
    user_id: process.env.DEFAULT_USER_ID, // Ray's ID
    order_id: order.id,
    customer_name: order.customer,
    items: order.items,
    total_amount: order.total,
    routing_type: routing
  });
  
  // Check for flags
  const flags = checkOrderFlags(order, routing);
  
  if (flags.length > 0) {
    // Notify Ray
    await notifyRay({ type: 'order_flag', order, flags });
  }
  
  return NextResponse.json({ success: true });
}
```

#### Client Intake Processing

```typescript
// app/api/wingman/onboarding/route.ts

export async function GET(req: NextRequest) {
  const submissionId = req.nextUrl.searchParams.get('submission_id');
  
  const submission = await getSubmission(submissionId);
  
  if (!submission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(submission);
}

export async function POST(req: NextRequest) {
  const formData = await req.json();
  
  // Validate required fields
  if (!formData.business_name || !formData.email) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Save submission
  const submission = await createSubmission(formData);
  
  // If complete, trigger processing
  if (formData.status === 'complete') {
    await processClientIntake(submission.id);
  }
  
  return NextResponse.json(submission);
}

async function processClientIntake(submissionId: number) {
  const submission = await getSubmission(submissionId);
  
  // Recommend services
  const recommendations = await callOpenAI(
    'Analyze this client profile and recommend 2-3 services...',
    submission.data
  );
  
  // Create pipeline record
  await createPipelineClient({
    submission_id: submissionId,
    client_name: submission.business_name,
    status: 'intake_complete',
    investment_capacity: submission.budget_tier,
    recommended_services: recommendations
  });
  
  // Notify Ray
  await notifyRay({
    type: 'new_client',
    client_name: submission.business_name,
    recommended_services: recommendations
  });
}
```

### Phase 3 (Weeks 6-7): Shadow Operator & Automation

Integrate outreach and detection systems.

#### Prospect Queue Management

```typescript
// app/api/shadow-ops/prospects/route.ts

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const stage = req.nextUrl.searchParams.get('stage'); // optional filter
  
  const prospects = await getProspectsForStage(userId, stage);
  
  // Add follow-up messages for prospects at flagged times
  const enriched = prospects.map(p => ({
    ...p,
    followup_message: generateFollowupMessage(p)
  }));
  
  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const { handle, platform, follower_count } = await req.json();
  const userId = req.headers.get('x-user-id');
  
  // Validate prospect
  if (follower_count < 8000 || follower_count > 150000) {
    return NextResponse.json(
      { error: 'Outside target follower range' },
      { status: 400 }
    );
  }
  
  // Check for bot behavior (would integrate with social media API)
  const engagementData = await fetchEngagementData(handle, platform);
  if (isBotLikeBehavior(engagementData)) {
    return NextResponse.json(
      { error: 'Account shows bot indicators' },
      { status: 400 }
    );
  }
  
  // Create prospect record
  const prospect = await createProspect({
    user_id: userId,
    handle,
    platform,
    follower_count,
    engagement_rate: engagementData.rate,
    stage: 'opener_ready'
  });
  
  return NextResponse.json(prospect);
}
```

#### Automation Opportunity Detection

```typescript
// app/api/skills/automation-detector/route.ts

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  
  // Analyze Gmail sent items
  const emails = await getGmailSentItems(userId, { days: 7 });
  const emailPatterns = findRepetitiveEmails(emails);
  
  // Analyze calendar
  const calendar = await getCalendarEvents(userId, { days: 7 });
  const calendarPatterns = findRepetitivePrep(calendar);
  
  // Analyze Shadow Ops usage (log would track this)
  const shadowOpsPatterns = findCopyPastePatterns(userId);
  
  // Compile opportunities
  const opportunities = [
    ...emailPatterns,
    ...calendarPatterns,
    ...shadowOpsPatterns
  ].sort((a, b) => b.timeSaved - a.timeSaved);
  
  // Store top 3
  await storeAutomationOpportunities(userId, opportunities.slice(0, 3));
  
  return NextResponse.json({ opportunities: opportunities.slice(0, 3) });
}
```

---

## PART 2: GUARDRAIL DECISION TREES

Each skill's guardrails need clear decision logic. Here are the critical ones:

### SKILL-001 Guardrail Tree: Email Urgency Detection

```
Is email marked important?
  → YES:
      Does it contain keywords: "urgent", "critical", "help", "issue"?
        → YES: FLAG_URGENT_CLIENT_EMAIL ⚠️
        → NO:
            Is sender a known client?
              → YES: FLAG_CLIENT_EMAIL (elevated priority)
              → NO: Continue to next email
  → NO:
      Skip email (not important)
```

### SKILL-003 Guardrail Tree: Order Exception Detection

```
Is order value > $300?
  → YES: FLAG_HIGH_VALUE_ORDER
      Is there a known customer history with this buyer?
        → YES: Pull history (check for refunds, disputes)
        → NO: Flag for manual verification

Is routing type ambiguous?
  → YES: FLAG_ROUTING_AMBIGUOUS
      Wait for manual categorization (don't ship)
      Notify Ray: "Unknown product [SKU] in order [ID]"
  → NO: Continue

Does order contain 3+ of same item?
  → YES: FLAG_BULK_ORDER
      Is it a product Ray typically sells in bulk?
        → YES: Create reorder alert for inventory
        → NO: Possible bot or reseller (flag for review)
```

### SKILL-005 Guardrail Tree: Client Eligibility

```
Is business_name provided?
  → NO: DO NOT PROCESS (reject as incomplete)

Is investment_capacity < $500?
  → YES: FLAG_TOO_SMALL (not viable for custom dashboard)
      Suggest alternative: "Free consultation + limited tools list"
  → NO: Continue

Is Campaign DNA (section 6) empty?
  → YES: FLAG_INCOMPLETE_DNA
      Action: Add to pre-call checklist

Is email provided?
  → NO: DO NOT PROCESS (can't follow up)
```

### SKILL-008 Guardrail Tree: Prospect Outreach Safety

```
Has Ray reviewed this specific message?
  → NO: STOP — do not send without explicit approval
  → YES: Continue

Is prospect in "do_not_contact" list?
  → YES: STOP — do not send
  → NO: Continue

Has this prospect been contacted >5 times without response?
  → YES: FLAG_OVER_CONTACTED
      Move to nurture list (wait 30 days before next contact)
  → NO: Continue

Is prospect's follower count within 10K–100K range?
  → NO: FLAG_OUT_OF_RANGE
      Confirm before sending
  → YES: Send
```

---

## PART 3: TROUBLESHOOTING & MONITORING

### Common Failures & Solutions

#### Problem: Gmail API Returns 401 Unauthorized

**Cause:** OAuth token expired or was revoked

**Solution:**
```typescript
// In lib/gmail-fetch.ts
try {
  const emails = await gmail.users.messages.list({...});
  return emails;
} catch (error) {
  if (error.status === 401) {
    // Attempt token refresh
    const newToken = await refreshGoogleToken(userId);
    if (newToken) {
      return retryOperation(); // Retry with new token
    } else {
      return { connected: false, error: 'Re-authentication needed' };
    }
  }
  throw error;
}
```

#### Problem: Order Not Found in WooCommerce

**Cause:** Email parsing failed or order ID mismatch

**Solution:**
1. Check email subject pattern matches expected format
2. Log raw email for debugging
3. Add fallback: look up by customer email + amount

#### Problem: AI Synthesis Timeout (GPT-4 taking >30 seconds)

**Cause:** Too much context or API overload

**Solution:**
1. Limit input data (max 50 emails, 10 calendar events)
2. Use streaming response (process result as it arrives)
3. Implement fallback template if synthesis fails

#### Problem: Prospect Stage Not Updating in Shadow Ops

**Cause:** Update request didn't hit the database, or cache is stale

**Solution:**
1. Check API response status
2. Clear dashboard cache (localStorage)
3. Verify prospect ID is correct in URL

### Monitoring Dashboard

Create a simple admin view at `/admin/skill-health`:

```typescript
// Shows:
// - Last execution time for each skill
// - Success rate (last 7 days)
// - Error count and common errors
// - Guardrail triggers (frequency)
// - API call counts (usage)
```

---

## PART 4: CUSTOMIZATION GUIDE

### How to Adjust Thresholds

Every skill has parameters that should reflect Ray's specific situation. Here are the ones most commonly adjusted:

#### SKILL-001: Daily Brief

- **Meeting density threshold:** Default = 6 hours back-to-back. If Ray prefers earlier alert, change to 5 hours.
- **Important email count:** Default = 15 max. If Ray gets lots of important emails, increase to 25.
- **Decision importance:** Define what "decision-required" means for Ray's business (varies by role).

#### SKILL-003: Order Monitor

- **High value threshold:** Default = $300. Adjust based on typical order size.
- **Reorder frequency:** Default = 5+ orders in 7 days. Adjust based on inventory velocity.
- **Routing accuracy threshold:** Default = 90%. Lower if accuracy is still improving.

#### SKILL-008: Outreach Queue

- **Daily outreach target:** Default = 30. Adjust based on Ray's actual capacity.
- **Call booking target:** Default = 1/day. Adjust if Ray wants to batch calls.
- **Close rate threshold:** Default = 20%. Adjust based on Ray's historical data.

### How to Add New Data Sources

If Ray wants to add a new tool (e.g., Notion, HubSpot, Slack):

1. **Create the OAuth route** (or API key handler):
```typescript
// app/api/auth/[tool]/route.ts
// Follow the Gmail pattern
```

2. **Create the fetch function**:
```typescript
// lib/[tool]-fetch.ts
export async function fetch[Tool]Data(userId: string) {
  const token = await getToken(userId, '[tool]');
  const response = await fetch(...);
  return response.data;
}
```

3. **Integrate into relevant skills:**
```typescript
// In SKILL-001: If you add Slack, pull urgent DMs
// In SKILL-005: If you add HubSpot, pull open deals
```

---

## PART 5: SECURITY & COMPLIANCE

### Token Management

**Never** store tokens in localStorage or plain cookies. Always use:
- Encrypted database fields (use `@node-rs/argon2` for hashing)
- httpOnly cookies (set via HTTP response header)
- Secure environment variables in Vercel

### Data Privacy

Skills should never expose:
- Client names or personal info to public-facing surfaces
- Order details in logs or notifications
- Email content (only subject lines and snippets)
- Revenue numbers externally

### Audit Logging

Every skill execution should be logged:

```typescript
await logSkillExecution({
  user_id: userId,
  skill_name: 'SKILL-001',
  triggered_at: new Date(),
  status: 'success' | 'success_with_flags' | 'error',
  output: { /* result JSON */ },
  guardrails_triggered: ['EMAIL_URGENCY_DETECTED', ...],
  execution_time_ms: 1234
});
```

---

## PART 6: TESTING CHECKLIST

Before any skill goes live, verify:

### SKILL-001: Daily Brief

- [ ] Fetches Gmail important + unread correctly
- [ ] Fetches today's calendar events
- [ ] Counts Treasures orders accurately
- [ ] Detects client pipeline items
- [ ] Guardrail: Flags if Gmail not connected
- [ ] Guardrail: Flags if >6 hours back-to-back meetings
- [ ] Brief posted to dashboard within 30 seconds
- [ ] Email notifications sent (if configured)

### SKILL-003: Order Monitor

- [ ] Parses WooCommerce email correctly
- [ ] Determines routing accurately (BIO/IN_HOUSE/MIXED)
- [ ] Logs order to database
- [ ] Guardrail: Flags high-value orders (>$300)
- [ ] Guardrail: Flags ambiguous routing
- [ ] Daily summary generated at 6 PM
- [ ] Orders widget updated in real-time

### SKILL-005: Client Intake Processor

- [ ] Detects new complete submissions
- [ ] Validates all 29 fields
- [ ] Guardrail: Rejects if business_name empty
- [ ] Guardrail: Flags if investment < $500
- [ ] Creates pipeline record
- [ ] Generates recommended services via GPT
- [ ] Creates Shadow Ops client card
- [ ] Notifies Ray of new client

### All Skills

- [ ] Success logged with timestamp
- [ ] Failures logged with error message
- [ ] Guardrails logged (if triggered)
- [ ] Execution time <10 seconds (normal case)
- [ ] Graceful degradation if API fails
- [ ] No sensitive data in logs

---

## PART 7: ROLLOUT TIMELINE

### Week 1: Calm Control Foundational

- Monday: Deploy SKILL-001 (Morning Brief) in test mode
- Wednesday: Review output, adjust guardrails
- Friday: Enable for production (daily execution)

### Week 2: Treasures Data

- Monday: Deploy SKILL-003 (Order Monitor) + WooCommerce email parsing
- Wednesday: Deploy SKILL-004 (Weekly Revenue)
- Friday: Verify accuracy of first week's data

### Week 3: Pipeline Tracking

- Monday: Deploy SKILL-005 (Client Intake Processor)
- Wednesday: Deploy SKILL-006 (Pre-Call Brief)
- Friday: Test with a real client intake (if available)

### Week 4: Shadow Operator

- Monday: Deploy SKILL-008 (Outreach Queue)
- Wednesday: Deploy SKILL-009 (Audit Prep)
- Friday: Run first week of outreach, verify KPI tracking

### Week 5: Optimization

- Deploy SKILL-010 (Automation Detector)
- Deploy SKILL-011 (Tool Health Check)
- Review dashboard with Ray, adjust thresholds

### Week 6: Personal & Reporting

- Deploy SKILL-012 (Energy Monitor)
- Deploy SKILL-013 (Learning Tracker)
- Final dashboard review with Ray

---

## PART 8: INTEGRATION WITH EXISTING SYSTEMS

### Connecting to Make.com / n8n

For automations beyond API routes, use webhooks:

```typescript
// When a skill detects an opportunity
await fetch('https://hook.make.com/...', {
  method: 'POST',
  body: JSON.stringify({
    skill: 'SKILL-010',
    opportunity: 'Automate prospect follow-up',
    prospect: prospectData
  })
});
```

### Connecting to GhostwriterOS

For synthesis work (client briefs, audit prep):

```typescript
const ghostwriterResponse = await fetch('https://api.ghostwriteros.ai/v1/agents/execute', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${GHOSTWRITER_API_KEY}` },
  body: JSON.stringify({
    agent: 'shadow-operator',
    input: prospect,
    template: 'audit-prep'
  })
});
```

---

## CONCLUSION

This implementation guide bridges the spec (SKILL.md) to actual code. The key principles:

**1. Start simple:** Deploy SKILL-001 and SKILL-003 first. Validate the pattern works before expanding.

**2. Guardrails are critical:** Every decision point where the human needs to confirm is a guardrail. Test them thoroughly.

**3. Data drives iteration:** Monitor execution logs. Adjust thresholds based on what you learn about Ray's actual patterns.

**4. Security is non-negotiable:** Never hardcode credentials. Never expose sensitive data in logs. Always assume the dashboard might be seen.

**5. Document customizations:** If Ray adjusts a threshold or adds a rule, document it so the next implementation partner understands why.

The goal: A system that runs quietly, surfaces only what matters, and asks for judgment only when it's needed. That's when founders stop managing tools and start building businesses.

