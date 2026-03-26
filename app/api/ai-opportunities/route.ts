import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { client } = await request.json();
    if (!client) return NextResponse.json({ ok: false, error: "Missing client data" }, { status: 400 });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: false, error: "OPENROUTER_API_KEY not set" }, { status: 500 });

    const intake = `
Business: ${client.business_name ?? ""}
Description: ${client.business_description ?? client.brand_bio ?? ""}
Industry: ${client.industry_model ?? ""}
Revenue: ${client.revenue_trajectory ?? ""}
Team: ${client.team_structure ?? ""}
Core Offer: ${client.core_offer ?? ""}
Primary Goal (90 days): ${client.primary_goal ?? ""}
Biggest Challenge: ${client.biggest_challenge ?? ""}
Daily Time Drains: ${client.daily_drains ?? ""}
Tool Stack: ${client.tech_stack ?? ""}
Budget for AI/Automation: ${client.investment_capacity ?? ""}
AI Comfort: ${client.ai_comfort ?? ""}
Ideal Client: ${client.ideal_client ?? ""}
Untapped Opportunity: ${client.untapped_opportunity ?? ""}
Scaling Bottleneck: ${client.scaling_bottleneck ?? ""}
Sales Process: ${client.sales_process ?? ""}
Lead Magnet: ${client.lead_magnet ?? ""}
Offer Tiers: ${client.offer_tiers ?? ""}
Instagram: ${client.instagram_url ?? ""} — ${client.instagram_desc ?? ""}
Best Performing Content: ${client.best_content ?? ""}
Competitors: ${client.competitors ?? ""}
Hidden Fear: ${client.hidden_fear ?? ""}
`.trim();

    const systemPrompt = `You are an elite AI implementation strategist. Analyze this business intake form and identify 5-7 specific, high-ROI AI opportunities tailored to this exact business.

Each opportunity must be concrete, not generic. Reference actual details from the intake form (their tools, their daily drains, their industry, their offer).

For each opportunity return:
- emoji: a single relevant emoji
- category: one of Content | Operations | Sales | Marketing | Data | Customer Service
- title: 6-10 word title (specific to their business)
- description: 2-3 sentences. Be specific. Name their actual tools or workflows when relevant.
- effort: Low | Medium | High
- impact: Low | Medium | High
- time_to_implement: "1-2 weeks" | "1 month" | "2-3 months"
- recommended_tool: specific AI tool, platform, or workflow (e.g., "Make + GPT-4o", "n8n + Notion AI", "Zapier + Claude")
- estimated_roi: one concrete line with numbers if possible (e.g., "Saves 6 hrs/wk = ~$1,800/month at $75/hr")
- quick_win: boolean — true if this can be implemented in under 2 weeks with low effort

Rank them highest ROI first. Return ONLY valid JSON — an array of objects with those exact keys.`;

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
          { role: "user", content: intake },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content ?? "";

    // Strip think tags and code fences
    raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/```(?:json)?\s*/gi, "").trim();

    let opportunities: unknown[] | null = null;
    try { opportunities = JSON.parse(raw); } catch { /* fall through */ }
    if (!opportunities) {
      const start = raw.indexOf("[");
      const end = raw.lastIndexOf("]");
      if (start !== -1 && end > start) {
        try { opportunities = JSON.parse(raw.slice(start, end + 1)); } catch { /* fall through */ }
      }
    }
    if (!opportunities) {
      return NextResponse.json({ ok: false, error: "Could not parse AI response", raw: raw.slice(0, 500) }, { status: 500 });
    }

    return NextResponse.json({ ok: true, opportunities });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
