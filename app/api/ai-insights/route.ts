import { NextRequest, NextResponse } from "next/server";

// Priority order: OPENROUTER_API_KEY → ANTHROPIC_API_KEY
// Model defaults: openai/gpt-4o-mini via OpenRouter (fast, cheap, strong enough)
// Fallback: claude-haiku-4-5 via Anthropic direct

interface IncomingData {
  gmail: {
    connected: boolean;
    importantCount?: number;
    orderCount?: number;
    importantMessages?: Array<{ subject: string; from: string; snippet: string }>;
    geminiSummary?: { subject: string; body: string } | null;
  };
  calendar: {
    connected: boolean;
    events: Array<{ title: string; start: string; end: string }>;
  };
  clients: Array<{
    business_name: string | null;
    email: string | null;
    status: string;
    investment_capacity: string | null;
    updated_at: string;
  }>;
}

export async function POST(request: NextRequest) {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!openrouterKey && !anthropicKey) {
    return NextResponse.json({
      ok: false,
      error: "No AI API key configured. Add OPENROUTER_API_KEY or ANTHROPIC_API_KEY to Vercel env vars.",
    });
  }

  const body: IncomingData = await request.json();
  const { gmail, calendar, clients } = body;

  const emailList = (gmail.importantMessages ?? [])
    .slice(0, 6)
    .map(
      (m) =>
        `  - From: ${m.from}\n    Subject: ${m.subject}\n    Preview: ${m.snippet.slice(0, 120)}`
    )
    .join("\n");

  const meetingList = calendar.events
    .slice(0, 6)
    .map((e) => {
      const t = e.start ? new Date(e.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
      return `  - "${e.title}"${t ? ` at ${t}` : ""}`;
    })
    .join("\n");

  const clientList = clients
    .slice(0, 8)
    .map(
      (c) =>
        `  - ${c.business_name ?? "Unnamed"} [${c.status}] inv:${c.investment_capacity ?? "?"} last:${new Date(c.updated_at).toLocaleDateString()}`
    )
    .join("\n");

  const draftCount = clients.filter((c) => c.status !== "complete").length;
  const completeCount = clients.filter((c) => c.status === "complete").length;

  const prompt = `You are an elite AI business advisor for a solo operator who runs three ventures simultaneously:
1. AI Wingman — B2B AI consulting, building toward $25K/month
2. Golden Age Treasures — e-commerce (WooCommerce), currently $100–200K/year
3. Shadow Operator — creator/influencer outreach and deal brokering

Analyze this real-time multi-tool data snapshot. Provide exactly 4 insights. Each insight MUST draw on at least two data sources (e.g., calendar + email, clients + email, orders + calendar load). Never state something visible in a single tool alone.

TODAY'S DATA:

GMAIL (${gmail.connected ? "live" : "offline"}):
- Priority unread: ${gmail.importantCount ?? 0}
- E-commerce orders in inbox: ${gmail.orderCount ?? 0}
${gmail.geminiSummary ? `- Weekly AI summary: ${gmail.geminiSummary.body.slice(0, 200)}` : ""}
Key emails:
${emailList || "  (none)"}

CALENDAR (${calendar.connected ? "live" : "offline"}):
- Meetings today: ${calendar.events.length}
${meetingList || "  (none)"}

CLIENT PIPELINE — ${clients.length} total (${completeCount} complete, ${draftCount} draft):
${clientList || "  (none)"}

Rules:
- Prioritize revenue risk and opportunity
- Be specific: name the client, the email subject, the time of meeting when relevant
- Give ONE concrete action per insight, not a list
- Use plain English, no buzzwords

Return ONLY a JSON array — no markdown fences, no explanation outside the JSON:
[{"text":"...","action":"...","priority":"high|medium|low","type":"revenue|attention|risk|opportunity|client"}]`;

  try {
    let rawContent = "";

    if (openrouterKey) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://ai-wingman-ultimate-dashboard.vercel.app",
          "X-Title": "AI Wingman Dashboard",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.65,
          max_tokens: 700,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ ok: false, error: `OpenRouter error ${res.status}: ${err.slice(0, 200)}` });
      }
      const data = await res.json();
      rawContent = data.choices?.[0]?.message?.content ?? "[]";
    } else {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey!,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 700,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ ok: false, error: `Anthropic error ${res.status}: ${err.slice(0, 200)}` });
      }
      const data = await res.json();
      rawContent = data.content?.[0]?.text ?? "[]";
    }

    // Extract JSON array from response
    const match = rawContent.match(/\[[\s\S]*\]/);
    if (!match) {
      return NextResponse.json({ ok: false, error: "AI returned non-JSON response", raw: rawContent.slice(0, 300) });
    }
    const insights = JSON.parse(match[0]);
    return NextResponse.json({ ok: true, insights });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) });
  }
}
