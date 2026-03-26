import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { client } = await request.json();

    if (!client) {
      return NextResponse.json({ ok: false, error: "Missing client data" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "OPENROUTER_API_KEY not set" }, { status: 500 });
    }

    const intakeData = `
INTAKE FORM RESPONSES:
Business Name: ${client.business_name ?? ""}
Business Description: ${client.business_description ?? client.brand_bio ?? ""}
Industry & Business Model: ${client.industry_model ?? ""}
Annual Revenue: ${client.revenue_trajectory ?? ""}
Team Size: ${client.team_structure ?? ""}
Primary 90-Day Goal: ${client.primary_goal ?? ""}
Biggest Challenge: ${client.biggest_challenge ?? ""}
Daily Time Drains (Q9 - top workflows): ${client.daily_drains ?? ""}
Current Tool Stack (Q10): ${client.tech_stack ?? ""}
Monthly Budget for AI/Automation (Q11): ${client.investment_capacity ?? ""}
AI & Automation Comfort Level (Q12): ${client.ai_comfort ?? ""}
Success Metrics: ${client.success_metrics ?? ""}
Dream Scenario: ${client.dream_scenario ?? ""}
Untapped Opportunity: ${client.untapped_opportunity ?? ""}
Scaling Bottleneck: ${client.scaling_bottleneck ?? ""}
Core Offer: ${client.core_offer ?? ""}
Ideal Client: ${client.ideal_client ?? ""}
Sales Process: ${client.sales_process ?? ""}
Lead Magnet: ${client.lead_magnet ?? ""}
Offer Tiers: ${client.offer_tiers ?? ""}
`.trim();

    const systemPrompt = `You are calculating a Tool Chaos Score for a small business owner who has just completed the AI Wingman intake form. This score measures operational inefficiency and automation opportunity.

Read all intake responses carefully. Then evaluate the business across five weighted dimensions. For each dimension, assign a score from 0 to 100, where 0 means no problem and 100 means maximum chaos or opportunity.

DIMENSION 1: Workflow Repetition (Weight: 25%)
Look at Q9, Q10, and the 90-day goal. Assess how often the same tasks recur weekly.
- 80-100: Multiple high-frequency tasks repeat daily or multiple times per week
- 50-79: Several tasks repeat weekly but not daily
- 20-49: Some repetition but workflows vary significantly
- 0-19: Mostly custom or variable work with little repetition

DIMENSION 2: Decision Complexity (Weight: 20%)
Look at Q5, Q8, Q9, and Q17 (persuasive premise). Assess how much judgment each task requires.
- 80-100: Most tasks are rule-based, predictable, and require little human judgment
- 50-79: Mix of rule-based and judgment-heavy tasks
- 20-49: Most tasks require significant human judgment or context
- 0-19: Highly bespoke work where automation would reduce quality

DIMENSION 3: Human Bottleneck Intensity (Weight: 20%)
Look at team size, Q5, and Q9. Assess whether everything waits on one person.
- 80-100: Solo operator; all tasks require owner attention; nothing moves without them
- 50-79: Small team but owner is still primary bottleneck on most workflows
- 20-49: Team handles some workflows independently
- 0-19: Distributed team with clear delegation and handoffs

DIMENSION 4: Tool Fragmentation (Weight: 15%)
Look at Q10 (tool list) and Q5. Count tools and assess integration gaps.
- 80-100: 8+ tools with no integration; data copied manually between systems
- 50-79: 5-7 tools with partial integration; some manual handoffs
- 20-49: 3-4 tools with reasonable integration
- 0-19: Minimal, well-integrated stack

DIMENSION 5: Automation Affordability (Weight: 20%)
Look at Q11 (budget), Q12 (comfort level), and Q9 (top workflows). Assess whether the pain can be solved profitably.
- 80-100: High-frequency, rule-based workflows with budget to implement; strong ROI potential
- 50-79: Good automation candidates but budget or complexity creates some friction
- 20-49: Automation possible but ROI is marginal or implementation is complex
- 0-19: Low automation potential given constraints

CALCULATION:
Composite Score = (D1 × 0.25) + (D2 × 0.20) + (D3 × 0.20) + (D4 × 0.15) + (D5 × 0.20)

SCORE INTERPRETATION:
- 0-25: Low chaos. Minor optimizations available.
- 26-45: Moderate chaos. Clear automation opportunities. Prioritize top 2-3 workflows.
- 46-65: High chaos. Significant time and revenue leaking. Immediate action recommended.
- 66-80: Severe chaos. Business growth is constrained by operational drag. Urgent intervention needed.
- 81-100: Critical chaos. Owner is the bottleneck on everything. Automation is not optional.

Respond ONLY with valid JSON matching exactly this structure:
{
  "score": <integer 0-100>,
  "label": "<Low|Moderate|High|Severe|Critical>",
  "summary": "<one sentence explaining what the score means for this specific business>",
  "weeklyHoursLost": <integer>,
  "monthlyRevenueImpact": <integer dollar amount, using hourly rate from context or default $75/hr>,
  "drivers": [<3-5 bullet strings drawn directly from the intake responses>],
  "topAutomations": [
    {"name": "<workflow name>", "hoursSaved": <integer>, "priority": "<High|Medium|Low>"},
    {"name": "<workflow name>", "hoursSaved": <integer>, "priority": "<High|Medium|Low>"},
    {"name": "<workflow name>", "hoursSaved": <integer>, "priority": "<High|Medium|Low>"}
  ],
  "recommendedEntry": "<single best AI Wingman offer for this client to start with, with one sentence explaining why>"
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://ai-wingman-ultimate-dashboard.vercel.app",
        "X-Title": "AI Wingman",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: intakeData },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    // Extract JSON from the response (DeepSeek R1 sometimes wraps in <think> tags)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ ok: false, error: "Could not parse AI response", raw }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
