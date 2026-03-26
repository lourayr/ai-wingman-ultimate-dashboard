"use client";

import { useState, useEffect } from "react";
import { Target, Copy, CheckCircle, ExternalLink, AlertCircle, ChevronDown, ChevronUp, Zap, Loader2 } from "lucide-react";
import Navigation from "./Navigation";

// Gamma Strategy Discord channel — OpenClaw monitors this
const GAMMA_DISCORD_CHANNEL = "1483998065638506536";

interface ClientData {
  session_id: string;
  business_name: string | null;
  email: string | null;
  website?: string | null;
  status: string;
  industry_model: string | null;
  ai_comfort: string | null;
  team_structure?: string | null;
  strengths_gaps?: string | null;
  investment_capacity: string | null;
  updated_at: string;
  primary_goal?: string | null;
  biggest_challenge?: string | null;
  tech_stack?: string | null;
  success_metrics?: string | null;
  existing_assets?: string | null;
  untapped_opportunity?: string | null;
  scaling_bottleneck?: string | null;
  timeline?: string | null;
  dream_scenario?: string | null;
  uvp?: string | null;
  ideal_client?: string | null;
  unconventional_approach?: string | null;
  anything_else?: string | null;
  revenue_trajectory?: string | null;
  brand_bio?: string | null;
  brand_voice?: string | null;
  banned_words?: string | null;
  persuasive_premise?: string | null;
  testimonials?: string | null;
  content_keywords?: string | null;
  offer_keywords?: string | null;
  // v2 fields
  contact_name?: string | null;
  business_description?: string | null;
  core_offer?: string | null;
  daily_drains?: string | null;
  instagram_url?: string | null;
  instagram_desc?: string | null;
  best_content?: string | null;
  sales_process?: string | null;
  lead_magnet?: string | null;
  offer_tiers?: string | null;
  competitors?: string | null;
  hidden_fear?: string | null;
  content_constraints?: string | null;
}

interface ChaosResult {
  score: number;
  label: string;
  summary: string;
  weeklyHoursLost: number;
  monthlyRevenueImpact: number;
  drivers: string[];
  topAutomations: { name: string; hoursSaved: number; priority: string }[];
  recommendedEntry: string;
}

interface OpportunityResult {
  emoji: string;
  category: string;
  title: string;
  description: string;
  effort: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  time_to_implement: string;
  recommended_tool: string;
  estimated_roi: string;
  quick_win: boolean;
}

type SectionTab = "plan90" | "brief14" | "monetize" | "chaos" | "opportunities" | "gpts" | "form" | "dna" | "ghostwriter" | "synthesise";

function chaosColor(score: number) {
  if (score >= 81) return "text-red-400";
  if (score >= 66) return "text-orange-400";
  if (score >= 46) return "text-amber-400";
  if (score >= 26) return "text-yellow-400";
  return "text-green-400";
}

function chaosBarColor(score: number) {
  if (score >= 81) return "bg-red-500";
  if (score >= 66) return "bg-orange-500";
  if (score >= 46) return "bg-amber-500";
  if (score >= 26) return "bg-yellow-500";
  return "bg-green-500";
}

function buildFullProfileBlock(c: ClientData): string {
  return `Start with this data and guide me to the right next steps, questions, and/or strategy:

── BUSINESS ──
Business Name: ${c.business_name ?? ""}
Email: ${c.email ?? ""}
Industry & Business Model: ${c.industry_model ?? ""}
Revenue & Growth: ${c.revenue_trajectory ?? ""}

── GOALS & CHALLENGES ──
Primary Goal (90 Days): ${c.primary_goal ?? ""}
Biggest Challenge: ${c.biggest_challenge ?? ""}

── IDENTITY ──
Unique Value Proposition: ${c.uvp ?? ""}
AI Comfort Level: ${c.ai_comfort ?? ""}
Investment Capacity: ${c.investment_capacity ?? ""}

── CAMPAIGN DNA ──
Brand Bio: ${c.brand_bio ?? ""}
Brand Voice: ${c.brand_voice ?? ""}
Banned Words: ${c.banned_words ?? ""}
Persuasive Premise: ${c.persuasive_premise ?? ""}
Testimonials: ${c.testimonials ?? ""}
Content Keywords: ${c.content_keywords ?? ""}
Offer Keywords: ${c.offer_keywords ?? ""}`;
}

