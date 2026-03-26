"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OnboardingWizard from "@/components/OnboardingWizard";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const forceNew = searchParams.get("new") === "1";
  return <OnboardingWizard forceNew={forceNew} />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">Loading…</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
