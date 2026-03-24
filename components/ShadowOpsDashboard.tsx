"use client";

import { useState, useEffect } from "react";
import { Target, Copy, CheckCircle, ExternalLink, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Navigation from "./Navigation";

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

type SectionTab = "plan90" | "brief14" | "monetize" | "gpts" | "form" | "dna";

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
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Record<string, SectionTab>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/onboarding/list")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setClients(d.submissions);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const getSection = (id: string): SectionTab => activeSection[id] ?? "plan90";
  const setSection = (id: string, tab: SectionTab) =>
    setActiveSection((prev) => ({ ...prev, [id]: tab }));

  const SECTION_TABS: { id: SectionTab; label: string }[] = [
    { id: "plan90", label: "90-Day Plan" },
    { id: "brief14", label: "14-Day Brief" },
    { id: "monetize", label: "Monetize" },
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
            <div key={c.session_id} className="glass rounded-xl overflow-hidden">
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
