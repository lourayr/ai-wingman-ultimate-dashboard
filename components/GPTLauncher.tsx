"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Copy, CheckCircle, Zap } from "lucide-react";
import Navigation from "./Navigation";

const GPTS = [
  {
    category: "Strategy",
    color: "purple",
    tools: [
      {
        slug: "biz-strategy",
        label: "Business Strategy Agent",
        description: "90-day strategy, positioning, and growth planning",
      },
      {
        slug: "strategic-partner",
        label: "Private Strategic Partner",
        description: "Your confidential strategic advisor and sounding board",
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
      },
      {
        slug: "autoflow-architect",
        label: "AutoFlow Architect",
        description: "Design full automation systems and tool stacks",
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
      },
      {
        slug: "jv-partner-kit",
        label: "JV Partner Kit Agent",
        description: "Build joint venture proposals and partnership materials",
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
      },
      {
        slug: "agent-selection",
        label: "AI Agent Selection Agent",
        description: "Find the right AI agent for any task or workflow",
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
      },
      {
        slug: "data-collection",
        label: "Data Collection & Cleaning",
        description: "Structure and clean messy data for AI readiness",
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
}

function buildFullBrief(d: SubmissionData): string {
  const lines = [
    "Start with this data and guide me to the right next steps, questions, and/or strategy:",
    "",
    `Business Name: ${d.business_name ?? ""}`,
    `Email: ${d.email ?? ""}`,
    `Website: ${d.website ?? ""}`,
    `Industry & Business Model: ${d.industry_model ?? ""}`,
    `Team Structure: ${d.team_structure ?? ""}`,
    `Revenue & Growth Trajectory: ${d.revenue_trajectory ?? ""}`,
    `Primary Goal (90 Days): ${d.primary_goal ?? ""}`,
    `Biggest Challenge: ${d.biggest_challenge ?? ""}`,
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

  return lines.join("\n");
}

export default function GPTLauncher() {
  const [submission, setSubmission] = useState<SubmissionData>({});
  const [copied, setCopied] = useState<string | null>(null);

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

  const buildPrompt = (): string => {
    if (submission.business_name) return buildFullBrief(submission);
    return "I need help with my business strategy and AI implementation. Let's start with some questions to understand my situation.";
  };

  const intakeData = { businessName: submission.business_name };

  const launchWithData = (slug: string) => {
    const prompt = buildPrompt();
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
            11 specialized GPTs — your brief auto-copied before launch
          </p>
        </div>

        {intakeData.businessName && (
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <Zap className="w-4 h-4 text-green-400 shrink-0" />
            <p className="text-slate-300 text-sm">
              Loaded profile for{" "}
              <span className="text-white font-medium">{intakeData.businessName}</span>
              {" "}— clicking &quot;Launch with my data&quot; auto-copies your brief.
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
                {cat.tools.map((tool) => (
                  <div key={tool.slug} className="glass rounded-xl p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-200">{tool.label}</h3>
                      <p className="text-slate-400 text-sm mt-0.5">{tool.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`/api/gpt/${tool.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => launchWithData(tool.slug)}
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
                      <a
                        href={`/api/gpt/${tool.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 border border-slate-700 text-slate-400 rounded-lg text-sm hover:border-slate-500 hover:text-slate-300 transition-colors"
                        title="Launch without data"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
