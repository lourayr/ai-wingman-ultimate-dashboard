"use client";

import { Suspense } from "react";
import CEOCommandDashboard from "@/components/CEOCommandDashboard";

export default function CEOPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 p-8">Loading CEO Command...</div>}>
      <CEOCommandDashboard />
    </Suspense>
  );
}
