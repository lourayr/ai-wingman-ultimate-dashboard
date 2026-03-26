"use client";

import { useState, useEffect } from "react";
import { ExternalLink, CheckCircle, Zap, ChevronDown } from "lucide-react";
import Navigation from "./Navigation";

interface Tool {
  slug: string;
  label: string;
  description: string;
  followUps: string[];
}

interface Category {
  category: string;
  color: string;
  tools: Tool[];
}

const GPTS: Category[] = [
  {
    category: "Strategy",
    color: "purple",
    tools: [
      {
        slug: "biz-strategy",
        label: "Business Strategy Agent",
        description: "90-day strategy, positioning, and growth planning",
        followUps: [
          "What is your current pricing model and average client lifetime value?",
          "Who are your top 3 direct competitors and what do they do better than you right now?",
          "What does your current sales process look like from first contact to signed contract?",
          "What is your personal definition of success beyond revenue?",
        ],
      },
      {
        slug: "strategic-partner",
        label: "Private Strategic Partner",
        description: "Your confidential strategic advisor and sounding board",
        followUps: [
          "What is your current AI tool stack?",
          "What decisions are you currently making alone that you wish a strategic partner could help carry?",
          "What is your bandwidth for implementation right now, in honest hours per week?",
          "Do you have existing SOPs, brand guidelines, or prior strategic documents to upload?",
          "What does \"clarity\" feel like for you, and what does \"overwhelm\" look like?",
        ],
      },
    ],
  },
  {
    category: "Automation",
    color: "cyan",
    tools: [
      {
        slug: "workflow-copilot",
        label: "Workflow Engineering Copilot",
        description: "Map and automate your most time-consuming workflows",
        followUps: [
          "What is your current technical skill level with your preferred platform?",
          "Who owns maintenance after deployment, and what is their technical capacity?",
          "What is the cost of this workflow failing once?",
          "Are there any regulatory, contractual, or compliance requirements governing data in this workflow?",
        ],
      },
      {
        slug: "autoflow-architect",
        label: "AutoFlow Architect",
        description: "Design full automation systems and tool stacks",
        followUps: [
          "Are you looking for a quick automation map (under 30 minutes) or a full workflow engineering session?",
          "Do you need a flowchart and checklist output, or a full SOP and build spec?",
          "What is your preferred automation platform: Make, Zapier, or n8n?",
        ],
      },
    ],
  },
  {
    category: "Content",
    color: "green",
    tools: [
      {
        slug: "blog-creation",
        label: "AI-Optimized Blog Creation",
        description: "Long-form SEO content with your brand voice baked in",
        followUps: [
          "Do you have an existing brand voice guide or writing samples to upload?",
          "What is your current domain authority and SEO baseline?",
          "Will this content be gated, ungated, or repurposed across platforms?",
          "Who is your actual SEO competitor (who ranks for your target terms right now)?",
        ],
      },
      {
        slug: "jv-partner-kit",
        label: "JV Partner Kit Agent",
        description: "Build joint venture proposals and partnership materials",
        followUps: [
          "What is the name, URL, and core promise of the offer being promoted?",
          "What is the commission structure for JV partners?",
          "What is the campaign timeline? (launch date, promo window, cart close)",
          "Who is the ideal JV partner? (audience size, niche, relationship to your audience)",
          "What assets do JV partners need? (email swipes, social graphics, tracking links)",
          "What is the conversion mechanism? (webinar, VSL, sales page, application call)",
          "What proof or social validation exists for this offer?",
          "What tone should partner communications use?",
          "Are there any compliance restrictions on how the offer can be promoted?",
        ],
      },
    ],
  },
  {
    category: "Custom GPTs",
    color: "amber",
    tools: [
      {
        slug: "architectgpt",
        label: "ArchitectGPT",
        description: "Design and build custom GPTs for your business",
        followUps: [
          "What proprietary frameworks, methodologies, or IP documents will be uploaded to this GPT's knowledge base?",
          "Who are the users of this GPT: you alone, your clients, or a public audience?",
          "What is the failure mode you most want to prevent?",
          "What does \"done\" look like for a single session with this GPT?",
        ],
      },
      {
        slug: "agent-selection",
        label: "AI Agent Selection Agent",
        description: "Find the right AI agent for any task or workflow",
        followUps: [
          "Have you used any AI agents before? What happened?",
          "What is the single most costly mistake this agent could make?",
          "Who maintains this agent after deployment, and what is their technical level?",
          "What is your tolerance for false positives vs. false negatives?",
        ],
      },
    ],
  },
  {
    category: "Data",
    color: "blue",
    tools: [
      {
        slug: "data-helper",
        label: "Data Helper Planning Agent",
        description: "Plan your data infrastructure and reporting strategy",
        followUps: [
          "What is the primary goal you want data to help you achieve?",
          "Where does your most valuable business data currently live?",
          "How consistently is that data captured?",
          "What decisions are you currently making by gut that you wish data could inform?",
          "Have you ever tried to use your data for AI, analytics, or reporting? What happened?",
          "What data do you collect that you never actually use?",
          "Who on your team owns data collection and hygiene right now?",
          "What is your current comfort level with data tools? (1 = spreadsheets only, 5 = SQL/dashboards)",
          "What would a \"data win\" look like for you in the next 90 days?",
          "Are there any data sources you know you should be capturing but aren't?",
        ],
      },
      {
        slug: "data-collection",
        label: "Data Collection & Cleaning",
        description: "Structure and clean messy data for AI readiness",
        followUps: [
          "What specific AI use case is this data being collected for?",
          "What raw data sources do you have access to right now?",
          "What format is your data currently in? (unstructured text, CSV, JSON, audio, images)",
          "What is the volume of data you're working with?",
          "What labels or categories does your AI model need to recognize?",
          "What does \"clean\" mean for your use case? (deduplication, normalization, PII removal, etc.)",
          "Who will use this cleaned dataset and in what platform?",
        ],
      },
    ],
  },
  {
    category: "Offer",
    color: "pink",
    tools: [
      {
        slug: "offer-stack",
        label: "Offer Stack Agent",
        description: "Build high-converting offer ladders and pricing structures",
        followUps: [
          "What is the price point and delivery format of this offer?",
          "Do you have existing testimonials, case studies, or beta results?",
          "Is this a standalone offer or part of a larger ascension ladder?",
          "What platform will this offer live on? (Kajabi, Teachable, direct sales, etc.)",
          "What is the launch timeline and traffic source?",
        ],
      },
    ],
  },
];

