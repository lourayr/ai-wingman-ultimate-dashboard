"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CEOCommandDashboard from "@/components/CEOCommandDashboard";

function CEOContent() {
  const searchParams = useSearchParams();
  const connected = searchParams.get("connected");
  return <CEOCommandDashboard connectedParam={connected} />;
}

export default function CEOPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">Loading CEO Command…</div>}>
      <CEOContent />
    </Suspense>
  );
}
