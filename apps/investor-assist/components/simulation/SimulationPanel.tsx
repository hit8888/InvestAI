"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Settings2,
  ChevronDown,
  ChevronUp,
  Play,
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

      setLoading(
        true,
        `Running ${settings.numSimulations.toLocaleString()} simulations…`,
      );

      const data = (await res.json()) as {
        result?: FullAnalysisResult;
        error?: string;
      };
      if (!res.ok || !data.result)
        throw new Error(data.error ?? "Analysis failed");
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SimulationLoadingView
            loadingMessage={loadingMessage}
            numSimulations={settings.numSimulations}
          />
        </motion.div>
      ) : (
        <motion.div
          key="panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Run Simulation
            </h2>
            <p className="text-sm text-gray-500">
              Ready to run {settings.numSimulations.toLocaleString()}{" "}
              simulations across {portfolio.length} stock
              {portfolio.length !== 1 ? "s" : ""} using {articles.length}{" "}
              article{articles.length !== 1 ? "s" : ""}.
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Stocks", value: portfolio.length },
              { label: "Articles", value: articles.length },
              {
                label: "Simulations",
                value: settings.numSimulations.toLocaleString(),
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-4 text-center shadow-sm"
              >
                <p className="text-2xl font-bold bg-gradient-to-br from-brand-600 to-brand-800 bg-clip-text text-transparent">
                  {item.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Advanced settings */}
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

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
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
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Investor Clusters
                      </p>
                      <div className="space-y-2">
                        {settings.investorClusters.map((cluster) => (
                          <div
                            key={cluster.name}
                            className="flex items-center gap-3 text-xs text-gray-600"
                          >
                            <span className="w-24 font-medium">
                              {cluster.name}
                            </span>
                            <span className="text-gray-400">
                              {(cluster.weight * 100).toFixed(0)}% weight
                            </span>
                            <span className="text-gray-400">
                              {cluster.reactionDelayDays}d delay
                            </span>
                            <span
                              className={
                                cluster.trendFollowing > 0
                                  ? "text-green-600"
                                  : cluster.trendFollowing < 0
                                    ? "text-red-600"
                                    : "text-gray-400"
                              }
                            >
                              {cluster.trendFollowing > 0
                                ? "↑ momentum"
                                : cluster.trendFollowing < 0
                                  ? "↓ contrarian"
                                  : "neutral"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep("news")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <motion.button
              onClick={runAnalysis}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white text-sm font-medium shadow-md shadow-brand-200 hover:shadow-lg hover:shadow-brand-200 transition-shadow"
            >
              <Play className="h-4 w-4" />
              Run Simulation
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SimulationLoadingView({
  loadingMessage,
  numSimulations,
}: {
  loadingMessage: string;
  numSimulations: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const duration = 3000;
    const startTime = Date.now();
    let rafId: number;

    const frame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 0.95);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numSimulations));
      if (progress < 0.95) rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [numSimulations]);

  const BAR_HEIGHTS = [0.3, 0.6, 1, 0.45, 0.75, 0.5, 0.9, 0.35, 0.65];

  return (
    <div className="py-12 flex flex-col items-center gap-8">
      {/* Waveform */}
      <div className="flex items-end gap-1.5 h-16">
        {BAR_HEIGHTS.map((h, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full bg-gradient-to-t from-brand-600 to-brand-400"
            style={{ originY: 1 }}
            animate={{
              scaleY: [h, h * 0.3 + 0.7, h * 0.5 + 0.1, 1, h],
            }}
            transition={{
              duration: 1.3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
            initial={{ height: 64 }}
          />
        ))}
      </div>

      {/* Phase label */}
      <div className="text-center space-y-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-medium text-gray-600"
          >
            {loadingMessage}
          </motion.p>
        </AnimatePresence>

        <motion.p
          className="text-4xl font-bold tabular-nums bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {count.toLocaleString()}
        </motion.p>
        <p className="text-xs text-gray-400">simulations processed</p>
      </div>

      {/* Pulse rings */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="h-3 w-3 rounded-full bg-brand-500"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-brand-400"
            style={{ width: 12, height: 12 }}
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 2 + i * 1 }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: i * 0.45,
              ease: "easeOut",
            }}
          />
        ))}
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