const CAT_COLORS: Record<string, string> = {
  purple: "border-purple-500/30 text-purple-400",
  cyan: "border-cyan-500/30 text-cyan-400",
  green: "border-green-500/30 text-green-400",
  amber: "border-amber-500/30 text-amber-400",
  blue: "border-blue-500/30 text-blue-400",
  pink: "border-pink-500/30 text-pink-400",
};

interface SubmissionData {
  session_id?: string;
  status?: string;
  email?: string;
  business_name?: string;
  website?: string;
  industry_model?: string;
  team_structure?: string;
  revenue_trajectory?: string;
  primary_goal?: string;
  biggest_challenge?: string;
  tech_stack?: string;
  strengths_gaps?: string;
  investment_capacity?: string;
  success_metrics?: string;
  existing_assets?: string;
  untapped_opportunity?: string;
  scaling_bottleneck?: string;
  timeline?: string;
  ai_comfort?: string;
  dream_scenario?: string;
  uvp?: string;
  ideal_client?: string;
  unconventional_approach?: string;
  anything_else?: string;
  brand_bio?: string;
  brand_voice?: string;
  banned_words?: string;
  persuasive_premise?: string;
  testimonials?: string;
  content_keywords?: string;
  offer_keywords?: string;
  // v2 fields
  contact_name?: string;
  business_description?: string;
  core_offer?: string;
  daily_drains?: string;
  instagram_url?: string;
  instagram_desc?: string;
  best_content?: string;
  sales_process?: string;
  lead_magnet?: string;
  offer_tiers?: string;
  competitors?: string;
  hidden_fear?: string;
  content_constraints?: string;
}