function build90DayPlan(c: ClientData): string {
  const name = c.business_name ?? "this business";
  return `90-Day Acceleration Plan for ${name}

PHASE 1 — FOUNDATION (Days 1–30)
- Map all manual processes consuming 40%+ of bandwidth
- Identify top 3 automations for immediate ROI
- Set up AI-powered client intake system
- Define KPIs and reporting cadence

PHASE 2 — ACCELERATION (Days 31–60)
- Deploy first 2 automations live
- Launch Shadow Operator outreach sequence
- Build CEO Command dashboard with live data
- Onboard first 3 clients to new system

PHASE 3 — SCALE (Days 61–90)
- Optimize automations based on real data
- Build repeatable client delivery playbook
- Document all SOPs for delegation
- Hit revenue target: ${c.investment_capacity ?? "$5,000–$10,000"}`;
}

function build14DayBrief(c: ClientData): string {
  const name = c.business_name ?? "Client";
  return `14-Day Quick Win Brief — ${name}

WEEK 1: DIAGNOSE & DEPLOY
Day 1: CEO Intake call (90 min) — map pain points
Day 2: Tech stack audit — identify integration opportunities
Day 3–5: Build first automation (highest ROI)
Day 6–7: Deploy + test + document

WEEK 2: MOMENTUM
Day 8: Review automation results + tweak
Day 9–10: Build second quick win
Day 11–12: CEO Command dashboard setup
Day 13: Client training + handoff doc
Day 14: Results review + next sprint planning

EXPECTED OUTCOME: ${c.biggest_challenge ?? "Core bottleneck"} resolved.
Time saved: 8–12 hrs/week minimum.`;
}

function buildMonetizationMap(c: ClientData): string {
  return `Monetization Map — ${c.business_name ?? "Client"}

REVENUE STREAM 1: CORE OFFER OPTIMIZATION
Current: ${c.revenue_trajectory ?? "Undefined trajectory"}
Opportunity: Automate delivery → reduce cost per client → increase margin
Timeline: 30 days
Estimated uplift: 20–35% margin improvement

REVENUE STREAM 2: NEW OFFER LAYER
Based on: ${c.uvp ?? "Your unique positioning"}
Opportunity: Productize the system → sell access
Price point: $2,500–$5,000/month retainer
Timeline: 60 days

REVENUE STREAM 3: REFERRAL LOOP
Build: Automated client success reporting
Surface wins visibly → clients refer others
Timeline: 90 days`;
}

