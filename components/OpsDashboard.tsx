import { Settings, Users, TrendingUp, CheckCircle, Clock, Zap, Radio } from "lucide-react";
import Navigation from "./Navigation";
import { getDb } from "@/lib/db";
import Link from "next/link";

async function getClients() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, session_id, business_name, email, status, industry_model, updated_at
      FROM onboarding_submissions
      ORDER BY updated_at DESC
    `;
    return rows;
  } catch {
    return [];
  }
}

async function getOpenClawIntel() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, source, title, content, metadata, created_at
      FROM openclaw_intel
      ORDER BY created_at DESC
      LIMIT 15
    `;
    return rows;
  } catch {
    return [];
  }
}

export default async function OpsDashboard() {
  const clients = await getClients();
  const intelItems = await getOpenClawIntel();

  const total = clients.length;
  const complete = clients.filter((c) => c.status === "complete").length;
  const drafts = total - complete;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Ops Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Internal execution queue — protected</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/onboarding"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Users className="w-4 h-4" />
              New Client
            </Link>
            <a
              href="/api/auth/logout"
              className="flex items-center gap-2 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm hover:border-slate-500 transition-colors"
            >
              Logout
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Clients", value: total, icon: Users, color: "text-purple-400" },
            { label: "Complete", value: complete, icon: CheckCircle, color: "text-green-400" },
            { label: "Drafts", value: drafts, icon: Clock, color: "text-amber-400" },
            {
              label: "Completion Rate",
              value: total > 0 ? `${Math.round((complete / total) * 100)}%` : "0%",
              icon: TrendingUp,
              color: "text-cyan-400",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-xl p-4 text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-slate-400 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="glass rounded-xl p-4">
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-400" />
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/api/onboarding/setup", label: "Run DB Setup", external: true },
              { href: "/api/tokens/setup", label: "Setup Token Table", external: true },
              { href: "/api/intel/setup", label: "Setup OpenClaw Table", external: true },
              { href: "/api/test-db", label: "Test DB", external: true },
              { href: "/api/auth/google", label: "Connect Google", external: true },
            ].map(({ href, label, external }) => (
              <a
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* OpenClaw Intelligence Feed */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h2 className="font-semibold text-slate-200 flex-1">OpenClaw Intelligence Feed</h2>
            <span className="text-xs text-slate-500">{intelItems.length} items</span>
          </div>

          {intelItems.length === 0 ? (
            <div className="p-5 space-y-4">
              <p className="text-slate-400 text-sm">
                No data ingested yet. Configure OpenClaw to push data here via browser relay.
              </p>

              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3 text-sm">
                <p className="text-slate-200 font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  OpenClaw Skill Setup
                </p>
                <p className="text-slate-400 text-xs">
                  Add this skill to OpenClaw. It will browse your tools and POST data to this dashboard automatically.
                  Set <code className="text-purple-300">OPENCLAW_WEBHOOK_KEY</code> in Vercel for auth (optional but recommended).
                </p>
                <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-slate-300 space-y-1 overflow-x-auto">
                  <p className="text-slate-500"># OpenClaw skill — paste into skill editor</p>
                  <p>name: Dashboard Relay</p>
                  <p>trigger: on demand</p>
                  <p>steps:</p>
                  <p>{"  "}1. Browse synthesise.ai/dashboard → copy activity summary</p>
                  <p>{"  "}2. POST to {"{YOUR_VERCEL_URL}"}/api/openclaw/ingest</p>
                  <p>{"     "}body: {"{ source: 'synthesize', title: 'Activity', content: <scraped> }"}</p>
                  <p>{"  "}3. Browse ghostwriteros.ai DNAs page → copy DNA list</p>
                  <p>{"  "}4. POST {"{ source: 'ghostwriteros', title: 'DNAs', content: <scraped> }"}</p>
                  <p>{"  "}5. Browse gamma.ai recent → copy recent decks/activity</p>
                  <p>{"  "}6. POST {"{ source: 'gamma', title: 'Recent', content: <scraped> }"}</p>
                </div>
                <p className="text-slate-500 text-xs">
                  Webhook URL: <code className="text-cyan-400">/api/openclaw/ingest</code> — accepts POST with body {"{ source, title, content, metadata }"}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {intelItems.map((item) => (
                <div key={String(item.id)} className="px-5 py-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                      {String(item.source)}
                    </span>
                    <span className="text-slate-200 text-sm font-medium flex-1 truncate">
                      {String(item.title ?? item.source)}
                    </span>
                    <span className="text-slate-500 text-xs shrink-0">
                      {new Date(String(item.created_at)).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {String(item.content).slice(0, 300)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Client List */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-slate-200">All Client Submissions</h2>
            <span className="ml-auto text-xs text-slate-500">{total} total</span>
          </div>

          {clients.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No submissions yet.{" "}
              <Link href="/onboarding" className="text-purple-400 hover:underline">
                Start onboarding a client
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {clients.map((c) => (
                <Link
                  key={String(c.session_id)}
                  href={`/onboarding/summary?session=${c.session_id}`}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {String(c.business_name ?? "?")[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-200 truncate">
                      {String(c.business_name ?? "Unnamed Business")}
                    </div>
                    <div className="text-slate-400 text-sm truncate">
                      {String(c.email ?? "")}
                    </div>
                    {c.industry_model && (
                      <div className="text-slate-500 text-xs truncate">{String(c.industry_model)}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        c.status === "complete"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {String(c.status)}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(String(c.updated_at)).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-purple-400">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
