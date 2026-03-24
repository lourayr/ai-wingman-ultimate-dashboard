import { NextRequest, NextResponse } from "next/server";

const GPT_URLS: Record<string, string> = {
  "biz-strategy": "https://chat.openai.com/g/g-businessstrategy",
  "strategic-partner": "https://chat.openai.com/g/g-strategicpartner",
  "workflow-copilot": "https://chat.openai.com/g/g-workflowcopilot",
  "autoflow-architect": "https://chat.openai.com/g/g-autoflowarchitect",
  "blog-creation": "https://chat.openai.com/g/g-blogcreation",
  "jv-partner-kit": "https://chat.openai.com/g/g-jvpartnerkit",
  "architectgpt": "https://chat.openai.com/g/g-architectgpt",
  "agent-selection": "https://chat.openai.com/g/g-agentselection",
  "data-helper": "https://chat.openai.com/g/g-datahelper",
  "data-collection": "https://chat.openai.com/g/g-datacollection",
  "offer-stack": "https://chat.openai.com/g/g-offerstack",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = GPT_URLS[slug];

  if (!url) {
    return NextResponse.json({ error: "GPT not found" }, { status: 404 });
  }

  return NextResponse.redirect(url);
}
