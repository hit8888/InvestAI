"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Settings2,
  ChevronDown,
  ChevronUp,
  Play,
  Loader2,
} from "lucide-react";
import { useAnalysisStore } from "@/stores/analysisStore";
import type { FullAnalysisResult } from "@/types";

export default function SimulationPanel() {
  const {
    portfolio,
    articles,
    settings,
    updateSettings,
    setStep,
    setLoading,
    setError,
    setResult,
    error,
    isLoading,
    loadingMessage,
  } = useAnalysisStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  async function runAnalysis() {
    setLoading(true, "Analyzing news with AI…");
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stocks: portfolio, articles, settings }),
      });

      setLoading(true, `Running ${settings.numSimulations.toLocaleString()} simulations…`);

      const data = (await res.json()) as {
        result?: FullAnalysisResult;
        error?: string;
      };
      if (!res.ok || !data.result) throw new Error(data.error ?? "Analysis failed");
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Run Simulation</h2>
        <p className="text-sm text-gray-500">
          Ready to run {settings.numSimulations.toLocaleString()} simulations across{" "}
          {portfolio.length} stock{portfolio.length !== 1 ? "s" : ""} using{" "}
          {articles.length} article{articles.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Stocks", value: portfolio.length },
          { label: "Articles", value: articles.length },
          { label: "Simulations", value: settings.numSimulations.toLocaleString() },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-white border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Advanced settings toggle */}
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-gray-400" />
            Advanced Settings
          </span>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="px-4 pb-4 pt-1 border-t border-gray-50 space-y-4">
            <SliderField
              label="Number of Simulations"
              value={settings.numSimulations}
              min={500}
              max={10000}
              step={500}
              format={(v) => v.toLocaleString()}
              onChange={(v) => updateSettings({ numSimulations: v })}
            />
            <SliderField
              label="Time Horizon (days)"
              value={settings.timeHorizonDays}
              min={1}
              max={30}
              step={1}
              format={(v) => `${v}d`}
              onChange={(v) => updateSettings({ timeHorizonDays: v })}
            />
            <SliderField
              label="Base Daily Volatility"
              value={settings.baseVolatility}
              min={0.005}
              max={0.06}
              step={0.005}
              format={(v) => `${(v * 100).toFixed(1)}%`}
              onChange={(v) => updateSettings({ baseVolatility: v })}
            />

            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Investor Clusters</p>
              <div className="space-y-2">
                {settings.investorClusters.map((cluster) => (
                  <div key={cluster.name} className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="w-24 font-medium">{cluster.name}</span>
                    <span className="text-gray-400">{(cluster.weight * 100).toFixed(0)}% weight</span>
                    <span className="text-gray-400">{cluster.reactionDelayDays}d delay</span>
                    <span className={cluster.trendFollowing > 0 ? "text-green-600" : cluster.trendFollowing < 0 ? "text-red-600" : "text-gray-400"}>
                      {cluster.trendFollowing > 0 ? "↑ momentum" : cluster.trendFollowing < 0 ? "↓ contrarian" : "neutral"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep("news")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={runAnalysis}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingMessage}
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Run Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-brand-600 font-semibold">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600"
      />
    </div>
  );
}