function buildFullBrief(d: SubmissionData): string {
  const lines = [
    "Start with this data and guide me to the right next steps, questions, and/or strategy:",
    "",
    `Business Name: ${d.business_name ?? ""}`,
    `Contact: ${d.contact_name ?? ""}`,
    `Email: ${d.email ?? ""}`,
    `Website: ${d.website ?? ""}`,
    `Industry & Business Model: ${d.industry_model ?? ""}`,
    `Team Structure: ${d.team_structure ?? ""}`,
    `Revenue & Growth Trajectory: ${d.revenue_trajectory ?? ""}`,
    `Business Description: ${d.business_description ?? d.brand_bio ?? ""}`,
    `Core Offer: ${d.core_offer ?? ""}`,
    `Primary Goal (90 Days): ${d.primary_goal ?? ""}`,
    `Biggest Challenge: ${d.biggest_challenge ?? ""}`,
    `Daily Time Drains: ${d.daily_drains ?? ""}`,
    `Current Tech Stack: ${d.tech_stack ?? ""}`,
    `Team Strengths & Gaps: ${d.strengths_gaps ?? ""}`,
    `Investment Capacity: ${d.investment_capacity ?? ""}`,
    `Success Metrics: ${d.success_metrics ?? ""}`,
    `Existing Data & Assets: ${d.existing_assets ?? ""}`,
    `Biggest Untapped Opportunity: ${d.untapped_opportunity ?? ""}`,
    `Scaling Bottleneck: ${d.scaling_bottleneck ?? ""}`,
    `Implementation Timeline: ${d.timeline ?? ""}`,
    `AI & Automation Comfort Level: ${d.ai_comfort ?? ""}`,
    `Dream Scenario (3 Years): ${d.dream_scenario ?? ""}`,
    `Unique Value Proposition: ${d.uvp ?? ""}`,
    `Ideal Client Profile: ${d.ideal_client ?? ""}`,
    `Unconventional Approach: ${d.unconventional_approach ?? ""}`,
    `Anything Else: ${d.anything_else ?? ""}`,
  ];

  const hasDna =
    d.brand_bio || d.brand_voice || d.banned_words || d.persuasive_premise ||
    d.testimonials || d.content_keywords || d.offer_keywords;

  if (hasDna) {
    lines.push("", "── CAMPAIGN DNA ──");
    if (d.brand_bio) lines.push(`Brand Bio: ${d.brand_bio}`);
    if (d.brand_voice) lines.push(`Brand Voice: ${d.brand_voice}`);
    if (d.banned_words) lines.push(`Banned Words / Phrases: ${d.banned_words}`);
    if (d.persuasive_premise) lines.push(`Persuasive Premise: ${d.persuasive_premise}`);
    if (d.testimonials) lines.push(`Testimonials: ${d.testimonials}`);
    if (d.content_keywords) lines.push(`Content Keywords: ${d.content_keywords}`);
    if (d.offer_keywords) lines.push(`Offer Keywords: ${d.offer_keywords}`);
  }

  const hasGrowth =
    d.instagram_url || d.instagram_desc || d.best_content ||
    d.sales_process || d.lead_magnet || d.offer_tiers ||
    d.competitors || d.hidden_fear || d.content_constraints;

  if (hasGrowth) {
    lines.push("", "── GROWTH & MONETIZATION ──");
    if (d.instagram_url) lines.push(`Instagram: ${d.instagram_url}`);
    if (d.instagram_desc) lines.push(`Instagram Description: ${d.instagram_desc}`);
    if (d.best_content) lines.push(`Best Performing Content: ${d.best_content}`);
    if (d.sales_process) lines.push(`Sales Process: ${d.sales_process}`);
    if (d.lead_magnet) lines.push(`Lead Magnet: ${d.lead_magnet}`);
    if (d.offer_tiers) lines.push(`Offer Tiers: ${d.offer_tiers}`);
    if (d.competitors) lines.push(`Competitors: ${d.competitors}`);
    if (d.hidden_fear) lines.push(`Hidden Fear / Objection: ${d.hidden_fear}`);
    if (d.content_constraints) lines.push(`Content Constraints: ${d.content_constraints}`);
  }

  return lines.join("\n");
}

