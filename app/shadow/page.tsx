"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShadowOpsDashboard from "@/components/ShadowOpsDashboard";

// useSearchParams must live inside the Suspense boundary
function ShadowContent() {
  const searchParams = useSearchParams();
  return <ShadowOpsDashboard initialClientId={searchParams.get("client")} />;
}

export default function ShadowPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">Loading…</div>}>
      <ShadowContent />
    </Suspense>
  );
}