export default function ShadowOpsDashboard({ standalone = true, initialClientId }: { standalone?: boolean; initialClientId?: string | null }) {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(initialClientId ?? null);
  const [activeSection, setActiveSection] = useState<Record<string, SectionTab>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [gammaJobs, setGammaJobs] = useState<Record<string, { status: "idle" | "sending" | "queued" | "error"; jobId?: string; error?: string }>>({});
  const [chaosResults, setChaosResults] = useState<Record<string, ChaosResult | "loading" | "error">>({});
  const [oppResults, setOppResults] = useState<Record<string, OpportunityResult[] | "loading" | "error">>({});

  const targetClientId = initialClientId ?? null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/onboarding/list")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setClients(d.submissions);
          // Auto-expand and scroll to the target client once data loads
          if (targetClientId) {
            setExpandedId(targetClientId);
            // Scroll after a short delay so the card has rendered
            setTimeout(() => {
              const el = document.getElementById(`client-${targetClientId}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 150);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const generateGamma = async (c: ClientData) => {
    const id = c.session_id;
    setGammaJobs((prev) => ({ ...prev, [id]: { status: "sending" } }));
    const brief = buildFullProfileBlock(c);
    const message = `🚀 **GAMMA STRATEGY REQUEST**\n**Client:** ${c.business_name ?? "Unknown"}\n**Email:** ${c.email ?? "—"}\n\n${brief.slice(0, 1600)}\n\n*OpenClaw: paste above brief into BizStrategy GPT → get response → create Gamma deck → post URL back to dashboard*`;

    try {
      const res = await fetch("/api/discord/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: GAMMA_DISCORD_CHANNEL, content: message }),
      });
      const data = await res.json();
      if (data.ok) {
        setGammaJobs((prev) => ({ ...prev, [id]: { status: "queued" } }));
      } else {
        setGammaJobs((prev) => ({ ...prev, [id]: { status: "error", error: data.error ?? "Discord send failed" } }));
      }
    } catch (err) {
      setGammaJobs((prev) => ({ ...prev, [id]: { status: "error", error: String(err) } }));
    }
  };

  const fetchChaosScore = async (c: ClientData) => {
    const id = c.session_id;
    if (chaosResults[id]) return; // already loaded or loading
    setChaosResults((prev) => ({ ...prev, [id]: "loading" }));
    try {
      const res = await fetch("/api/chaos-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: c }),
      });
      const data = await res.json();
      if (data.ok) {
        setChaosResults((prev) => ({ ...prev, [id]: data as ChaosResult }));
      } else {
        setChaosResults((prev) => ({ ...prev, [id]: "error" }));
      }
    } catch {
      setChaosResults((prev) => ({ ...prev, [id]: "error" }));
    }
  };

  const fetchOpportunities = async (c: ClientData) => {
    const id = c.session_id;
    if (oppResults[id]) return;
    setOppResults((prev) => ({ ...prev, [id]: "loading" }));
    try {
      const res = await fetch("/api/ai-opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: c }),
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.opportunities)) {
        setOppResults((prev) => ({ ...prev, [id]: data.opportunities as OpportunityResult[] }));
      } else {
        setOppResults((prev) => ({ ...prev, [id]: "error" }));
      }
    } catch {
      setOppResults((prev) => ({ ...prev, [id]: "error" }));
    }
  };

  const getSection = (id: string): SectionTab => activeSection[id] ?? "plan90";
  const setSection = (id: string, tab: SectionTab, c?: ClientData) => {
    setActiveSection((prev) => ({ ...prev, [id]: tab }));
    if (tab === "chaos" && c) fetchChaosScore(c);
    if (tab === "opportunities" && c) fetchOpportunities(c);
  };

  const SECTION_TABS: { id: SectionTab; label: string }[] = [
    { id: "plan90", label: "90-Day Plan" },
    { id: "brief14", label: "14-Day Brief" },
    { id: "monetize", label: "Monetize" },
    { id: "chaos", label: "Chaos Score" },
    { id: "opportunities", label: "AI Opportunities" },
    { id: "gpts", label: "GPT Tools" },
    { id: "ghostwriter", label: "GhostwriterOS" },
    { id: "synthesise", label: "Synthesise" },
    { id: "form", label: "Full Form" },
    { id: "dna", label: "DNA" },
  ];

  const content = (
    <div className="space-y-4">
      {loading ? (
        <div className="text-slate-400 text-center py-12">Loading clients...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-slate-400">No clients yet.</p>
          <a href="/onboarding" className="text-purple-400 text-sm hover:underline">
            Start onboarding a client
          </a>
        </div>
      ) : (
        clients.map((c) => {
          const isExpanded = expandedId === c.session_id;
          const section = getSection(c.session_id);
          const profile = buildFullProfileBlock(c);
          const hasDna = !!(
            c.brand_bio ||
            c.brand_voice ||
            c.banned_words ||
            c.persuasive_premise ||
            c.testimonials ||
            c.content_keywords ||
            c.offer_keywords
          );

          return (
            <div key={c.session_id} id={`client-${c.session_id}`} className="glass rounded-xl overflow-hidden">
              {/* Card Header */}
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : c.session_id)}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {(c.business_name ?? "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200 font-semibold truncate">
                    {c.business_name ?? "Unnamed Business"}
                  </div>
                  <div className="text-slate-400 text-sm truncate">{c.email ?? ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      c.status === "complete"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {c.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4">
                  {/* GPT Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { slug: "biz-strategy", label: "Strategy GPT" },
                      { slug: "workflow-copilot", label: "Workflow Copilot" },
                      { slug: "jv-partner-kit", label: "JV Partner Kit" },
                    ].map(({ slug, label }) => (
                      <a
                        key={slug}
                        href={`/api/gpt/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => copyText(profile, `gpt-${c.session_id}-${slug}`)}
                        className="flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-sm px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {label}
                        {copied === `gpt-${c.session_id}-${slug}` && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        )}
                      </a>
                    ))}
                    {/* Gamma Strategy via OpenClaw */}
                    {(() => {
                      const gj = gammaJobs[c.session_id];
                      const isSending = gj?.status === "sending";
                      const isQueued = gj?.status === "queued";
                      return (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => generateGamma(c)}
                            disabled={isSending || isQueued}
                            className={`flex items-center gap-1.5 border text-sm px-3 py-1.5 rounded-lg transition-colors ${
                              isQueued
                                ? "bg-green-500/10 border-green-500/30 text-green-400 cursor-default"
                                : "bg-cyan-600/20 hover:bg-cyan-600/30 border-cyan-500/30 text-cyan-300 disabled:opacity-50"
                            }`}
                          >
                            {isSending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isQueued ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Zap className="w-3.5 h-3.5" />
                            )}
                            {isQueued ? "Sent to Discord ✓" : isSending ? "Sending…" : "Generate Gamma"}
                          </button>
                          {gj?.status === "error" && (
                            <p className="text-red-400 text-xs">{gj.error}</p>
                          )}
                          {isQueued && (
                            <p className="text-slate-500 text-xs">OpenClaw will see it in Discord</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Section Tabs */}
                  <div className="flex gap-1 border-b border-slate-800 overflow-x-auto scrollbar-none">
                    {SECTION_TABS.map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setSection(c.session_id, id, c)}
                        className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                          section === id
                            ? "border-purple-500 text-purple-300"
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Section Content */}
                  <div>
                    {section === "plan90" && (
                      <ContentBlock
                        text={build90DayPlan(c)}
                        copyKey={`plan90-${c.session_id}`}
                        copied={copied}
                        onCopy={copyText}
                      />
                    )}
                    {section === "brief14" && (
                      <ContentBlock
                        text={build14DayBrief(c)}
                        copyKey={`brief14-${c.session_id}`}
                        copied={copied}
                        onCopy={copyText}
                      />
                    )}
                    {section === "monetize" && (
                      <ContentBlock
                        text={buildMonetizationMap(c)}
                        copyKey={`monetize-${c.session_id}`}
                        copied={copied}
                        onCopy={copyText}
                      />
                    )}
                    {section === "chaos" && (() => {
                      const cr = chaosResults[c.session_id];
                      if (!cr || cr === "loading") {
                        return (
                          <div className="flex items-center justify-center py-10 gap-3 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                            <span className="text-sm">Analyzing with DeepSeek R1…</span>
                          </div>
                        );
                      }
                      if (cr === "error") {
                        return (
                          <div className="text-center py-8 space-y-2">
                            <p className="text-red-400 text-sm">Failed to generate score.</p>
                            <button
                              onClick={() => {
                                setChaosResults((prev) => { const n = {...prev}; delete n[c.session_id]; return n; });
                                fetchChaosScore(c);
                              }}
                              className="text-purple-400 text-xs hover:underline"
                            >
                              Retry
                            </button>
                          </div>
                        );
                      }
                      const col = chaosColor(cr.score);
                      const bar = chaosBarColor(cr.score);
                      const copyStr = `Tool Chaos Score — ${c.business_name ?? "Client"}: ${cr.score}/100 (${cr.label})\n\n${cr.summary}\n\nEstimated ${cr.weeklyHoursLost} hrs/week lost = $${cr.monthlyRevenueImpact.toLocaleString()}/month in overhead.\n\nWhat's driving it:\n${cr.drivers.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nTop automations:\n${cr.topAutomations.map((a, i) => `${i + 1}. ${a.name} — saves ~${a.hoursSaved} hrs/wk [${a.priority}]`).join("\n")}\n\nRecommended entry point: ${cr.recommendedEntry}`;
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-slate-300 text-sm font-medium">Tool Chaos Score</p>
                              <p className="text-slate-500 text-xs">Powered by DeepSeek R1</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${col}`}>{cr.score}</div>
                              <div className={`text-xs ${col}`}>{cr.label}</div>
                            </div>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${cr.score}%` }} />
                          </div>
                          <p className="text-slate-300 text-sm">{cr.summary}</p>
                          <div className="bg-slate-800/60 rounded-lg px-3 py-2.5 text-sm text-slate-300">
                            Estimated <span className="text-white font-semibold">{cr.weeklyHoursLost} hrs/week</span> lost ={" "}
                            <span className="text-amber-300 font-semibold">${cr.monthlyRevenueImpact.toLocaleString()}/month</span> in unbillable overhead
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-slate-500 text-xs uppercase tracking-wide">What is driving it</p>
                            {cr.drivers.map((d, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-amber-400 font-bold text-xs mt-0.5 shrink-0">•</span>
                                <span className="text-slate-300">{d}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-slate-500 text-xs uppercase tracking-wide">Top automations to deploy</p>
                            {cr.topAutomations.map((a, i) => (
                              <div key={i} className="flex items-center justify-between text-sm bg-slate-800/40 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-purple-400 font-bold text-xs w-4">{i + 1}.</span>
                                  <span className="text-slate-300">{a.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <span className="text-cyan-400 text-xs">~{a.hoursSaved} hrs/wk</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${a.priority === "High" ? "bg-red-500/20 text-red-400" : a.priority === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"}`}>
                                    {a.priority}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2.5 space-y-1">
                            <p className="text-purple-300 text-xs uppercase tracking-wide font-medium">Recommended entry point</p>
                            <p className="text-slate-300 text-sm">{cr.recommendedEntry}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyText(copyStr, `chaos-${c.session_id}`)}
                              className="text-xs text-slate-400 hover:text-purple-300 flex items-center gap-1"
                            >
                              {copied === `chaos-${c.session_id}` ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                              Copy full report
                            </button>
                            <button
                              onClick={() => {
                                setChaosResults((prev) => { const n = {...prev}; delete n[c.session_id]; return n; });
                                fetchChaosScore(c);
                              }}
                              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 ml-2"
                            >
                              <Loader2 className="w-3 h-3" /> Regenerate
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {section === "opportunities" && (() => {
                      const or = oppResults[c.session_id];
                      const CAT_COLORS: Record<string, string> = {
                        Content: "border-purple-500/40 bg-purple-500/10",
                        Operations: "border-cyan-500/40 bg-cyan-500/10",
                        Sales: "border-green-500/40 bg-green-500/10",
                        Marketing: "border-pink-500/40 bg-pink-500/10",
                        Data: "border-blue-500/40 bg-blue-500/10",
                        "Customer Service": "border-amber-500/40 bg-amber-500/10",
                      };
                      if (!or || or === "loading") {
                        return (
                          <div className="flex items-center justify-center py-10 gap-3 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                            <span className="text-sm">Analyzing AI opportunities with DeepSeek R1…</span>
                          </div>
                        );
                      }
                      if (or === "error") {
                        return (
                          <div className="text-center py-8 space-y-2">
                            <p className="text-red-400 text-sm">Failed to generate analysis.</p>
                            <button
                              onClick={() => { setOppResults((p) => { const n = {...p}; delete n[c.session_id]; return n; }); fetchOpportunities(c); }}
                              className="text-purple-400 text-xs hover:underline"
                            >Retry</button>
                          </div>
                        );
                      }
                      const quickWins = or.filter((o) => o.quick_win);
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-slate-300 text-sm font-medium">AI Implementation Opportunities</p>
                            <span className="text-xs text-slate-500">Powered by DeepSeek R1</span>
                          </div>
                          {quickWins.length > 0 && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                              <p className="text-green-300 text-xs font-medium">⚡ {quickWins.length} Quick Win{quickWins.length > 1 ? "s" : ""} — implementable in under 2 weeks</p>
                            </div>
                          )}
                          <div className="space-y-2.5">
                            {or.map((opp, i) => (
                              <div key={i} className={`border rounded-xl p-3.5 space-y-2 ${CAT_COLORS[opp.category] ?? "border-slate-700 bg-slate-800/40"}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-xl shrink-0 mt-0.5">{opp.emoji}</span>
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-white text-sm font-semibold">{opp.title}</span>
                                        {opp.quick_win && <span className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Quick Win</span>}
                                      </div>
                                      <span className="text-xs text-slate-500">{opp.category}</span>
                                    </div>
                                  </div>
                                  <span className="text-xs text-slate-500 shrink-0">#{i + 1}</span>
                                </div>
                                <p className="text-slate-300 text-xs leading-relaxed">{opp.description}</p>
                                <div className="grid grid-cols-2 gap-1.5 text-xs">
                                  <div className="bg-slate-900/60 rounded px-2 py-1.5">
                                    <span className="text-slate-500">Effort </span>
                                    <span className={opp.effort === "Low" ? "text-green-400" : opp.effort === "Medium" ? "text-amber-400" : "text-red-400"}>{opp.effort}</span>
                                  </div>
                                  <div className="bg-slate-900/60 rounded px-2 py-1.5">
                                    <span className="text-slate-500">Impact </span>
                                    <span className={opp.impact === "High" ? "text-green-400" : opp.impact === "Medium" ? "text-amber-400" : "text-slate-400"}>{opp.impact}</span>
                                  </div>
                                  <div className="bg-slate-900/60 rounded px-2 py-1.5 col-span-2">
                                    <span className="text-slate-500">Tool: </span>
                                    <span className="text-cyan-300">{opp.recommended_tool}</span>
                                    <span className="text-slate-500"> · </span>
                                    <span className="text-slate-400">{opp.time_to_implement}</span>
                                  </div>
                                </div>
                                <div className="bg-slate-900/60 rounded px-2 py-1.5 text-xs">
                                  <span className="text-amber-300 font-medium">ROI: </span>
                                  <span className="text-slate-300">{opp.estimated_roi}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => { setOppResults((p) => { const n = {...p}; delete n[c.session_id]; return n; }); fetchOpportunities(c); }}
                            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
                          >
                            <Loader2 className="w-3 h-3" /> Regenerate
                          </button>
                        </div>
                      );
                    })()}

                    {section === "gpts" && (
                      <ContentBlock
                        text={profile}
                        copyKey={`profile-${c.session_id}`}
                        copied={copied}
                        onCopy={copyText}
                        label="Full Profile (copy before launching GPT)"
                      />
                    )}

                    {section === "ghostwriter" && (
                      <div className="space-y-3">
                        <div className="bg-slate-800/60 rounded-lg p-3 space-y-1">
                          <p className="text-slate-400 text-xs">Copy your full client brief, then open GhostwriterOS and paste into the DNA builder.</p>
                        </div>
                        <button
                          onClick={() => copyText(profile, `gw-${c.session_id}`)}
                          className="flex items-center gap-2 w-full justify-center border border-slate-700 text-slate-300 py-2 rounded-lg text-sm hover:border-purple-500/40 hover:text-purple-300 transition-colors"
                        >
                          {copied === `gw-${c.session_id}` ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          {copied === `gw-${c.session_id}` ? "Brief copied!" : "Copy Full Brief"}
                        </button>
                        <a
                          href="https://dashboard.ghostwriteros.ai/dashboard?tab=DNAs"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => copyText(profile, `gw-${c.session_id}`)}
                          className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open GhostwriterOS →
                        </a>
                        <p className="text-slate-600 text-xs text-center">Brief auto-copies on launch</p>
                      </div>
                    )}

                    {section === "synthesise" && (
                      <div className="space-y-3">
                        <div className="bg-slate-800/60 rounded-lg p-3 space-y-1">
                          <p className="text-slate-400 text-xs">Copy your full client brief, then open Synthesise to run the coaching offer strategy flow.</p>
                        </div>
                        <button
                          onClick={() => copyText(profile, `syn-${c.session_id}`)}
                          className="flex items-center gap-2 w-full justify-center border border-slate-700 text-slate-300 py-2 rounded-lg text-sm hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                        >
                          {copied === `syn-${c.session_id}` ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          {copied === `syn-${c.session_id}` ? "Brief copied!" : "Copy Full Brief"}
                        </button>
                        <a
                          href="https://app.synthesise.ai/flow/0f665384-04db-4a71-8269-4a31855350dd/coaching-offer/d623e422-d45b-45e9-9d14-521a03e49f79"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => copyText(profile, `syn-${c.session_id}`)}
                          className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open Synthesise →
                        </a>
                        <p className="text-slate-600 text-xs text-center">Brief auto-copies on launch</p>
                      </div>
                    )}

                    {section === "form" && (
                      <div className="space-y-1.5 text-sm">
                        {([
                          ["Business Name", c.business_name],
                          ["Email", c.email],
                          ["Website", c.website],
                          ["Industry & Model", c.industry_model],
                          ["Revenue Trajectory", c.revenue_trajectory],
                          ["Team Structure", c.team_structure],
                          ["Strengths & Gaps", c.strengths_gaps],
                          ["Investment Capacity", c.investment_capacity],
                          ["Primary Goal (90d)", c.primary_goal],
                          ["Biggest Challenge", c.biggest_challenge],
                          ["Current Tech Stack", c.tech_stack],
                          ["Success Metrics", c.success_metrics],
                          ["Existing Data & Assets", c.existing_assets],
                          ["Untapped Opportunity", c.untapped_opportunity],
                          ["Scaling Bottleneck", c.scaling_bottleneck],
                          ["Implementation Timeline", c.timeline],
                          ["AI Comfort Level", c.ai_comfort],
                          ["Dream Scenario (3yr)", c.dream_scenario],
                          ["Unique Value Prop", c.uvp],
                          ["Ideal Client Profile", c.ideal_client],
                          ["Unconventional Approach", c.unconventional_approach],
                          ["Anything Else", c.anything_else],
                        ] as [string, string | null | undefined][]).map(([k, v]) =>
                          v ? (
                            <div key={k} className="flex gap-2 py-1 border-b border-slate-800/60 last:border-0">
                              <span className="text-slate-500 w-40 shrink-0 text-xs pt-0.5">{k}</span>
                              <span className="text-slate-300 text-xs leading-relaxed">{v}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                    {section === "dna" && (
                      hasDna ? (
                        <ContentBlock
                          text={`── CAMPAIGN DNA ──
Brand Bio: ${c.brand_bio ?? ""}
Brand Voice: ${c.brand_voice ?? ""}
Banned Words: ${c.banned_words ?? ""}
Persuasive Premise: ${c.persuasive_premise ?? ""}
Testimonials: ${c.testimonials ?? ""}
Content Keywords: ${c.content_keywords ?? ""}
Offer Keywords: ${c.offer_keywords ?? ""}`}
                          copyKey={`dna-${c.session_id}`}
                          copied={copied}
                          onCopy={copyText}
                        />
                      ) : (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-2">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <p className="text-amber-300 text-sm">Campaign DNA not yet filled.</p>
                          <a
                            href="/onboarding"
                            className="text-purple-400 text-sm hover:underline"
                          >
                            Complete Step 6 in the onboarding wizard
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  if (!standalone) return content;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Shadow Ops
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Client intelligence and GPT launch center</p>
        </div>
        {content}
      </div>
    </div>
  );
}

function ContentBlock({
  text,
  copyKey,
  copied,
  onCopy,
  label,
}: {
  text: string;
  copyKey: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      {label && <p className="text-slate-400 text-xs">{label}</p>}
      <div className="relative">
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans bg-slate-800/50 rounded-lg p-4 max-h-64 overflow-y-auto">
          {text}
        </pre>
        <button
          onClick={() => onCopy(text, copyKey)}
          className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          title="Copy"
        >
          {copied === copyKey ? (
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
}
