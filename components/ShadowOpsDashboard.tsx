"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Target, Copy, CheckCircle, ExternalLink, AlertCircle, ChevronDown, ChevronUp, Zap, Loader2 } from "lucide-react";
import Navigation from "./Navigation";

// Gamma Strategy Discord channel — OpenClaw monitors this
const GAMMA_DISCORD_CHANNEL = "1483998065638506536";

interface ClientData {
  session_id: string;
  business_name: string | null;
  email: string | null;
  status: string;
  industry_model: string | null;
  ai_comfort: string | null;
  investment_capacity: string | null;
  updated_at: string;
  primary_goal?: string | null;
  biggest_challenge?: string | null;
  uvp?: string | null;
  revenue_trajectory?: string | null;
  brand_bio?: string | null;
  brand_voice?: string | null;
  banned_words?: string | null;
  persuasive_premise?: string | null;
  testimonials?: string | null;
  content_keywords?: string | null;
  offer_keywords?: string | null;
}

type SectionTab = "plan90" | "brief14" | "monetize" | "chaos" | "gpts" | "form" | "dna";

function calcChaos(c: ClientData): { score: number; label: string; color: string; weeklyCost: number; topAutos: string[] } {
  let score = 0;
  const team = (c.investment_capacity ?? "").toLowerCase();
  const isSolo = !c.investment_capacity || team.includes("200") || team.includes("500") || team.includes("free");
  if (isSolo) score += 20;

  const industry = (c.industry_model ?? "").toLowerCase();
  if (industry.includes("ecommerce") || industry.includes("woocommerce") || industry.includes("shopify")) score += 10;

  const challenge = (c.biggest_challenge ?? "").toLowerCase();
  if (challenge.includes("time") || challenge.includes("manual") || challenge.includes("all") || challenge.includes("only")) score += 18;

  // Solo with no AI background = high chaos
  const aiLevel = (c.ai_comfort ?? "").toLowerCase();
  if (!aiLevel.includes("advanced") && !aiLevel.includes("daily")) score += 12;

  score = Math.min(score + 25, 100); // base of 25 for any solo SMB
  const label = score >= 70 ? "Critical" : score >= 50 ? "High" : score >= 35 ? "Moderate" : "Low";
  const color = score >= 70 ? "text-red-400" : score >= 50 ? "text-amber-400" : score >= 35 ? "text-yellow-400" : "text-green-400";
  const weeklyCost = Math.round((score / 100) * 16);
  const topAutos = [
    "Priority inbox triage — 5–8 hrs/wk",
    industry.includes("ecommerce") ? "Order routing automation — 3–5 hrs/wk" : "Client follow-up sequences — 4–6 hrs/wk",
    "Invoice + payment reminders — 2–3 hrs/wk",
  ];
  return { score, label, color, weeklyCost, topAutos };
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

export default function ShadowOpsDashboard({ standalone = true }: { standalone?: boolean }) {
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(searchParams.get("client"));
  const [activeSection, setActiveSection] = useState<Record<string, SectionTab>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [gammaJobs, setGammaJobs] = useState<Record<string, { status: "idle" | "sending" | "queued" | "error"; jobId?: string; error?: string }>>({});

  const targetClientId = searchParams.get("client");

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

  const getSection = (id: string): SectionTab => activeSection[id] ?? "plan90";
  const setSection = (id: string, tab: SectionTab) =>
    setActiveSection((prev) => ({ ...prev, [id]: tab }));

  const SECTION_TABS: { id: SectionTab; label: string }[] = [
    { id: "plan90", label: "90-Day Plan" },
    { id: "brief14", label: "14-Day Brief" },
    { id: "monetize", label: "Monetize" },
    { id: "chaos", label: "Chaos Score" },
    { id: "gpts", label: "GPT Tools" },
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
                        onClick={() => setSection(c.session_id, id)}
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
                      const chaos = calcChaos(c);
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-slate-300 text-sm font-medium">Tool Chaos Score</p>
                              <p className="text-slate-500 text-xs">Estimated operational overhead</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${chaos.color}`}>{chaos.score}</div>
                              <div className={`text-xs ${chaos.color}`}>{chaos.label}</div>
                            </div>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${chaos.score >= 70 ? "bg-red-500" : chaos.score >= 50 ? "bg-amber-500" : "bg-yellow-500"}`}
                              style={{ width: `${chaos.score}%` }}
                            />
                          </div>
                          <div className="bg-slate-800/60 rounded-lg px-3 py-2.5 text-sm text-slate-300">
                            Estimated <span className="text-white font-semibold">{chaos.weeklyCost} hrs/week</span> lost to manual work ={" "}
                            <span className="text-amber-300 font-semibold">${(chaos.weeklyCost * 75 * 4).toLocaleString()}/month</span> in unbillable overhead
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-slate-500 text-xs uppercase tracking-wide">Top automations to deploy</p>
                            {chaos.topAutos.map((a, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <span className="text-purple-400 font-bold text-xs w-4">{i + 1}.</span>
                                <span className="text-slate-300">{a}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => copyText(
                              `Tool Chaos Score for ${c.business_name ?? "this business"}: ${chaos.score}/100 (${chaos.label})\n\nEstimated ${chaos.weeklyCost} hrs/week lost = $${(chaos.weeklyCost * 75 * 4).toLocaleString()}/month in overhead.\n\nTop automations:\n${chaos.topAutos.map((a, i) => `${i + 1}. ${a}`).join("\n")}`,
                              `chaos-${c.session_id}`
                            )}
                            className="text-xs text-slate-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            {copied === `chaos-${c.session_id}` ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            Copy score for client
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
                    {section === "form" && (
                      <div className="space-y-2 text-sm">
                        {Object.entries({
                          "Business Name": c.business_name,
                          Email: c.email,
                          Industry: c.industry_model,
                          "AI Comfort": c.ai_comfort,
                          "Investment Capacity": c.investment_capacity,
                          "Primary Goal": c.primary_goal,
                          "Biggest Challenge": c.biggest_challenge,
                          UVP: c.uvp,
                          "Revenue Trajectory": c.revenue_trajectory,
                        }).map(([k, v]) =>
                          v ? (
                            <div key={k} className="flex gap-2">
                              <span className="text-slate-500 w-36 shrink-0">{k}:</span>
                              <span className="text-slate-300">{v}</span>
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
