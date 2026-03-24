"use client";

import { Suspense } from "react";
import SummaryEditor from "@/components/SummaryEditor";

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 p-8">Loading summary...</div>}>
      <SummaryEditor />
    </Suspense>
  );
}
