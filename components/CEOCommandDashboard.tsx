"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Brain,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Zap,
  Users,
  DollarSign,
  Link2,
  RefreshCw,
  ChevronDown as SelectIcon,
} from "lucide-react";
import Navigation from "./Navigation";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string;
}

interface ImportantMessage {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

interface GmailData {
  connected: boolean;
  email?: string;
  importantCount?: number;
  orderCount?: number;
  geminiSummary?: {
    subject: string;
    date: string;
    body: string;
    snippet: string;
  } | null;
  importantMessages?: ImportantMessage[];
}

interface TelegramMsg { id: number; text: string; sender: string; isBot: boolean; date: string; time: string }
interface TelegramChat { id: number; title: string; type: string; messages: TelegramMsg[] }
interface TelegramData { connected: boolean; chats: TelegramChat[] }

interface AsanaTask { gid: string; name: string; completed: boolean; due_on: string | null; projects: Array<{ name: string }> }
interface AsanaProject { gid: string; name: string; current_status?: { text: string; color: string } | null }
interface AsanaSummary { total: number; open: number; overdue: number; completed: number }
interface AsanaData { connected: boolean; tasks: AsanaTask[]; projects: AsanaProject[]; summary: AsanaSummary }

interface NotionPage { id: string; title: string; status: string | null; lastEdited: string; url: string }
interface NotionData { connected: boolean; pages: NotionPage[] }

interface DiscordMessage {
  id: string;
  content: string;
  author: string;
  isBot: boolean;
  timestamp: string;
}

interface DiscordChannel {
  id: string;
  name: string;
  topic: string;
  messages: DiscordMessage[];
}

interface AiInsight {
  text: string;
  action: string;
  priority: "high" | "medium" | "low";
  type: "revenue" | "attention" | "risk" | "opportunity" | "client";
}

interface GoogleData {
  gmail: GmailData;
  calendar: { connected: boolean; events: CalendarEvent[] };
  discord: { connected: boolean; channels: DiscordChannel[] };
  telegram: TelegramData;
  asana: AsanaData;
  notion: NotionData;
}

interface ClientRow {
  session_id: string;
  business_name: string | null;
  email: string | null;
  status: string;
  investment_capacity: string | null;
  updated_at: string;
}

const PRIORITIES = [
  { text: "Close 2 Shadow Operator calls this week", urgency: "red" },
  { text: "Finish Treasures Bio routing audit", urgency: "amber" },
  { text: "Push dashboard demo to Vercel", urgency: "amber" },
  { text: "Record Wingman promo video", urgency: "green" },
  { text: "Review AI Income Workshop progress", urgency: "green" },
];

const AUTOMATIONS: Array<{ name: string; status: "live" | "planned" | "partial"; tool: string }> = [
  { name: "Daily CEO Brief (this dashboard)", status: "live", tool: "Vercel + OpenRouter" },
  { name: "Client Intake → AI Brief", status: "live", tool: "Dashboard onboarding" },
  { name: "Gamma Strategy via Discord", status: "live", tool: "OpenClaw + Discord" },
  { name: "AI Intelligence Report", status: "live", tool: "OpenRouter" },
  { name: "Order Router", status: "planned", tool: "Zapier or Make.com" },
  { name: "Shadow Ops Outreach Sequence", status: "planned", tool: "Email / CRM" },
  { name: "Treasures Bio Routing", status: "partial", tool: "WooCommerce" },
  { name: "Lead Scoring Auto-Tag", status: "planned", tool: "Dashboard AI" },
];

const DECISIONS = [
  "Should I run paid ads for Shadow Operator this week?",
  "Do I need a VA for Treasures fulfillment?",
  "Which GPT gets client-facing first: Strategy or Ghostwriter?",
  "Am I on track for AI Wingman's $25K/month goal — what's the gap?",
];

// OpenRouter model options — stored in localStorage as user preference
const MODEL_OPTIONS: Array<{ id: string; label: string; note?: string }> = [
  { id: "openai/gpt-4o-mini", label: "GPT-4o Mini", note: "fast + cheap" },
  { id: "openrouter/auto", label: "Auto (OpenRouter picks)", note: "best available" },
  { id: "x-ai/grok-3-beta", label: "Grok 3 (xAI)", note: "real-time data" },
  { id: "google/gemini-2.5-pro-preview", label: "Gemini 2.5 Pro", note: "1M context" },
  { id: "deepseek/deepseek-r1", label: "DeepSeek R1", note: "free / reasoning" },
  { id: "deepseek/deepseek-chat", label: "DeepSeek V3.2", note: "~$0.28/1M" },
  { id: "meta-llama/llama-4-scout", label: "Llama 4 Scout", note: "10M context" },
  { id: "qwen/qwen3-235b-a22b", label: "Qwen3-235B", note: "MoE + thinking" },
  { id: "google/gemini-flash-1.5", label: "Gemini Flash", note: "budget speed" },
  { id: "anthropic/claude-haiku-4-5", label: "Claude Haiku 4.5", note: "via OpenRouter" },
];

// ── Wingman Intelligence Engine ──────────────────────────────────────────────
// Synthesizes signals ACROSS Gmail + Calendar + Clients to surface insights
// no individual tool can show. This is the demo's WOW moment.

interface WingmanInsight {
  priority: "high" | "medium" | "low";
  text: string;
  action: string;
  emoji: string;
}

function generateInsights(
  gmail: GmailData,
  calEvents: CalendarEvent[],
  clients: ClientRow[],
  now: Date
): WingmanInsight[] {
  if (!gmail.connected) return [];
  const insights: WingmanInsight[] = [];

  // 1. Meeting prep: upcoming event + related email in inbox
  const upcoming = calEvents.filter((e) => {
    const start = new Date(e.start);
    const mins = (start.getTime() - now.getTime()) / 60000;
    return mins > 0 && mins < 120;
  });
  for (const event of upcoming.slice(0, 2)) {
    const titleWords = event.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const related = (gmail.importantMessages ?? []).filter((msg) =>
      titleWords.some(
        (word) =>
          msg.from.toLowerCase().includes(word) ||
          msg.subject.toLowerCase().includes(word)
      )
    );
    const mins = Math.round((new Date(event.start).getTime() - now.getTime()) / 60000);
    if (related.length > 0) {
      insights.push({
        priority: "high",
        text: `"${event.title}" in ${mins}m — ${related.length} related email${related.length > 1 ? "s" : ""} waiting in your inbox`,
        action: "Review before joining",
        emoji: "📅",
      });
    }
  }

  // 2. Calendar load vs inbox pressure
  const meetingCount = calEvents.length;
  const inboxCount = gmail.importantCount ?? 0;
  if (meetingCount >= 3 && inboxCount >= 3) {
    insights.push({
      priority: "high",
      text: `${meetingCount} meetings + ${inboxCount} priority emails today — attention is split across ${meetingCount + inboxCount} demands`,
      action: "Block 30 min for inbox response",
      emoji: "⚡",
    });
  } else if (meetingCount === 0 && inboxCount >= 2) {
    insights.push({
      priority: "low",
      text: `Clear calendar today + ${inboxCount} priority emails — rare unblocked window`,
      action: "Use this for deep work or client follow-up",
      emoji: "✅",
    });
  }

  // 3. Revenue signal: orders vs calendar capacity
  const orderCount = gmail.orderCount ?? 0;
  if (orderCount > 0) {
    const heavy = meetingCount >= 4;
    insights.push({
      priority: orderCount >= 3 ? "high" : "medium",
      text: `${orderCount} new order${orderCount > 1 ? "s" : ""} in inbox — ${heavy ? "heavy meeting day, delegate fulfillment" : "calendar has room to process today"}`,
      action: heavy ? "Assign to VA or batch tonight" : "Process orders now",
      emoji: "💰",
    });
  }

  // 4. Client email match: inbox email domain matches a client in the pipeline
  for (const client of clients.slice(0, 8)) {
    if (!client.email) continue;
    const domain = client.email.split("@")[1];
    const match = (gmail.importantMessages ?? []).find(
      (msg) => domain && msg.from.toLowerCase().includes(domain)
    );
    if (match) {
      insights.push({
        priority: "high",
        text: `Email from ${client.business_name ?? "client"}: "${match.subject.slice(0, 55)}"`,
        action: "Client is in your pipeline — respond within 2 hours",
        emoji: "👤",
      });
      break;
    }
  }

  // 5. Idle pipeline: clients waiting but no emails from them
  const completeClients = clients.filter((c) => c.status === "complete").length;
  const draftClients = clients.filter((c) => c.status !== "complete").length;
  if (draftClients >= 2 && inboxCount === 0) {
    insights.push({
      priority: "medium",
      text: `${draftClients} clients still in draft — inbox is clear, ideal time to follow up`,
      action: "Send progress check-in",
      emoji: "📋",
    });
  }

  // 6. Clear day signal
  if (insights.length === 0) {
    insights.push({
      priority: "low",
      text: "Inbox clear and calendar light — system is running smoothly",
      action: "Use this window for strategic planning",
      emoji: "🎯",
    });
  }

  return insights.slice(0, 4);
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/?(ul|ol)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatTime(isoString: string): string {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function Section({
  title,
  icon: Icon,
  badge,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-5 py-3.5 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <Icon className="w-4 h-4 text-purple-400 shrink-0" />
        <span className="font-semibold text-slate-200 flex-1">{title}</span>
        {badge && (
          <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  );
}

export default function CEOCommandDashboard({ standalone = true, connectedParam }: { standalone?: boolean; connectedParam?: string | null }) {
  const [now, setNow] = useState(new Date());
  const [googleData, setGoogleData] = useState<GoogleData>({
    gmail: { connected: false },
    calendar: { connected: false, events: [] },
    discord: { connected: false, channels: [] },
    telegram: { connected: false, chats: [] },
    asana: { connected: false, tasks: [], projects: [], summary: { total: 0, open: 0, overdue: 0, completed: 0 } },
    notion: { connected: false, pages: [] },
  });
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [calmScore, setCalmScore] = useState(72);
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState<string>("openai/gpt-4o-mini");
  const [aiModelUsed, setAiModelUsed] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<string[]>(DECISIONS);
  const [loadingDecisions, setLoadingDecisions] = useState(false);
  const [decisionModel, setDecisionModel] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist AI model choice across sessions
  useEffect(() => {
    const saved = localStorage.getItem("ai_model_pref");
    if (saved) setAiModel(saved);
  }, []);

  const fetchGoogleData = useCallback(async () => {
    setLoadingGoogle(true);
    try {
      const [gmailRes, calRes, discordRes, telegramRes, asanaRes, notionRes] = await Promise.all([
        fetch("/api/gmail"),
        fetch("/api/calendar"),
        fetch("/api/discord"),
        fetch("/api/telegram"),
        fetch("/api/asana"),
        fetch("/api/notion"),
      ]);
      const gmail = await gmailRes.json();
      const calendar = await calRes.json();
      const discord = await discordRes.json();
      const telegram = await telegramRes.json();
      const asana = await asanaRes.json();
      const notion = await notionRes.json();
      setGoogleData({ gmail, calendar, discord, telegram, asana, notion });

      // Calm score: more connected tools + inbox health
      let score = 50;
      if (gmail.connected) score += 12;
      if (calendar.connected) score += 8;
      if (!gmail.importantCount || gmail.importantCount < 5) score += 8;
      if (telegram.connected) score += 5;
      if (asana.connected) score += 5;
      if (notion.connected) score += 4;
      if (discord.connected) score += 4;
      if (asana.connected && (asana.summary?.overdue ?? 0) > 0) score -= 10;
      setCalmScore(Math.min(Math.max(score, 20), 100));
    } catch {
      // ignore
    } finally {
      setLoadingGoogle(false);
    }
  }, []);

  const generateAIReport = useCallback(async () => {
    setGeneratingAI(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: aiModel,
          gmail: googleData.gmail,
          calendar: googleData.calendar,
          clients,
          telegram: googleData.telegram,
          asana: googleData.asana,
          notion: googleData.notion,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setAiInsights(data.insights);
        setAiModelUsed(data.model ?? aiModel);
        sessionStorage.setItem("ai_insights_cache", JSON.stringify({ insights: data.insights, model: data.model, ts: Date.now() }));
      } else {
        setAiError(data.error ?? "Failed to generate insights");
      }
    } catch (err) {
      setAiError(String(err));
    } finally {
      setGeneratingAI(false);
    }
  }, [googleData, clients]);

  const fetchDecisions = useCallback(async () => {
    setLoadingDecisions(true);
    try {
      const res = await fetch("/api/decision-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clients,
          gmailImportantCount: googleData.gmail.importantCount,
          gmailOrderCount: googleData.gmail.orderCount,
          calendarEventCount: googleData.calendar.events.length,
          asanaOverdue: googleData.asana.summary?.overdue,
          asanaOpen: googleData.asana.summary?.open,
        }),
      });
      const data = await res.json();
      if (data.ok && data.decisions?.length > 0) {
        setDecisions(data.decisions);
        setDecisionModel(data.model ?? null);
      }
    } catch { /* keep static fallback */ }
    finally { setLoadingDecisions(false); }
  }, [clients, googleData]);

  useEffect(() => {
    fetchGoogleData();
    fetch("/api/onboarding/list")
      .then((r) => r.json())
      .then((d) => { if (d.ok) setClients(d.submissions); })
      .catch(() => {});
  }, [fetchGoogleData]);

  // Auto-load AI decisions once data is available (run once per session)
  const [decisionsAutoTriggered, setDecisionsAutoTriggered] = useState(false);
  useEffect(() => {
    if (decisionsAutoTriggered) return;
    if (googleData.gmail.connected || clients.length > 0) {
      setDecisionsAutoTriggered(true);
      fetchDecisions();
    }
  }, [googleData.gmail.connected, clients.length, decisionsAutoTriggered, fetchDecisions]);

  // Auto-generate AI brief on load (sessionStorage cache — avoids re-calling on every render)
  const [autoTriggered, setAutoTriggered] = useState(false);
  useEffect(() => {
    if (autoTriggered) return;
    const cached = sessionStorage.getItem("ai_insights_cache");
    if (cached) {
      try {
        const { insights, ts } = JSON.parse(cached);
        // Use cache if it's less than 30 minutes old
        if (Date.now() - ts < 30 * 60 * 1000 && insights?.length > 0) {
          setAiInsights(insights);
          if (cached && JSON.parse(cached).model) setAiModelUsed(JSON.parse(cached).model);
          setAutoTriggered(true);
          return;
        }
      } catch { /* ignore */ }
    }
    // Auto-trigger once data is loaded and Gmail is connected
    if (googleData.gmail.connected && !generatingAI && aiInsights.length === 0) {
      setAutoTriggered(true);
      generateAIReport();
    }
  }, [googleData.gmail.connected, generatingAI, aiInsights.length, autoTriggered, generateAIReport]);

  // Re-fetch after Google OAuth callback
  useEffect(() => {
    if (connectedParam === "google") {
      fetchGoogleData();
    }
  }, [connectedParam, fetchGoogleData]);

  const pipelineTotal = clients.reduce((sum, c) => {
    const val = parseInt((c.investment_capacity ?? "").replace(/\D/g, "")) || 0;
    return sum + val;
  }, 0);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (calmScore / 100) * circumference;

  const content = (
    <div className="space-y-4">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Priority Emails",
            value: googleData.gmail.connected ? String(googleData.gmail.importantCount ?? 0) : "--",
            icon: Mail,
            color: "text-red-400",
          },
          {
            label: "Meetings Today",
            value: googleData.calendar.connected ? String(googleData.calendar.events.length) : "--",
            icon: Calendar,
            color: "text-cyan-400",
          },
          {
            label: "New Orders",
            value: googleData.gmail.connected ? String(googleData.gmail.orderCount ?? 0) : "3",
            icon: DollarSign,
            color: "text-green-400",
          },
          { label: "Clients", value: String(clients.length), icon: Users, color: "text-purple-400" },
          {
            label: "Pipeline",
            value: pipelineTotal > 0 ? `$${pipelineTotal.toLocaleString()}` : "--",
            icon: TrendingUp,
            color: "text-amber-400",
          },
          {
            label: "Tools Live",
            value: [googleData.gmail.connected, googleData.calendar.connected, googleData.telegram.connected, googleData.asana.connected, googleData.notion.connected, googleData.discord.connected].filter(Boolean).length + "/6",
            icon: Zap,
            color: "text-cyan-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-xl p-3 text-center">
            <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
            <div className="text-lg font-bold text-white">{value}</div>
            <div className="text-slate-400 text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Wingman Intelligence — cross-tool synthesis */}
      {googleData.gmail.connected && (() => {
        const insights = generateInsights(
          googleData.gmail,
          googleData.calendar.events,
          clients,
          now
        );
        return (
          <div className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 flex items-center gap-2 border-b border-slate-800">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-slate-200 flex-1">Wingman Intelligence</span>
              <span className="text-xs bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                Cross-tool synthesis
              </span>
            </div>
            <div className="px-5 py-4 space-y-2">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${
                    insight.priority === "high"
                      ? "bg-red-500/5 border border-red-500/20"
                      : insight.priority === "medium"
                      ? "bg-amber-500/5 border border-amber-500/20"
                      : "bg-slate-800/40 border border-slate-700/50"
                  }`}
                >
                  <span className="text-base leading-none mt-0.5">{insight.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm leading-snug">{insight.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        insight.priority === "high"
                          ? "text-red-400"
                          : insight.priority === "medium"
                          ? "text-amber-400"
                          : "text-slate-500"
                      }`}
                    >
                      → {insight.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Calm Score + Time */}
      <div className="glass rounded-xl p-5 flex items-center gap-6">
        <svg width="100" height="100" className="shrink-0">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#calmGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          <defs>
            <linearGradient id="calmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <text x="50" y="50" textAnchor="middle" dy=".3em" fill="white" fontSize="18" fontWeight="bold">
            {calmScore}
          </text>
        </svg>
        <div>
          <div className="text-slate-400 text-sm">Calm Score</div>
          <div className="text-white font-semibold text-lg">
            {calmScore >= 80 ? "Optimal" : calmScore >= 60 ? "Good" : "Needs Attention"}
          </div>
          <div className="text-slate-300 text-2xl font-mono mt-2">
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="text-slate-400 text-sm">
            {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
        <button
          onClick={fetchGoogleData}
          disabled={loadingGoogle}
          className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loadingGoogle ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* AI Intelligence Report — collapsed by default, auto-opens when insights are ready */}
      <Section
        title="AI Intelligence Report"
        icon={Brain}
        badge={aiInsights.length > 0 ? `${aiInsights.length} insights · ${MODEL_OPTIONS.find(m => m.id === (aiModelUsed ?? aiModel))?.label ?? aiModelUsed ?? aiModel}` : generatingAI ? "generating…" : undefined}
        defaultOpen={false}
      >
        {/* Model selector */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-slate-500 text-xs shrink-0">Model:</span>
          <div className="relative flex-1 max-w-xs">
            <select
              value={aiModel}
              onChange={(e) => {
                setAiModel(e.target.value);
                localStorage.setItem("ai_model_pref", e.target.value);
              }}
              className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}{m.note ? ` — ${m.note}` : ""}
                </option>
              ))}
            </select>
            <SelectIcon className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {aiInsights.length === 0 && !generatingAI && !aiError && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: "Gmail", on: googleData.gmail.connected },
                { name: "Calendar", on: googleData.calendar.connected },
                { name: "Telegram", on: googleData.telegram.connected },
                { name: "Asana", on: googleData.asana.connected },
                { name: "Notion", on: googleData.notion.connected },
                { name: `${clients.length} Clients`, on: clients.length > 0 },
              ].map(({ name, on }) => (
                <span key={name} className={`text-xs px-2 py-0.5 rounded-full border ${on ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-slate-800 text-slate-600 border-slate-700"}`}>
                  {on ? "✓" : "–"} {name}
                </span>
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              AI synthesizes all connected tools and surfaces cross-tool insights no single app can show.
              Auto-runs on load when Gmail is connected.
            </p>
            <button
              onClick={generateAIReport}
              disabled={!googleData.gmail.connected && !googleData.calendar.connected}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              Generate AI Report
            </button>
            {!googleData.gmail.connected && (
              <p className="text-slate-500 text-xs">Connect at least Gmail to enable AI analysis.</p>
            )}
          </div>
        )}
        {generatingAI && (
          <div className="flex items-center gap-3 py-4">
            <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
            <span className="text-slate-400 text-sm">Analyzing across all tools with {MODEL_OPTIONS.find(m => m.id === aiModel)?.label ?? aiModel}…</span>
          </div>
        )}
        {aiError && (
          <div className="space-y-2">
            <p className="text-red-400 text-sm">{aiError}</p>
            <button onClick={generateAIReport} className="text-purple-400 text-xs hover:underline">Try again</button>
          </div>
        )}
        {aiInsights.length > 0 && (
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className={`rounded-lg px-4 py-3 space-y-1.5 ${insight.priority === "high" ? "bg-red-500/5 border border-red-500/20" : insight.priority === "medium" ? "bg-amber-500/5 border border-amber-500/20" : "bg-slate-800/40 border border-slate-700/50"}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded uppercase font-bold tracking-wide ${insight.type === "revenue" ? "bg-green-500/20 text-green-400" : insight.type === "risk" ? "bg-red-500/20 text-red-400" : insight.type === "client" ? "bg-purple-500/20 text-purple-400" : insight.type === "opportunity" ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-700 text-slate-400"}`}>
                    {insight.type}
                  </span>
                  <span className={`text-xs font-medium ${insight.priority === "high" ? "text-red-400" : insight.priority === "medium" ? "text-amber-400" : "text-slate-500"}`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-slate-200 text-sm leading-snug">{insight.text}</p>
                <p className="text-slate-400 text-xs">→ {insight.action}</p>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-1">
              <button onClick={generateAIReport} disabled={generatingAI} className="text-slate-500 hover:text-purple-400 text-xs flex items-center gap-1 transition-colors">
                <RefreshCw className={`w-3 h-3 ${generatingAI ? "animate-spin" : ""}`} />
                Refresh
              </button>
              {aiModelUsed && (
                <span className="text-slate-600 text-xs">via {MODEL_OPTIONS.find(m => m.id === aiModelUsed)?.label ?? aiModelUsed}</span>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* Morning Brief */}
      <Section title="Morning Brief" icon={Brain} badge="AI">
        {googleData.gmail.geminiSummary ? (
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
            <div className="text-xs text-slate-500">{googleData.gmail.geminiSummary.date}</div>
            <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {stripHtml(googleData.gmail.geminiSummary.body)}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {PRIORITIES.map((p) => (
              <div key={p.text} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    p.urgency === "red"
                      ? "bg-red-400"
                      : p.urgency === "amber"
                      ? "bg-amber-400"
                      : "bg-green-400"
                  }`}
                />
                <span className="text-slate-300 text-sm">{p.text}</span>
              </div>
            ))}
            {!googleData.gmail.connected && (
              <a
                href="/api/auth/google"
                className="mt-3 flex items-center gap-2 text-purple-400 text-sm hover:text-purple-300 transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" />
                Connect Gmail for AI email digest
              </a>
            )}
          </div>
        )}
      </Section>

      {/* Schedule */}
      <Section title="Schedule" icon={Calendar}>
        {googleData.calendar.connected && googleData.calendar.events.length > 0 ? (
          <div className="space-y-2">
            {googleData.calendar.events.map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-slate-200 text-sm font-medium">{e.title}</div>
                  <div className="text-slate-500 text-xs">
                    {formatTime(e.start)} — {formatTime(e.end)}
                    {e.location && ` · ${e.location}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-400 text-sm">
            {googleData.calendar.connected ? "No events today." : "Connect Google Calendar to see your schedule."}
            {!googleData.calendar.connected && (
              <a
                href="/api/auth/google"
                className="ml-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                Connect now
              </a>
            )}
          </div>
        )}
      </Section>

      {/* Inbox */}
      <Section title="Priority Inbox" icon={Mail} badge={googleData.gmail.importantCount ? String(googleData.gmail.importantCount) : undefined}>
        {googleData.gmail.connected && googleData.gmail.importantMessages?.length ? (
          <div className="space-y-3">
            {googleData.gmail.importantMessages.map((msg) => (
              <div key={msg.id} className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-slate-200 text-sm font-medium leading-snug">{msg.subject}</div>
                  {msg.date && (
                    <span className="text-slate-600 text-xs shrink-0 mt-0.5">
                      {(() => {
                        try {
                          const d = new Date(msg.date);
                          const isToday = d.toDateString() === new Date().toDateString();
                          return isToday
                            ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : d.toLocaleDateString([], { month: "short", day: "numeric" });
                        } catch { return msg.date; }
                      })()}
                    </span>
                  )}
                </div>
                <div className="text-slate-400 text-xs">{msg.from}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{msg.snippet}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-400 text-sm">
            {googleData.gmail.connected ? "Inbox zero! You are clear." : "Connect Gmail to see priority messages."}
          </div>
        )}
      </Section>

      {/* Client Pipeline */}
      <Section title="Client Pipeline" icon={Users} badge={String(clients.length)}>
        {clients.length === 0 ? (
          <div className="text-slate-400 text-sm">No clients yet. Start onboarding.</div>
        ) : (
          <div className="space-y-1">
            {clients.slice(0, 5).map((c) => (
              <Link
                key={c.session_id}
                href={`/shadow?client=${c.session_id}`}
                className="flex items-center gap-3 py-2 px-2 -mx-2 border-b border-slate-800 last:border-0 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {(c.business_name ?? "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200 text-sm font-medium truncate group-hover:text-purple-300 transition-colors">
                    {c.business_name ?? "Unnamed"}
                  </div>
                  <div className="text-slate-500 text-xs truncate">{c.email ?? ""}</div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                    c.status === "complete"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {c.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Automation Health */}
      <Section
        title="Automation Stack"
        icon={Zap}
        badge={`${AUTOMATIONS.filter(a => a.status === "live").length} live`}
        defaultOpen={false}
      >
        <div className="space-y-2">
          {AUTOMATIONS.map((a) => (
            <div key={a.name} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${a.status === "live" ? "bg-green-400" : a.status === "partial" ? "bg-amber-400" : "bg-slate-600"}`} />
              <span className="text-slate-300 text-sm flex-1">{a.name}</span>
              <span className={`text-xs ${a.status === "live" ? "text-green-500" : a.status === "partial" ? "text-amber-500" : "text-slate-600"}`}>
                {a.status === "live" ? "live" : a.status === "partial" ? "partial" : "planned"}
              </span>
              <span className="text-slate-700 text-xs hidden sm:block">{a.tool}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Decision Queue — AI-powered via Grok 3 */}
      <Section title="Decision Queue" icon={AlertCircle} badge={decisionModel ? `via ${MODEL_OPTIONS.find(m => m.id === decisionModel)?.label ?? decisionModel}` : undefined} defaultOpen={false}>
        <div className="space-y-3">
          <div className="space-y-2">
            {decisions.map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <span className="text-slate-300 text-sm">{d}</span>
              </div>
            ))}
          </div>
          <button
            onClick={fetchDecisions}
            disabled={loadingDecisions}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-400 text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loadingDecisions ? "animate-spin" : ""}`} />
            {loadingDecisions ? "Asking Grok 3…" : "Regenerate with AI"}
          </button>
        </div>
      </Section>

      {/* Telegram */}
      <Section
        title="Telegram"
        icon={Zap}
        badge={googleData.telegram.connected ? `${googleData.telegram.chats.length} chats` : undefined}
        defaultOpen={false}
      >
        {googleData.telegram.connected && googleData.telegram.chats.length > 0 ? (
          <div className="space-y-4">
            {googleData.telegram.chats.map((chat) => (
              <div key={chat.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-sm font-medium">{chat.title}</span>
                  <span className="text-slate-600 text-xs capitalize">{chat.type}</span>
                </div>
                {chat.messages.slice(0, 3).map((msg, i) => (
                  <div key={i} className="bg-slate-800/40 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${msg.isBot ? "text-cyan-400" : "text-purple-400"}`}>
                        {msg.isBot ? "🤖" : "👤"} {msg.sender}
                      </span>
                      <span className="text-slate-600 text-xs">{msg.date} {msg.time}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-400 text-sm">
              Connect Telegram to pull in messages from your groups and channels — feeds into AI cross-tool synthesis.
            </p>
            <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 space-y-1.5">
              <p className="text-slate-300 font-medium">Setup (3 min):</p>
              <p>1. Open @BotFather in Telegram → <code className="text-purple-300">/newbot</code> → follow prompts → copy the token</p>
              <p>2. Add the bot to your group/channel as admin</p>
              <p>3. Get your chat ID: message the bot, then visit <code className="text-purple-300">api.telegram.org/bot&#123;TOKEN&#125;/getUpdates</code> — find <code className="text-purple-300">&quot;chat&quot;:&#123;&quot;id&quot;:-100...&#125;</code></p>
              <p>4. Vercel env: <code className="text-purple-300">TELEGRAM_BOT_TOKEN=your-token</code></p>
              <p className="text-slate-500">Optional: <code className="text-purple-300">TELEGRAM_CHAT_IDS</code> (comma-separated) — filters to specific chats</p>
            </div>
          </div>
        )}
      </Section>

      {/* WhatsApp */}
      <Section title="WhatsApp" icon={Zap} defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
              Ready to connect
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Pull WhatsApp Business messages into the AI synthesis — see client conversations alongside emails and Telegram.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 space-y-1.5">
            <p className="text-slate-300 font-medium">Setup via Meta Cloud API:</p>
            <p>1. Create a Meta Developer account at <code className="text-purple-300">developers.facebook.com</code></p>
            <p>2. Create an App → Add WhatsApp product → Set up WhatsApp Business</p>
            <p>3. Generate a permanent System User token in Business Settings → Users → System Users</p>
            <p>4. Get your Phone Number ID from the WhatsApp dashboard</p>
            <p>5. Vercel env: <code className="text-purple-300">WHATSAPP_TOKEN=your-token</code> + <code className="text-purple-300">WHATSAPP_PHONE_NUMBER_ID=your-id</code></p>
            <p className="text-slate-500">Note: Meta Cloud API requires a verified Business account for production use.</p>
          </div>
        </div>
      </Section>

      {/* Asana */}
      <Section
        title="Asana"
        icon={CheckCircle}
        badge={googleData.asana.connected ? `${googleData.asana.summary?.open ?? 0} open` : undefined}
        defaultOpen={false}
      >
        {googleData.asana.connected && googleData.asana.tasks.length > 0 ? (
          <div className="space-y-3">
            {googleData.asana.summary && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Open", value: googleData.asana.summary.open, color: "text-amber-400" },
                  { label: "Overdue", value: googleData.asana.summary.overdue, color: "text-red-400" },
                  { label: "Done", value: googleData.asana.summary.completed, color: "text-green-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-800/40 rounded-lg p-2 text-center">
                    <div className={`text-lg font-bold ${color}`}>{value}</div>
                    <div className="text-slate-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-1.5">
              {googleData.asana.tasks
                .filter((t) => !t.completed)
                .slice(0, 6)
                .map((task) => {
                  const isOverdue = task.due_on && new Date(task.due_on) < new Date();
                  return (
                    <div key={task.gid} className="flex items-start gap-2 py-1.5 border-b border-slate-800 last:border-0">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isOverdue ? "bg-red-400" : "bg-amber-400"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-sm truncate">{task.name}</p>
                        {task.projects?.[0] && (
                          <p className="text-slate-500 text-xs">{task.projects[0].name}</p>
                        )}
                      </div>
                      {task.due_on && (
                        <span className={`text-xs shrink-0 ${isOverdue ? "text-red-400" : "text-slate-500"}`}>
                          {isOverdue ? "OVERDUE" : task.due_on}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-400 text-sm">
              Connect Asana to surface open tasks (even 2024 backlog is useful — the AI will flag what&apos;s been sitting).
            </p>
            <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 space-y-1.5">
              <p className="text-slate-300 font-medium">Setup (1 min):</p>
              <p>1. app.asana.com/0/my-apps → Personal access tokens → Create token</p>
              <p>2. Vercel env: <code className="text-purple-300">ASANA_TOKEN=your-token</code></p>
              <p className="text-slate-500">Optional: <code className="text-purple-300">ASANA_WORKSPACE_GID</code> (auto-detected if not set)</p>
            </div>
          </div>
        )}
      </Section>

      {/* Notion */}
      <Section
        title="Notion"
        icon={Brain}
        badge={googleData.notion.connected ? `${googleData.notion.pages.length} pages` : undefined}
        defaultOpen={false}
      >
        {googleData.notion.connected && googleData.notion.pages.length > 0 ? (
          <div className="space-y-1.5">
            {googleData.notion.pages.slice(0, 8).map((page) => (
              <a
                key={page.id}
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0 hover:bg-white/5 -mx-1 px-1 rounded transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm truncate">{page.title}</p>
                  {page.status && (
                    <span className="text-xs text-slate-500">{page.status}</span>
                  )}
                </div>
                <span className="text-slate-600 text-xs shrink-0">
                  {new Date(page.lastEdited).toLocaleDateString()}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-400 text-sm">
              Connect Notion to surface recently edited pages alongside your other tools.
            </p>
            <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 space-y-1.5">
              <p className="text-slate-300 font-medium">Setup (2 min):</p>
              <p>1. notion.so/my-integrations → New integration → Internal</p>
              <p>2. Copy the <strong>Internal Integration Secret</strong></p>
              <p>3. Share each Notion page/DB with your integration (Share → Invite)</p>
              <p>4. Vercel env: <code className="text-purple-300">NOTION_TOKEN=secret_...</code></p>
            </div>
          </div>
        )}
      </Section>

{/* AI Intelligence Report moved above Morning Brief — see below */}

      {/* Discord Intelligence */}
      {(googleData.discord.connected || true) && (
        <Section title="Discord Intelligence" icon={Zap} defaultOpen={false}>
          {googleData.discord.connected && googleData.discord.channels.length > 0 ? (
            <div className="space-y-4">
              {googleData.discord.channels.map((ch) => (
                <div key={ch.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-sm font-medium">#{ch.name}</span>
                    {ch.topic && <span className="text-slate-500 text-xs truncate">{ch.topic}</span>}
                  </div>
                  {ch.messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="bg-slate-800/40 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium ${msg.isBot ? "text-cyan-400" : "text-purple-400"}`}
                        >
                          {msg.isBot ? "🤖" : "👤"} {msg.author}
                        </span>
                        <span className="text-slate-600 text-xs">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{msg.content}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-400 text-sm">
                Connect Discord to see OpenClaw status updates and channel messages here.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-3 space-y-1.5 text-xs text-slate-400">
                <p className="text-slate-300 font-medium">Setup (2 min):</p>
                <p>1. Go to discord.com/developers → New Application → Bot → Copy token</p>
                <p>2. Add bot to your server with Read Messages permission</p>
                <p>3. Right-click channel → Copy ID (need Developer Mode on)</p>
                <p>4. Add to Vercel: <code className="text-purple-300">DISCORD_BOT_TOKEN</code> + <code className="text-purple-300">DISCORD_CHANNEL_IDS</code></p>
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Tool Connector */}
      <Section title="Tool Connector" icon={Link2} defaultOpen={false}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { name: "Gmail", connected: googleData.gmail.connected, href: "/api/auth/google" },
            { name: "Calendar", connected: googleData.calendar.connected, href: "/api/auth/google" },
            { name: "Telegram", connected: googleData.telegram.connected, href: "#" },
            { name: "WhatsApp", connected: false, href: "#" },
            { name: "Asana", connected: googleData.asana.connected, href: "#" },
            { name: "Notion", connected: googleData.notion.connected, href: "#" },
            { name: "Discord", connected: googleData.discord.connected, href: "#" },
          ].map((tool) => (
            <a
              key={tool.name}
              href={tool.connected ? "#" : tool.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                tool.connected
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-purple-500/50 hover:text-purple-300"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  tool.connected ? "bg-green-400" : "bg-slate-600"
                }`}
              />
              {tool.name}
            </a>
          ))}
        </div>
      </Section>
    </div>
  );

  if (!standalone) return content;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            CEO Command
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Your AI-powered morning intelligence center</p>
        </div>
        {content}
      </div>
    </div>
  );
}
