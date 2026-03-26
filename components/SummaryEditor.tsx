"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, CheckCircle, Download, ExternalLink } from "lucide-react";
import Navigation from "./Navigation";

interface SubmissionData {
  session_id: string;
  status: string;
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

function formatIntakeData(d: SubmissionData): string {
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

const GPT_TOOLS = [
  { slug: "biz-strategy", label: "Business Strategy Agent", keywords: ["goal", "revenue", "scaling"] },
  { slug: "workflow-copilot", label: "Workflow Copilot", keywords: ["challenge", "tech", "automation"] },
  { slug: "jv-partner-kit", label: "JV Partner Kit", keywords: ["partner", "referral", "network"] },
  { slug: "offer-stack", label: "Offer Stack Agent", keywords: ["uvp", "offer", "price"] },
  { slug: "blog-creation", label: "Blog Creation GPT", keywords: ["content", "keywords", "brand"] },
  { slug: "data-helper", label: "Data Helper Agent", keywords: ["data", "metrics", "analytics"] },
];

function scoreGPT(tool: typeof GPT_TOOLS[0], data: SubmissionData): number {
  const text = JSON.stringify(data).toLowerCase();
  return tool.keywords.filter((k) => text.includes(k)).length;
}

// ── Tool Chaos Score ─────────────────────────────────────────────────────────
// Auto-calculates operational chaos from intake data.
// This is the monetization closer from the demo playbook.

interface ChaosResult {
  score: number;
  label: string;
  color: string;
  drivers: string[];
  topAutomations: { name: string; timeSaved: string; impact: "High" | "Medium" }[];
  weeklyCost: number; // estimated hrs/wk lost to manual work
}

function calculateChaosScore(d: SubmissionData): ChaosResult {
  let score = 0;
  const drivers: string[] = [];

  // Solo operator — everything falls on one person
  const teamText = (d.team_structure ?? "").toLowerCase();
  const isSolo =
    teamText === "1" ||
    teamText.includes("solo") ||
    teamText.includes("just me") ||
    teamText.includes("alone") ||
    teamText.includes("only");
  if (isSolo) {
    score += 22;
    drivers.push("Solo operator — every task requires your attention");
  }

  // No automation tools detected
  const stackText = (d.tech_stack ?? "").toLowerCase();
  const hasAutomation =
    stackText.includes("zapier") ||
    stackText.includes("make") ||
    stackText.includes("n8n") ||
    stackText.includes("automat");
  if (!hasAutomation) {
    score += 15;
    drivers.push("No automation layer in current stack");
  }

  // Multiple disconnected tools
  const toolKeywords = [
    "gmail", "google", "shopify", "woocommerce", "stripe", "notion",
    "slack", "asana", "trello", "hubspot", "mailchimp", "calendly",
    "zoom", "discord", "quickbooks", "keap", "activecampaign",
  ];
  const toolCount = toolKeywords.filter((t) => stackText.includes(t)).length;
  if (toolCount >= 4) {
    score += Math.min(toolCount * 3, 20);
    drivers.push(`${toolCount}+ tools detected — high context-switching cost`);
  }

  // Challenge signals manual work
  const challenge = (d.biggest_challenge ?? "").toLowerCase();
  if (
    challenge.includes("time") ||
    challenge.includes("manual") ||
    challenge.includes("all") ||
    challenge.includes("everything")
  ) {
    score += 15;
    drivers.push("Challenge pattern: time-starved, manual processes dominate");
  }

  // Revenue stage suggests ops volume
  const rev = (d.revenue_trajectory ?? "").toLowerCase();
  if (rev.includes("100k") || rev.includes("200k") || rev.includes("500k")) {
    score += 10;
    drivers.push("Revenue stage implies significant ops volume without dedicated team");
  }

  // Investment signals resource constraint
  const invest = (d.investment_capacity ?? "").toLowerCase();
  if (
    invest.includes("200") ||
    invest.includes("500") ||
    invest.includes("free") ||
    invest.includes("limited")
  ) {
    score += 8;
    drivers.push("Budget constraint — automation ROI is critical");
  }

  score = Math.min(score, 100);
  const label =
    score >= 75 ? "Critical" : score >= 55 ? "High" : score >= 35 ? "Moderate" : "Low";
  const color =
    score >= 75 ? "text-red-400" : score >= 55 ? "text-amber-400" : score >= 35 ? "text-yellow-400" : "text-green-400";

  // Estimated weekly cost: solo @ 40 hrs/wk, chaos % is overhead
  const weeklyCost = Math.round((score / 100) * 0.4 * 40);

  // Top 3 automation recommendations based on data
  const automations: { name: string; timeSaved: string; impact: "High" | "Medium" }[] = [];
  if (isSolo) {
    automations.push({ name: "Inbox triage + priority sorting", timeSaved: "5–8 hrs/wk", impact: "High" });
  }
  const industry = (d.industry_model ?? "").toLowerCase();
  if (industry.includes("ecommerce") || stackText.includes("woocommerce") || stackText.includes("shopify")) {
    automations.push({ name: "Order notification + fulfillment routing", timeSaved: "3–5 hrs/wk", impact: "High" });
  }
  automations.push({ name: "Client follow-up sequences", timeSaved: "4–6 hrs/wk", impact: "High" });
  automations.push({ name: "Invoice + payment reminders", timeSaved: "2–3 hrs/wk", impact: "Medium" });
  automations.push({ name: "Morning intelligence brief", timeSaved: "1–2 hrs/wk", impact: "Medium" });

  return { score, label, color, drivers, topAutomations: automations.slice(0, 3), weeklyCost };
}

export default function SummaryEditor({ sessionId }: { sessionId?: string | null }) {
  const [data, setData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/onboarding?session=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setData(d.submission);
        } else {
          // Fallback: check localStorage backup written by OnboardingWizard
          const backup = localStorage.getItem(`wingman-backup-${sessionId}`);
          if (backup) {
            try {
              const payload = JSON.parse(backup);
              // Build a SubmissionData-shaped object from the payload
              setData({
                session_id: sessionId,
                status: payload.status ?? "complete",
                email: payload.email,
                business_name: payload.businessName,
                website: payload.website,
                industry_model: payload.industryModel,
                team_structure: payload.teamStructure,
                revenue_trajectory: payload.revenueTrajectory,
                primary_goal: payload.primaryGoal,
                biggest_challenge: payload.biggestChallenge,
                tech_stack: payload.techStack,
                investment_capacity: payload.investmentCapacity,
                success_metrics: payload.successMetrics,
                untapped_opportunity: payload.untappedOpportunity,
                ai_comfort: payload.aiComfort,
                dream_scenario: payload.dreamScenario,
                uvp: payload.uvp,
                ideal_client: payload.idealClient,
                unconventional_approach: payload.unconventionalApproach,
                anything_else: payload.anythingElse,
                brand_bio: payload.brandBio,
                brand_voice: payload.brandVoice,
                banned_words: payload.bannedWords,
                persuasive_premise: payload.persuasivePremise,
                testimonials: payload.testimonials,
                content_keywords: payload.contentKeywords,
                offer_keywords: payload.offerKeywords,
                scaling_bottleneck: payload.scalingBottleneck,
              });
            } catch { /* ignore malformed backup */ }
          }
        }
      })
      .catch(() => {
        // Network error — try localStorage backup
        const backup = localStorage.getItem(`wingman-backup-${sessionId}`);
        if (backup) {
          try {
            const payload = JSON.parse(backup);
            setData({ session_id: sessionId, status: "complete", business_name: payload.businessName, email: payload.email });
          } catch { /* ignore */ }
        }
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const autosave = useCallback(
    (updated: SubmissionData) => {
      if (saveTimer) clearTimeout(saveTimer);
      const timer = setTimeout(async () => {
        setSaving(true);
        try {
          await fetch("/api/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: updated.session_id,
              status: updated.status,
              currentStep: 5,
              email: updated.email,
              businessName: updated.business_name,
              website: updated.website,
              industryModel: updated.industry_model,
              teamStructure: updated.team_structure,
              revenueTrajectory: updated.revenue_trajectory,
              primaryGoal: updated.primary_goal,
              biggestChallenge: updated.biggest_challenge,
              techStack: updated.tech_stack,
              strengthsGaps: updated.strengths_gaps,
              investmentCapacity: updated.investment_capacity,
              successMetrics: updated.success_metrics,
              existingAssets: updated.existing_assets,
              untappedOpportunity: updated.untapped_opportunity,
              scalingBottleneck: updated.scaling_bottleneck,
              timeline: updated.timeline,
              aiComfort: updated.ai_comfort,
              dreamScenario: updated.dream_scenario,
              uvp: updated.uvp,
              idealClient: updated.ideal_client,
              unconventionalApproach: updated.unconventional_approach,
              anythingElse: updated.anything_else,
              brandBio: updated.brand_bio,
              brandVoice: updated.brand_voice,
              bannedWords: updated.banned_words,
              persuasivePremise: updated.persuasive_premise,
              testimonials: updated.testimonials,
              contentKeywords: updated.content_keywords,
              offerKeywords: updated.offer_keywords,
            }),
          });
        } finally {
          setSaving(false);
        }
      }, 1500);
      setSaveTimer(timer);
    },
    [saveTimer]
  );

  const handleEdit = (key: keyof SubmissionData, value: string) => {
    if (!data) return;
    const updated = { ...data, [key]: value };
    setData(updated);
    autosave(updated);
  };

  const copyBrief = () => {
    if (!data) return;
    navigator.clipboard.writeText(formatIntakeData(data)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadBrief = () => {
    if (!data) return;
    const text = formatIntakeData(data);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.business_name ?? "client"}-brief.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading brief...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center text-slate-400">
          No session found. <a href="/onboarding" className="text-purple-400 ml-2 hover:underline">Start onboarding</a>
        </div>
      </div>
    );
  }

  const ranked = [...GPT_TOOLS].sort((a, b) => scoreGPT(b, data) - scoreGPT(a, data));
  const topGPTs = ranked.slice(0, 2);

  const FIELDS: { key: keyof SubmissionData; label: string; rows?: number }[] = [
    { key: "business_name", label: "Business Name" },
    { key: "email", label: "Email" },
    { key: "website", label: "Website" },
    { key: "industry_model", label: "Industry & Business Model", rows: 2 },
    { key: "team_structure", label: "Team Structure" },
    { key: "revenue_trajectory", label: "Revenue & Growth" },
    { key: "primary_goal", label: "Primary Goal (90 Days)", rows: 3 },
    { key: "biggest_challenge", label: "Biggest Challenge", rows: 3 },
    { key: "tech_stack", label: "Tech Stack", rows: 2 },
    { key: "strengths_gaps", label: "Strengths & Gaps", rows: 2 },
    { key: "investment_capacity", label: "Investment Capacity" },
    { key: "success_metrics", label: "Success Metrics", rows: 2 },
    { key: "existing_assets", label: "Existing Assets", rows: 2 },
    { key: "untapped_opportunity", label: "Untapped Opportunity", rows: 2 },
    { key: "scaling_bottleneck", label: "Scaling Bottleneck", rows: 2 },
    { key: "timeline", label: "Timeline" },
    { key: "ai_comfort", label: "AI Comfort Level" },
    { key: "dream_scenario", label: "Dream Scenario", rows: 3 },
    { key: "uvp", label: "Unique Value Proposition", rows: 2 },
    { key: "ideal_client", label: "Ideal Client", rows: 2 },
    { key: "unconventional_approach", label: "Unconventional Approach", rows: 2 },
    { key: "anything_else", label: "Anything Else", rows: 2 },
  ];

  const DNA_FIELDS: { key: keyof SubmissionData; label: string; rows?: number }[] = [
    { key: "brand_bio", label: "Brand Bio", rows: 3 },
    { key: "brand_voice", label: "Brand Voice", rows: 2 },
    { key: "banned_words", label: "Banned Words" },
    { key: "persuasive_premise", label: "Persuasive Premise", rows: 2 },
    { key: "testimonials", label: "Testimonials", rows: 3 },
    { key: "content_keywords", label: "Content Keywords" },
    { key: "offer_keywords", label: "Offer Keywords" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {data.business_name ?? "Client Brief"}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {saving ? "Auto-saving..." : "All changes saved"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadBrief}
              className="flex items-center gap-2 px-3 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm hover:border-slate-500 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={copyBrief}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Brief"}
            </button>
          </div>
        </div>

        {/* GPT Recommendations */}
        <div className="glass rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">Recommended GPT Tools</h2>
          <div className="flex gap-2 flex-wrap">
            {topGPTs.map((gpt) => (
              <a
                key={gpt.slug}
                href={`/api/gpt/${gpt.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={copyBrief}
                className="flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {gpt.label}
              </a>
            ))}
          </div>
        </div>

        {/* Tool Chaos Score */}
        {(() => {
          const chaos = calculateChaosScore(data);
          const barWidth = `${chaos.score}%`;
          return (
            <div className="glass rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">Tool Chaos Score</h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Operational inefficiency index — auto-calculated from intake data
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${chaos.color}`}>{chaos.score}</div>
                  <div className={`text-xs font-medium ${chaos.color}`}>{chaos.label}</div>
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    chaos.score >= 75
                      ? "bg-red-500"
                      : chaos.score >= 55
                      ? "bg-amber-500"
                      : chaos.score >= 35
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: barWidth }}
                />
              </div>

              {/* Weekly cost estimate */}
              <div className="bg-slate-800/60 rounded-lg px-4 py-3">
                <p className="text-slate-300 text-sm">
                  Estimated{" "}
                  <span className="text-white font-semibold">{chaos.weeklyCost} hrs/week</span>{" "}
                  lost to manual overhead — at a $75/hr opportunity cost that&apos;s{" "}
                  <span className="text-amber-300 font-semibold">
                    ${(chaos.weeklyCost * 75 * 4).toLocaleString()}/month
                  </span>{" "}
                  you can&apos;t bill for.
                </p>
              </div>

              {/* Chaos drivers */}
              {chaos.drivers.length > 0 && (
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">What&apos;s driving it</p>
                  {chaos.drivers.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span className="text-slate-300">{d}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Top automations */}
              <div className="space-y-1.5">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Top automations to deploy</p>
                {chaos.topAutomations.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
                    <span className="text-purple-400 text-xs font-bold w-5 shrink-0">{i + 1}.</span>
                    <span className="text-slate-200 text-sm flex-1">{a.name}</span>
                    <span className="text-slate-500 text-xs">{a.timeSaved}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded border ${
                        a.impact === "High"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {a.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Editable Fields */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-white">Client Brief</h2>
          {FIELDS.map(({ key, label, rows }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</label>
              {(rows ?? 1) > 1 ? (
                <textarea
                  value={String(data[key] ?? "")}
                  onChange={(e) => handleEdit(key, e.target.value)}
                  rows={rows}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={String(data[key] ?? "")}
                  onChange={(e) => handleEdit(key, e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Campaign DNA */}
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-white">Campaign DNA</h2>
            <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              GhostwriterOS
            </span>
          </div>
          {DNA_FIELDS.map(({ key, label, rows }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</label>
              {(rows ?? 1) > 1 ? (
                <textarea
                  value={String(data[key] ?? "")}
                  onChange={(e) => handleEdit(key, e.target.value)}
                  rows={rows}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={String(data[key] ?? "")}
                  onChange={(e) => handleEdit(key, e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
