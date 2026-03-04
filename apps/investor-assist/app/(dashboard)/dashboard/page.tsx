"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useAnalysisStore } from "@/stores/analysisStore";
import PortfolioInput from "@/components/portfolio/PortfolioInput";
import EventSelector from "@/components/news/EventSelector";
import SimulationPanel from "@/components/simulation/SimulationPanel";
import ResultsView from "@/components/results/ResultsView";
import { cn } from "@/lib/utils";
import type { AppStep } from "@/types";

const STEPS: { id: AppStep; label: string; number: number }[] = [
  { id: "portfolio", label: "Portfolio", number: 1 },
  { id: "news", label: "News", number: 2 },
  { id: "simulate", label: "Simulate", number: 3 },
  { id: "results", label: "Results", number: 4 },
];

export default function DashboardPage() {
  const { step, reset } = useAnalysisStore();

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Sticky New Analysis button */}
      <AnimatePresence>
        {step === "results" && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-5 right-6 z-50"
          >
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-xl active:scale-95 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 text-brand-500" />
              New Analysis
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step indicator */}
      <AnimatePresence>
        {step !== "results" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-8"
          >
            <div className="flex items-center">
              {STEPS.filter((s) => s.id !== "results").map((s, i) => {
                const isActive = s.id === step;
                const isDone =
                  currentStepIndex > STEPS.findIndex((x) => x.id === s.id);

                return (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300",
                            isActive
                              ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-200"
                              : isDone
                                ? "bg-brand-100 text-brand-600"
                                : "bg-white border-2 border-gray-200 text-gray-400",
                          )}
                        >
                          {isDone ? "✓" : s.number}
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="step-ring"
                            className="absolute -inset-1 rounded-full border-2 border-brand-300"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive
                            ? "text-gray-900"
                            : isDone
                              ? "text-brand-600"
                              : "text-gray-400",
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className="flex-1 mx-3 h-px bg-gray-200 overflow-hidden rounded-full">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: isDone ? "100%" : "0%" }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-xl shadow-gray-200/60 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {step === "portfolio" && <PortfolioInput />}
            {step === "news" && <EventSelector />}
            {step === "simulate" && <SimulationPanel />}
            {step === "results" && <ResultsView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
