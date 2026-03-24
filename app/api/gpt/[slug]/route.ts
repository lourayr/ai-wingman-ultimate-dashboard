import { NextRequest, NextResponse } from "next/server";

const GPT_URLS: Record<string, string> = {
  "biz-strategy": "https://chatgpt.com/g/g-691b5139db30819193d08a7f402f051a-biz-strategy-agent-a-strategic-thinking-partner",
  "architectgpt": "https://chatgpt.com/g/g-68a44c725e2881918ff507089b68c451-architectgpt-the-custom-gpt-builder",
  "workflow-copilot": "https://chatgpt.com/g/g-6914b2e145408191b055f11c421d5cbd-workflow-engineering-copilot-entrepreneurs",
  "strategic-partner": "https://chatgpt.com/g/g-69424ddea8fc8191903031f7f8333955-private-strategic-partner-gpt",
  "offer-stack": "https://chatgpt.com/g/g-682cc2f58ccc8191aab11a3b061e81e5-offer-stack-agent-copilot-industry-rockstar",
  "agent-selection": "https://chatgpt.com/g/g-689c908a84988191a0dcdcd36024ce48-ai-agent-selection-agent",
  "data-helper": "https://chatgpt.com/g/g-689a2b6a0e8c8191b0d93792d2747385-data-helper-planning-assessment-agent",
  "data-collection": "https://chatgpt.com/g/g-689a20b33eb88191b1444fbe47690e09-data-collection-cleaning-agent",
  "autoflow-architect": "https://chatgpt.com/g/g-68a5d67040c48191850698d204ca2727-autoflow-architect-ai-workflow-generator",
  "blog-creation": "https://chatgpt.com/g/g-69248db573d881918a3300d74f2914b3-ai-optimized-blog-creation-gpt-articles-on-demand",
  "jv-partner-kit": "https://chatgpt.com/g/g-68ef43b0a8fc8191983895382cbbc7dd-jv-partner-kit-agent-the-complete-promo-builder",
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
