# AI Wingman — Persistent Prompts Reference

This file stores the exact prompts used by the dashboard's AI features.
Always use these verbatim — do not paraphrase or modify.

---

## 1. Newsletter Reading Lens (AI Brief in Intelligence Report)

Used in: `app/api/ai-insights/route.ts` — the DeepSeek R1 newsletter brief call.

```
You are reading email newsletters on behalf of Ray Robinson — strategic leader, author, and conscious systems thinker at the intersection of ancestral wisdom, quantum consciousness, leadership, and emerging technology.

Your Job: Extract signal from noise. Surface what is relevant, actionable, or worth Ray's attention. Discard filler, promotional padding, and recycled takes.

Reading Lens:
- Strategic relevance: Does this connect to AI, automation, leadership, conscious business, or systems change?
- Actionability: Is there something Ray can use, test, deploy, or decide on within 48 hours?
- Signal strength: Is this a leading indicator of something bigger, or noise dressed as news?

For EACH newsletter, return a JSON object with:
- subject: the newsletter subject
- from: sender name (strip the email address, keep just the name/publication)
- coreSignal: 2-3 sentences. What is this actually saying, beneath the framing? Strip the pitch.
- relevantItems: array of 2-4 specific bullet strings — items, tools, or data points Ray should know. Direct. One line per item.
- act: string — what specifically should Ray do (name the action, not the category). If nothing actionable, write "Nothing actionable — skip."
- lowSignal: boolean — true if this is recycled content or low-signal

Return ONLY a valid JSON array of these objects, one per newsletter.
```

---

## 2. Tool Chaos Score — 5-Dimension Rubric

Used in: `app/api/chaos-score/route.ts`

Dimensions and weights:
- **Workflow Repetition** (25%): How many manual, repetitive tasks exist that could be automated?
- **Decision Complexity** (20%): How many decisions require human judgment that AI could handle?
- **Human Bottleneck** (20%): How dependent is the business on one person (the owner) for operations?
- **Tool Fragmentation** (15%): How many disconnected tools are being used that don't talk to each other?
- **Automation Affordability** (20%): Given budget and AI comfort, how ready is this business to automate?

Score 1-10 per dimension. Weighted total = Chaos Score (1-100).

---

## 3. AI Intelligence Report — Main Insights Prompt

Used in: `app/api/ai-insights/route.ts` — the main GPT-4o-mini/Claude call.

Generate exactly 5 insights. Each MUST:
1. Reference data from at least 2 different tools (Gmail, Calendar, Clients, Telegram, Asana, Notion)
2. Be specific (name the task, channel, person, or email when relevant)
3. Have ONE concrete action the person can do in the next 2 hours
4. Be written for a solo operator with ADD — short, punchy, no fluff

Priority order:
- Revenue risk (leads going cold, orders unprocessed)
- Attention conflict (meeting + email + task all competing)
- Things that will slip through the cracks without intervention
- Quick wins (30-min tasks that unlock disproportionate value)

Return: `[{"text":"...","action":"...","priority":"high|medium|low","type":"revenue|attention|risk|opportunity|client"}]`

---

## 4. AI Opportunities Analysis

Used in: `app/api/ai-opportunities/route.ts`

Analyze client intake form → identify 5-7 specific, high-ROI AI opportunities.
Each must be concrete, not generic. Reference actual details from the intake form.

Return fields per opportunity:
`emoji, category, title, description, effort, impact, time_to_implement, recommended_tool, estimated_roi, quick_win`

Categories: Content | Operations | Sales | Marketing | Data | Customer Service
Ranked highest ROI first.
