"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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

interface GoogleData {
  gmail: GmailData;
  calendar: { connected: boolean; events: CalendarEvent[] };
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

const AUTOMATIONS = [
  { name: "Order Router (Make.com)", status: "green" },
  { name: "Client Intake Auto-Processor", status: "amber" },
  { name: "Daily CEO Brief", status: "green" },
  { name: "Shadow Ops Outreach Sequence", status: "amber" },
];

const DECISIONS = [
  "Should I run paid ads for Shadow Operator this week?",
  "Do I need a VA for Treasures fulfillment?",
  "Which GPT gets client-facing first: Strategy or Ghostwriter?",
];

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

export default function CEOCommandDashboard({ standalone = true }: { standalone?: boolean }) {
  const searchParams = useSearchParams();
  const [now, setNow] = useState(new Date());
  const [googleData, setGoogleData] = useState<GoogleData>({
    gmail: { connected: false },
    calendar: { connected: false, events: [] },
  });
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [calmScore, setCalmScore] = useState(72);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchGoogleData = useCallback(async () => {
    setLoadingGoogle(true);
    try {
      const [gmailRes, calRes] = await Promise.all([
        fetch("/api/gmail"),
        fetch("/api/calendar"),
      ]);
      const gmail = await gmailRes.json();
      const calendar = await calRes.json();
      setGoogleData({ gmail, calendar });

      // Update calm score based on data
      let score = 60;
      if (gmail.connected) score += 15;
      if (calendar.connected) score += 10;
      if (!gmail.importantCount || gmail.importantCount < 5) score += 10;
      setCalmScore(Math.min(score, 100));
    } catch {
      // ignore
    } finally {
      setLoadingGoogle(false);
    }
  }, []);

  useEffect(() => {
    fetchGoogleData();
    fetch("/api/onboarding/list")
      .then((r) => r.json())
      .then((d) => { if (d.ok) setClients(d.submissions); })
      .catch(() => {});
  }, [fetchGoogleData]);

  // Re-fetch after Google OAuth callback
  useEffect(() => {
    if (searchParams.get("connected") === "google") {
      fetchGoogleData();
    }
  }, [searchParams, fetchGoogleData]);

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
            value: [googleData.gmail.connected, googleData.calendar.connected].filter(Boolean).length + "/2",
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

      {/* Morning Brief */}
      <Section title="Morning Brief" icon={Brain} badge="AI">
        {googleData.gmail.geminiSummary ? (
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
            <div className="text-xs text-slate-500">{googleData.gmail.geminiSummary.date}</div>
            <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {googleData.gmail.geminiSummary.body}
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
                <div className="text-slate-200 text-sm font-medium">{msg.subject}</div>
                <div className="text-slate-400 text-xs">{msg.from}</div>
                <div className="text-slate-500 text-xs">{msg.snippet}</div>
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
          <div className="space-y-2">
            {clients.slice(0, 5).map((c) => (
              <div key={c.session_id} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {(c.business_name ?? "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200 text-sm font-medium truncate">
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
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Automation Health */}
      <Section title="Automation Health" icon={Zap} defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AUTOMATIONS.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  a.status === "green" ? "bg-green-400" : "bg-amber-400"
                }`}
              />
              <span className="text-slate-300 text-sm">{a.name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Decision Queue */}
      <Section title="Decision Queue" icon={AlertCircle} defaultOpen={false}>
        <div className="space-y-2">
          {DECISIONS.map((d) => (
            <div key={d} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <span className="text-slate-300 text-sm">{d}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Tool Connector */}
      <Section title="Tool Connector" icon={Link2} defaultOpen={false}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { name: "Gmail", connected: googleData.gmail.connected, href: "/api/auth/google" },
            { name: "Google Calendar", connected: googleData.calendar.connected, href: "/api/auth/google" },
            { name: "Slack", connected: false, href: "#" },
            { name: "Notion", connected: false, href: "#" },
            { name: "Stripe", connected: false, href: "#" },
            { name: "HubSpot", connected: false, href: "#" },
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
