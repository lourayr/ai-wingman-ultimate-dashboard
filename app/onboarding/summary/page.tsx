"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SummaryEditor from "@/components/SummaryEditor";

function SummaryContent() {
  const searchParams = useSearchParams();
  return <SummaryEditor sessionId={searchParams.get("session")} />;
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">Loading summary…</div>}>
      <SummaryContent />
    </Suspense>
  );
}
