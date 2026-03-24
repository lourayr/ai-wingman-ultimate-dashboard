import { NextRequest, NextResponse } from "next/server";

// Priority: OPENROUTER_API_KEY (gpt-4o-mini) → ANTHROPIC_API_KEY (claude-haiku)
// Accepts full cross-tool payload: Gmail + Calendar + Clients + Slack + Asana + Notion

interface IncomingData {
  gmail?: {
    connected?: boolean;
    importantCount?: number;
    orderCount?: number;
    importantMessages?: Array<{ subject: string; from: string; snippet: string }>;
    geminiSummary?: { subject: string; body: string } | null;
  };
  calendar?: {
    connected?: boolean;
    events?: Array<{ title: string; start: string; end: string }>;
  };
  clients?: Array<{
    business_name?: string | null;
    email?: string | null;
    status?: string;
    investment_capacity?: string | null;
    updated_at?: string;
  }>;
  slack?: {
    connected?: boolean;
    channels?: Array<{
      name: string;
      messages: Array<{ text: string; date: string }>;
      lastActivity?: string;
    }>;
  };
  asana?: {
    connected?: boolean;
    summary?: { open: number; overdue: number; total: number };
    tasks?: Array<{ name: string; completed: boolean; due_on: string | null; projects: Array<{ name: string }> }>;
    projects?: Array<{ name: string; current_status?: { text: string } | null }>;
  };
  notion?: {
    connected?: boolean;
    pages?: Array<{ title: string; status: string | null; lastEdited: string }>;
  };
}

function buildPrompt(data: IncomingData): string {
  const gmail = data.gmail ?? {};
  const cal = data.calendar ?? {};
  const clients = data.clients ?? [];
  const slack = data.slack ?? {};
  const asana = data.asana ?? {};
  const notion = data.notion ?? {};

  const emailList = (gmail.importantMessages ?? [])
    .slice(0, 5)
    .map((m) => `  • ${m.from} — "${m.subject}" — ${m.snippet.slice(0, 100)}`)
    .join("\n");

  const meetingList = (cal.events ?? [])
    .slice(0, 5)
    .map((e) => {
      const t = e.start ? new Date(e.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
      return `  • "${e.title}"${t ? ` at ${t}` : ""}`;
    })
    .join("\n");

  const clientList = clients
    .slice(0, 8)
    .map((c) => `  • ${c.business_name ?? "Unnamed"} [${c.status}] cap:${c.investment_capacity ?? "?"} updated:${c.updated_at ? new Date(c.updated_at).toLocaleDateString() : "?"}`)
    .join("\n");

  const slackSection = slack.connected
    ? `SLACK (${slack.channels?.length ?? 0} channels):\n` +
      (slack.channels ?? [])
        .map((ch) => `  #${ch.name} — last active: ${ch.lastActivity ?? "unknown"}\n` +
          (ch.messages ?? []).slice(0, 2).map((m) => `    → "${m.text.slice(0, 120)}" (${m.date})`).join("\n"))
        .join("\n")
    : "SLACK: not connected";

  const asanaSection = asana.connected
    ? `ASANA: ${asana.summary?.open ?? 0} open tasks, ${asana.summary?.overdue ?? 0} overdue\n` +
      (asana.tasks ?? [])
        .filter((t) => !t.completed)
        .slice(0, 6)
        .map((t) => `  • "${t.name}" — due: ${t.due_on ?? "no date"} — project: ${t.projects?.[0]?.name ?? "none"}`)
        .join("\n")
    : "ASANA: not connected";

  const notionSection = notion.connected
    ? `NOTION (${notion.pages?.length ?? 0} recent pages):\n` +
      (notion.pages ?? [])
        .slice(0, 5)
        .map((p) => `  • "${p.title}"${p.status ? ` [${p.status}]` : ""} — edited ${new Date(p.lastEdited).toLocaleDateString()}`)
        .join("\n")
    : "NOTION: not connected";

  const draftCount = clients.filter((c) => c.status !== "complete").length;
  const completeCount = clients.filter((c) => c.status === "complete").length;

  return `You are an elite AI advisor for a solo entrepreneur running three businesses simultaneously:
1. AI Wingman — B2B AI consulting, goal: $25K/month
2. Golden Age Treasures — WooCommerce e-commerce, $100–200K/year
3. Shadow Operator — creator/influencer deal brokering

You have access to data from MULTIPLE tools at once. Your job is to surface insights that require seeing ALL tools together — things that no single app can show. Focus on revenue, attention risk, and what to do in the next 2 hours.

═══ LIVE DATA SNAPSHOT ═══

GMAIL (${gmail.connected ? "live" : "offline"}):
- Priority emails: ${gmail.importantCount ?? 0}
- E-commerce orders: ${gmail.orderCount ?? 0}
${gmail.geminiSummary ? `- Weekly AI summary excerpt: ${gmail.geminiSummary.body.slice(0, 200)}` : ""}
Key emails:
${emailList || "  (none)"}

GOOGLE CALENDAR (${cal.connected ? "live" : "offline"}):
- Meetings today: ${(cal.events ?? []).length}
${meetingList || "  (none)"}

CLIENT PIPELINE — ${clients.length} total (${completeCount} complete, ${draftCount} draft):
${clientList || "  (none)"}

${slackSection}

${asanaSection}

${notionSection}

═══ YOUR TASK ═══

Generate exactly 5 insights. Each MUST:
1. Reference data from at least 2 different tools above
2. Be specific (name the task, channel, person, or email when relevant)
3. Have ONE concrete action the person can do in the next 2 hours
4. Be written for a solo operator with ADD — short, punchy, no fluff

Prioritize:
- Revenue risk (leads going cold, orders unprocessed)
- Attention conflict (meeting + email + task all competing)
- Things that will slip through the cracks without intervention
- Quick wins (30-min tasks that unlock disproportionate value)

Return ONLY valid JSON — no markdown, no text outside the array:
[{"text":"...","action":"...","priority":"high|medium|low","type":"revenue|attention|risk|opportunity|client"}]`;
}

export async function POST(request: NextRequest) {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!openrouterKey && !anthropicKey) {
    return NextResponse.json({
      ok: false,
      error: "Add OPENROUTER_API_KEY or ANTHROPIC_API_KEY to Vercel environment variables to enable AI insights.",
    });
  }

  const body: IncomingData = await request.json();
  const prompt = buildPrompt(body);

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
          temperature: 0.6,
          max_tokens: 900,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ ok: false, error: `OpenRouter ${res.status}: ${err.slice(0, 200)}` });
      }
      const d = await res.json();
      rawContent = d.choices?.[0]?.message?.content ?? "[]";
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
          max_tokens: 900,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ ok: false, error: `Anthropic ${res.status}: ${err.slice(0, 200)}` });
      }
      const d = await res.json();
      rawContent = d.content?.[0]?.text ?? "[]";
    }

    const match = rawContent.match(/\[[\s\S]*\]/);
    if (!match) {
      return NextResponse.json({ ok: false, error: "Non-JSON AI response", raw: rawContent.slice(0, 300) });
    }
    const insights = JSON.parse(match[0]);
    return NextResponse.json({ ok: true, insights, toolsUsed: {
      gmail: !!(body.gmail?.connected),
      calendar: !!(body.calendar?.connected),
      slack: !!(body.slack?.connected),
      asana: !!(body.asana?.connected),
      notion: !!(body.notion?.connected),
    }});
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) });
  }
}
