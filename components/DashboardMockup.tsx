"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  TrendingUp,
  Brain,
  Target,
  ExternalLink,
  ChevronRight,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import Navigation from "./Navigation";
import CEOCommandDashboard from "./CEOCommandDashboard";
import FlowOSDashboard from "./FlowOSDashboard";
import ShadowOpsDashboard from "./ShadowOpsDashboard";

type Tab = "strawman" | "real" | "ceo" | "flow" | "shadow";

interface RealSubmission {
  id: string;
  session_id: string;
  status: string;
  business_name: string | null;
  email: string | null;
  industry_model: string | null;
  ai_comfort: string | null;
  investment_capacity: string | null;
  updated_at: string;
}

interface FullClientData {
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

const STRAWMAN_CLIENTS = [
  {
    name: "TechStart Inc",
    industry: "E-Commerce",
    arr: "$1.2M ARR",
    status: "Active",
    color: "green",
    goal: "Scale operations and automate customer support to handle 3x growth",
    challenge: "Manual processes consuming 40% of team bandwidth",
    brief:
      "Business Name: TechStart Inc\nIndustry: E-Commerce / SaaS\nRevenue: $1.2M ARR\nTeam: 12 FTE\nPrimary Goal: Scale to $3M ARR in 18 months via AI-powered ops\nBiggest Challenge: Manual customer support consuming 40% bandwidth\nTech Stack: Shopify, Zendesk, Slack, HubSpot\nInvestment: $5,000–$10,000 for AI infrastructure\nDream Scenario: Fully automated customer journey from acquisition to retention",
  },
  {
    name: "MettaMentor.com",
    industry: "AI Consulting",
    arr: "Growing",
    status: "Demo",
    color: "purple",
    goal: "Build scalable AI consulting practice with dashboard-first delivery",
    challenge: "Time fragmentation across 4 operating areas",
    brief:
      "Business Name: MettaMentor.com / AI Strategic Wingman\nOwner: Ray Robinson\nIndustry: AI Consulting\nModel: B2B consulting + productized services\nPrimary Goal: $25k/month revenue within 90 days\nBiggest Challenge: Context switching across Treasures, Wingman, Shadow Ops, Personal\nDream Scenario: Fully automated CEO operating system with 3 revenue streams running in parallel",
  },
  {
    name: "RetailEdge",
    industry: "Retail",
    arr: "$800K ARR",
    status: "Prospect",
    color: "amber",
    goal: "Modernize inventory management with AI forecasting",
    challenge: "Stockouts costing $15K/month in lost sales",
    brief:
      "Business Name: RetailEdge\nIndustry: Retail\nRevenue: $800K ARR\nPrimary Goal: AI-powered inventory forecasting\nBiggest Challenge: $15K/month stockout losses\nInvestment: $3,000–$7,000",
  },
  {
    name: "HealthFirst",
    industry: "Healthcare",
    arr: "$2.1M ARR",
    status: "Qualified",
    color: "cyan",
    goal: "Automate patient intake and follow-up workflows",
    challenge: "Admin staff spending 60% of time on repetitive tasks",
    brief:
      "Business Name: HealthFirst\nIndustry: Healthcare / Wellness\nRevenue: $2.1M ARR\nPrimary Goal: Automate patient intake and follow-up\nBiggest Challenge: Admin spending 60% time on repetitive tasks\nInvestment: $8,000–$15,000",
  },
];

const STATUS_COLORS: Record<string, string> = {
  green: "bg-green-500/20 text-green-400 border-green-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

function buildFullBrief(c: FullClientData): string {
  const lines: string[] = [
    "Start with this data and guide me to the right next steps, questions, and/or strategy:",
    "",
    `Business Name: ${c.business_name ?? ""}`,
    `Email: ${c.email ?? ""}`,
    `Website: ${c.website ?? ""}`,
    `Industry & Business Model: ${c.industry_model ?? ""}`,
    `Team Structure: ${c.team_structure ?? ""}`,
    `Revenue & Growth Trajectory: ${c.revenue_trajectory ?? ""}`,
    `Primary Goal (90 Days): ${c.primary_goal ?? ""}`,
    `Biggest Challenge: ${c.biggest_challenge ?? ""}`,
    `Current Tech Stack: ${c.tech_stack ?? ""}`,
    `Team Strengths & Gaps: ${c.strengths_gaps ?? ""}`,
    `Investment Capacity: ${c.investment_capacity ?? ""}`,
    `Success Metrics: ${c.success_metrics ?? ""}`,
    `Existing Data & Assets: ${c.existing_assets ?? ""}`,
    `Biggest Untapped Opportunity: ${c.untapped_opportunity ?? ""}`,
    `Scaling Bottleneck: ${c.scaling_bottleneck ?? ""}`,
    `Implementation Timeline: ${c.timeline ?? ""}`,
    `AI & Automation Comfort Level: ${c.ai_comfort ?? ""}`,
    `Dream Scenario (3 Years): ${c.dream_scenario ?? ""}`,
    `Unique Value Proposition: ${c.uvp ?? ""}`,
    `Ideal Client Profile: ${c.ideal_client ?? ""}`,
    `Unconventional Approach: ${c.unconventional_approach ?? ""}`,
    `Anything Else: ${c.anything_else ?? ""}`,
  ];

  const hasDna =
    c.brand_bio ||
    c.brand_voice ||
    c.banned_words ||
    c.persuasive_premise ||
    c.testimonials ||
    c.content_keywords ||
    c.offer_keywords;

  if (hasDna) {
    lines.push("");
    lines.push("── CAMPAIGN DNA ──");
    if (c.brand_bio) lines.push(`Brand Bio: ${c.brand_bio}`);
    if (c.brand_voice) lines.push(`Brand Voice: ${c.brand_voice}`);
    if (c.banned_words) lines.push(`Banned Words / Phrases: ${c.banned_words}`);
    if (c.persuasive_premise) lines.push(`Persuasive Premise: ${c.persuasive_premise}`);
    if (c.testimonials) lines.push(`Testimonials: ${c.testimonials}`);
    if (c.content_keywords) lines.push(`Content Keywords: ${c.content_keywords}`);
    if (c.offer_keywords) lines.push(`Offer Keywords: ${c.offer_keywords}`);
  }

  return lines.join("\n");
}

export default function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<Tab>("strawman");
  const [realClients, setRealClients] = useState<RealSubmission[]>([]);
  const [loadingReal, setLoadingReal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<FullClientData | null>(null);
  const [selectedStrawman, setSelectedStrawman] = useState<(typeof STRAWMAN_CLIENTS)[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchRealClients = useCallback(async () => {
    setLoadingReal(true);
    try {
      const res = await fetch("/api/onboarding/list");
      const data = await res.json();
      if (data.ok) setRealClients(data.submissions);
    } catch {
      // ignore
    } finally {
      setLoadingReal(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "real") fetchRealClients();
  }, [activeTab, fetchRealClients]);

  const openRealClient = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/onboarding?session=${sessionId}`);
      const data = await res.json();
      if (data.ok) setSelectedClient(data.submission);
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "strawman", label: "Strawman Clients", icon: Users },
    { id: "real", label: "Real Clients", icon: CheckCircle },
    { id: "ceo", label: "CEO Command", icon: Brain },
    { id: "flow", label: "Flow OS", icon: TrendingUp },
    { id: "shadow", label: "Shadow Ops", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              AI Wingman Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">CEO Operating System — 6-module intelligence hub</p>
          </div>
          <a
            href="/onboarding"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Users className="w-4 h-4" />
            New Client
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800 overflow-x-auto scrollbar-none">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                activeTab === id
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Strawman */}
        {activeTab === "strawman" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STRAWMAN_CLIENTS.map((client) => (
              <div
                key={client.name}
                className="glass rounded-xl p-5 space-y-3 cursor-pointer hover:border-slate-600 transition-colors"
                onClick={() => setSelectedStrawman(client)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{client.name}</h3>
                    <p className="text-slate-400 text-sm">{client.industry}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 border-slate-700">
                      {client.arr}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[client.color]}`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{client.goal}</p>
                <p className="text-slate-500 text-xs">{client.challenge}</p>
                <div className="flex items-center gap-1 text-purple-400 text-xs">
                  <span>View brief</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Real Clients */}
        {activeTab === "real" && (
          <div className="space-y-4">
            {loadingReal ? (
              <div className="text-slate-400 text-center py-12">Loading clients...</div>
            ) : realClients.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-slate-400">No client submissions yet.</p>
                <a href="/onboarding" className="text-purple-400 text-sm hover:underline">
                  Start onboarding a client
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {realClients.map((c) => (
                  <div
                    key={c.session_id}
                    className="glass rounded-xl p-5 space-y-3 cursor-pointer hover:border-slate-600 transition-colors"
                    onClick={() => openRealClient(c.session_id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {c.business_name ?? "Unnamed Business"}
                        </h3>
                        <p className="text-slate-400 text-sm">{c.email ?? ""}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          c.status === "complete"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    {c.industry_model && (
                      <p className="text-slate-300 text-sm">{c.industry_model}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {c.ai_comfort && (
                        <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                          {c.ai_comfort}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-slate-500 text-xs ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(c.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: CEO Command */}
        {activeTab === "ceo" && <CEOCommandDashboard standalone={false} />}

        {/* Tab: Flow OS */}
        {activeTab === "flow" && <FlowOSDashboard standalone={false} />}

        {/* Tab: Shadow Ops */}
        {activeTab === "shadow" && <ShadowOpsDashboard standalone={false} />}
      </div>

      {/* Strawman Modal */}
      {selectedStrawman && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStrawman(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedStrawman.name}</h2>
                <p className="text-slate-400 text-sm">{selectedStrawman.industry}</p>
              </div>
              <button
                onClick={() => setSelectedStrawman(null)}
                className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans bg-slate-800/50 rounded-lg p-4 max-h-60 overflow-y-auto">
              {selectedStrawman.brief}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(selectedStrawman.brief)}
                className="flex items-center gap-2 flex-1 justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Brief"}
              </button>
              <a
                href="/api/gpt/biz-strategy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copyToClipboard(selectedStrawman.brief)}
                className="flex items-center gap-2 flex-1 justify-center bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Strategy GPT
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Real Client Modal */}
      {selectedClient && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {selectedClient.business_name ?? "Client Brief"}
                </h2>
                <p className="text-slate-400 text-sm">{selectedClient.email ?? ""}</p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans bg-slate-800/50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {buildFullBrief(selectedClient)}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(buildFullBrief(selectedClient))}
                className="flex items-center gap-2 flex-1 justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Brief"}
              </button>
              <a
                href="/api/gpt/biz-strategy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copyToClipboard(buildFullBrief(selectedClient))}
                className="flex items-center gap-2 flex-1 justify-center bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Strategy GPT
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
