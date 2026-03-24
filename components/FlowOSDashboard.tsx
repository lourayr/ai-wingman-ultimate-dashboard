"use client";

import { useState } from "react";
import { Zap, CheckCircle, Clock, Circle, ChevronRight } from "lucide-react";
import Navigation from "./Navigation";

const FOCUS_BLOCKS = [
  { time: "6:30 AM", label: "Morning Brief", type: "ritual", done: true },
  { time: "8:00 AM", label: "Shadow Operator Outreach (3 leads)", type: "revenue", done: true },
  { time: "10:00 AM", label: "Client Delivery — Wingman Build", type: "delivery", done: false },
  { time: "12:30 PM", label: "Lunch / Recovery", type: "rest", done: false },
  { time: "2:00 PM", label: "Treasures Order Audit", type: "ops", done: false },
  { time: "4:00 PM", label: "AI Income Workshop — Module 3", type: "learning", done: false },
  { time: "6:00 PM", label: "Weekly Clarity Reset Prep", type: "ritual", done: false },
];

const TASK_CATEGORIES = [
  {
    name: "Revenue Actions",
    color: "green",
    tasks: [
      "Book 2 Shadow Operator discovery calls",
      "Send follow-up to 3 warm leads",
      "Publish Wingman case study snippet",
    ],
  },
  {
    name: "Build & Deliver",
    color: "purple",
    tasks: [
      "Complete dashboard Vercel deploy",
      "Set up client #1 GPT session",
      "Document automation workflow",
    ],
  },
  {
    name: "Ops & Maintenance",
    color: "amber",
    tasks: [
      "Review Treasures Bio routing",
      "Clear Gmail to inbox zero",
      "Update pipeline spreadsheet",
    ],
  },
];

const TYPE_COLORS: Record<string, string> = {
  ritual: "bg-purple-500/20 text-purple-400",
  revenue: "bg-green-500/20 text-green-400",
  delivery: "bg-cyan-500/20 text-cyan-400",
  rest: "bg-slate-700 text-slate-400",
  ops: "bg-amber-500/20 text-amber-400",
  learning: "bg-blue-500/20 text-blue-400",
};

export default function FlowOSDashboard({ standalone = true }: { standalone?: boolean }) {
  const [doneTasks, setDoneTasks] = useState<Set<string>>(new Set());

  const toggleTask = (key: string) => {
    setDoneTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const content = (
    <div className="space-y-5">
      {/* Focus Blocks */}
      <div className="glass rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h2 className="font-semibold text-slate-200">Today&apos;s Focus Blocks</h2>
        </div>
        {FOCUS_BLOCKS.map((block) => (
          <div
            key={block.time}
            className={`flex items-center gap-3 py-2 border-b border-slate-800 last:border-0 ${
              block.done ? "opacity-50" : ""
            }`}
          >
            {block.done ? (
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            <span className="text-slate-500 text-sm w-16 shrink-0 font-mono">{block.time}</span>
            <span className="text-slate-200 text-sm flex-1">{block.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[block.type]}`}>
              {block.type}
            </span>
          </div>
        ))}
      </div>

      {/* Task Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TASK_CATEGORIES.map((cat) => (
          <div key={cat.name} className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Zap
                className={`w-4 h-4 ${
                  cat.color === "green"
                    ? "text-green-400"
                    : cat.color === "purple"
                    ? "text-purple-400"
                    : "text-amber-400"
                }`}
              />
              <h3 className="font-semibold text-slate-200 text-sm">{cat.name}</h3>
            </div>
            {cat.tasks.map((task) => {
              const key = `${cat.name}-${task}`;
              const done = doneTasks.has(key);
              return (
                <button
                  key={task}
                  onClick={() => toggleTask(key)}
                  className={`w-full flex items-start gap-2 text-left transition-opacity ${
                    done ? "opacity-40" : ""
                  }`}
                >
                  {done ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                  )}
                  <span className={`text-sm ${done ? "line-through text-slate-500" : "text-slate-300"}`}>
                    {task}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Focus Fortress Note */}
      <div className="glass rounded-xl p-4 border-l-4 border-purple-500">
        <p className="text-slate-300 text-sm">
          <span className="text-purple-400 font-semibold">Focus Fortress: </span>
          One primary task. One revenue action. Everything else is noise.
          If more than 3 priorities appear — stop and compress before proceeding.
        </p>
      </div>
    </div>
  );

  if (!standalone) return content;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Flow OS
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">ADD-aware daily rhythm and task management</p>
        </div>
        {content}
      </div>
    </div>
  );
}