export default function GPTLauncher() {
  const [submission, setSubmission] = useState<SubmissionData>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const sessionId =
      typeof window !== "undefined"
        ? localStorage.getItem("wingman-onboarding-session")
        : null;

    if (sessionId) {
      fetch(`/api/onboarding?session=${sessionId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.ok && d.submission) setSubmission(d.submission);
        })
        .catch(() => {});
    }
  }, []);

  const setAnswer = (slug: string, index: number, value: string) => {
    setFollowUpAnswers((prev) => {
      const current = prev[slug] ? [...prev[slug]] : [];
      current[index] = value;
      return { ...prev, [slug]: current };
    });
  };

  const buildPrompt = (slug: string, followUps: string[]): string => {
    const base = submission.business_name
      ? buildFullBrief(submission)
      : "I need help with my business strategy and AI implementation. Let's start with some questions to understand my situation.";

    const answers = followUpAnswers[slug] ?? [];
    const filled = followUps
      .map((q, i) => (answers[i]?.trim() ? `${q}\n${answers[i].trim()}` : null))
      .filter(Boolean);

    if (filled.length === 0) return base;

    return `${base}\n\n── GPT-SPECIFIC CONTEXT ──\n${filled.join("\n\n")}`;
  };

  const launchWithData = (slug: string, followUps: string[]) => {
    const prompt = buildPrompt(slug, followUps);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(slug);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            AI Tool Launcher
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            11 specialized GPTs — your brief is auto-copied before launch. Fill in prep questions below each GPT for a deeper session.
          </p>
        </div>

        {submission.business_name && (
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <Zap className="w-4 h-4 text-green-400 shrink-0" />
            <p className="text-slate-300 text-sm">
              Loaded profile for{" "}
              <span className="text-white font-medium">{submission.business_name}</span>
              {" "}— clicking &quot;Launch with my data&quot; copies your full brief.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {GPTS.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <h2
                className={`text-xs font-bold uppercase tracking-widest border-b pb-1 ${CAT_COLORS[cat.color]}`}
              >
                {cat.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.tools.map((tool) => {
                  const isExpanded = expandedSlug === tool.slug;
                  const answers = followUpAnswers[tool.slug] ?? [];
                  const filledCount = answers.filter((a) => a?.trim()).length;

                  return (
                    <div key={tool.slug} className="glass rounded-xl p-4 space-y-3 flex flex-col">
                      <div>
                        <h3 className="font-semibold text-slate-200">{tool.label}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">{tool.description}</p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`/api/gpt/${tool.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => launchWithData(tool.slug, tool.followUps)}
                          className="flex items-center gap-1.5 flex-1 justify-center bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          {copied === tool.slug ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Brief copied!
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-3.5 h-3.5" />
                              Launch with my data
                            </>
                          )}
                        </a>
                      </div>

                      {/* Follow-up questions toggle */}
                      <button
                        type="button"
                        onClick={() => setExpandedSlug(isExpanded ? null : tool.slug)}
                        className="flex items-center justify-between w-full text-xs text-slate-500 hover:text-slate-300 transition-colors pt-1 border-t border-slate-800"
                      >
                        <span>
                          Complete These Prep Questions Before Clicking GPT:
                          {filledCount > 0 && (
                            <span className="ml-1.5 bg-purple-600/30 text-purple-300 px-1.5 py-0.5 rounded text-xs">
                              {filledCount}/{tool.followUps.length}
                            </span>
                          )}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="space-y-3 pt-1">
                          {tool.followUps.map((q, i) => (
                            <div key={i} className="space-y-1">
                              <label className="text-xs text-slate-400 leading-snug block">
                                {q}
                              </label>
                              <textarea
                                rows={2}
                                value={answers[i] ?? ""}
                                onChange={(e) => setAnswer(tool.slug, i, e.target.value)}
                                placeholder="Your answer..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                              />
                            </div>
                          ))}
                          <p className="text-xs text-slate-600">
                            These answers will be appended to your brief when you click Launch.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
