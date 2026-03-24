import { NextRequest, NextResponse } from "next/server";

// AI-powered Decision Queue using OpenRouter.
// Primary:  x-ai/grok-3-beta  (real-time data + DeepSearch reasoning)
// Fallback: deepseek/deepseek-r1 (strong open-source reasoning)
//
// Generates 3–5 strategic decisions the operator should address TODAY
// based on live data snapshot passed in the request body.

interface DecisionContext {
  clients?: Array<{ business_name?: string | null; status?: string; investment_capacity?: string | null }>;
  gmailImportantCount?: number;
  gmailOrderCount?: number;
  calendarEventCount?: number;
  asanaOverdue?: number;
  asanaOpen?: number;
}

function buildDecisionPrompt(ctx: DecisionContext): string {
  const draftClients = (ctx.clients ?? []).filter((c) => c.status !== "complete").length;
  const totalClients = (ctx.clients ?? []).length;

  return `You are a strategic AI advisor for a solo entrepreneur running 3 businesses:
1. AI Wingman — B2B AI consulting, goal: $25K/month
2. Golden Age Treasures — WooCommerce e-commerce, $100–200K/year
3. Shadow Operator — creator/influencer deal brokering

Today's live snapshot:
- Priority emails: ${ctx.gmailImportantCount ?? 0}
- E-commerce orders waiting: ${ctx.gmailOrderCount ?? 0}
- Meetings today: ${ctx.calendarEventCount ?? 0}
- Client pipeline: ${totalClients} total, ${draftClients} in draft
- Asana open tasks: ${ctx.asanaOpen ?? 0} (${ctx.asanaOverdue ?? 0} overdue)

Generate exactly 4 decision-quality questions this operator should answer TODAY.
Each question must:
- Be strategic, not tactical (not "should I check email" — yes to "should I hire a VA this quarter")
- Be answerable within 15 minutes of reflection
- Be directly relevant to growing revenue or reducing operational risk NOW
- Name the specific business (AI Wingman, Treasures, or Shadow Operator) where relevant

Return ONLY a JSON array of strings — no markdown, no wrapper text:
["Decision question 1?", "Decision question 2?", "Decision question 3?", "Decision question 4?"]`;
}

export async function POST(request: NextRequest) {
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  if (!openrouterKey) {
    // Return static defaults if no API key — still useful
    return NextResponse.json({
      ok: true,
      decisions: [
        "Should I run paid ads for Shadow Operator this week?",
        "Do I need a VA for Treasures fulfillment this month?",
        "Which GPT gets client-facing access first: Strategy or Ghostwriter?",
        "Am I on track for AI Wingman's $25K/month goal — what's missing?",
      ],
      model: "static",
    });
  }

  const ctx: DecisionContext = await request.json().catch(() => ({}));
  const prompt = buildDecisionPrompt(ctx);

  const MODELS = [
    "x-ai/grok-3-beta",
    "deepseek/deepseek-r1:free",
    "openai/gpt-4o-mini",
  ];

  for (const model of MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://ai-wingman-ultimate-dashboard.vercel.app",
          "X-Title": "AI Wingman Dashboard",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 400,
        }),
      });

      if (!res.ok) continue;

      const d = await res.json();
      const raw = d.choices?.[0]?.message?.content ?? "";
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) continue;

      const decisions: string[] = JSON.parse(match[0]);
      if (!Array.isArray(decisions) || decisions.length === 0) continue;

      return NextResponse.json({ ok: true, decisions, model });
    } catch {
      continue;
    }
  }

  return NextResponse.json({
    ok: false,
    error: "All models failed — check OPENROUTER_API_KEY",
    decisions: [],
  });
}
