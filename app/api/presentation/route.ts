import { NextRequest, NextResponse } from "next/server";

export interface SlideData {
  title: string;
  type: "cover" | "section" | "content" | "callout" | "closing";
  headline?: string;
  bullets?: string[];
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { content, categories, clientName } = await request.json() as {
      content: string;
      categories: string[];
      clientName?: string;
    };

    if (!content) return NextResponse.json({ ok: false, error: "Missing content" }, { status: 400 });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: false, error: "OPENROUTER_API_KEY not set" }, { status: 500 });

    const catList = categories.length > 0 ? categories.join(", ") : "General";

    const systemPrompt = `You are an expert presentation designer. Convert content into a structured slide deck.

Focus areas for this deck: ${catList}
Client: ${clientName ?? "Client"}

Create 8–12 slides. Structure them as a professional consulting presentation.

Slide types:
- "cover": Title slide — strong headline, brief subtitle
- "section": Section divider — bold section name, 1-line description
- "content": Main content — title + 3-6 bullet points
- "callout": Key insight or stat — title + 1-2 sentence bold headline statement
- "closing": Final slide — next steps, call to action, or summary

Rules:
- First slide must be "cover" type
- Last slide must be "closing" type
- Mix types — don't use "content" for every slide
- Bullets must be SHORT (under 12 words each)
- Headlines must be punchy and specific (name numbers, outcomes, or insights when possible)
- Every slide must directly reflect the pasted content — no generic filler

Return ONLY a valid JSON array of slides:
[{"title":"...","type":"cover|section|content|callout|closing","headline":"...","bullets":["...","..."],"notes":"..."}]

Fields:
- title: required for all
- type: required for all
- headline: required for cover/callout/closing, optional for others
- bullets: required for content/section, optional for others (can be empty array)
- notes: optional speaker note (1 sentence max)`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://ai-wingman-ultimate-dashboard.vercel.app",
        "X-Title": "AI Wingman",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: content.slice(0, 6000) },
        ],
        temperature: 0.4,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ ok: false, error: err.slice(0, 200) }, { status: 500 });
    }

    const data = await response.json();
    let raw: string = data.choices?.[0]?.message?.content ?? "";

    // Strip think tags and code fences
    raw = raw
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/```(?:json)?\s*/gi, "")
      .trim();

    let slides: SlideData[] | null = null;
    try { slides = JSON.parse(raw); } catch { /* fall through */ }
    if (!slides) {
      const s = raw.indexOf("[");
      const e = raw.lastIndexOf("]");
      if (s !== -1 && e > s) {
        try { slides = JSON.parse(raw.slice(s, e + 1)); } catch { /* fall through */ }
      }
    }
    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json({ ok: false, error: "Could not parse slides", raw: raw.slice(0, 300) }, { status: 500 });
    }

    return NextResponse.json({ ok: true, slides });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
