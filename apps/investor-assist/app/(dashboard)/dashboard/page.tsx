"use client";

import { useAnalysisStore } from "@/stores/analysisStore";
import PortfolioInput from "@/components/portfolio/PortfolioInput";
import EventSelector from "@/components/news/EventSelector";
import SimulationPanel from "@/components/simulation/SimulationPanel";
import ResultsView from "@/components/results/ResultsView";
import { cn } from "@/lib/utils";
import type { AppStep } from "@/types";

const STEPS: { id: AppStep; label: string; number: number }[] = [
  { id: "portfolio", label: "Portfolio", number: 1 },
  { id: "news",      label: "News",      number: 2 },
  { id: "simulate",  label: "Simulate",  number: 3 },
  { id: "results",   label: "Results",   number: 4 },
];

export default function DashboardPage() {
  const { step } = useAnalysisStore();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator (hidden on results) */}
      {step !== "results" && (
        <div className="flex items-center gap-0 mb-8">
          {STEPS.filter((s) => s.id !== "results").map((s, i) => {
            const isActive = s.id === step;
            const isDone =
              STEPS.findIndex((x) => x.id === step) >
              STEPS.findIndex((x) => x.id === s.id);

            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors",
                      isActive
                        ? "bg-brand-600 text-white"
                        : isDone
                        ? "bg-brand-100 text-brand-600"
                        : "bg-gray-100 text-gray-400",
                    )}
                  >
                    {isDone ? "✓" : s.number}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      isActive ? "text-gray-900 font-medium" : "text-gray-400",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-3",
                      isDone ? "bg-brand-200" : "bg-gray-100",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step content */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        {step === "portfolio" && <PortfolioInput />}
        {step === "news" && <EventSelector />}
        {step === "simulate" && <SimulationPanel />}
        {step === "results" && <ResultsView />}
      </div>
    </div>
  );
}
