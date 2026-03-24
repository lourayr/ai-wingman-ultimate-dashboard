"use client";

import { Suspense } from "react";
import ShadowOpsDashboard from "@/components/ShadowOpsDashboard";

export default function ShadowPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">Loading client data…</div>}>
      <ShadowOpsDashboard />
    </Suspense>
  );
}
