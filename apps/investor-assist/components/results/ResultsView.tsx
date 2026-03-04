"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useAnalysisStore } from "@/stores/analysisStore";
import StockResultCard from "./StockResultCard";
import SentimentBadge from "./SentimentBadge";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" },
  }),
};

export default function ResultsView() {
  const { result, articles } = useAnalysisStore();
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Simulation Results
        </h2>
        <p className="text-sm text-gray-500">
          {result.settings.numSimulations.toLocaleString()} simulations ·{" "}
          {result.settings.timeHorizonDays}d horizon ·{" "}
          {format(new Date(result.createdAt), "MMM d, HH:mm")}
        </p>
      </motion.div>

      {/* Market context */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="rounded-xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-5"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Market Context</p>
          <SentimentBadge sentiment={result.overallSentiment} />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {result.marketContext}
        </p>
      </motion.div>

      {/* News sources */}
      {articles.length > 0 && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="rounded-xl bg-white border border-gray-100 p-5"
        >
          <p className="text-sm font-medium text-gray-700 mb-3">
            News Sources ({articles.length})
          </p>
          <div className="space-y-1.5">
            {articles.slice(0, 5).map((a, i) => (
              <a
                key={i}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-brand-600 group"
              >
                <ExternalLink className="h-3 w-3 shrink-0 text-gray-300 group-hover:text-brand-400" />
                <span className="truncate">{a.title}</span>
                <span className="shrink-0 text-gray-400">— {a.source}</span>
              </a>
            ))}
            {articles.length > 5 && (
              <p className="text-xs text-gray-400 pl-5">
                +{articles.length - 5} more articles
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Per-stock results */}
      <div className="space-y-4">
        {result.stocks.map((stockResult, i) => (
          <motion.div
            key={stockResult.ticker}
            custom={i + 3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <StockResultCard result={stockResult} />
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <motion.p
        custom={result.stocks.length + 4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-[11px] text-gray-400 text-center leading-relaxed px-4"
      >
        This analysis is for informational purposes only and does not constitute
        financial advice. Simulated results are probabilistic estimates based on
        AI analysis and do not guarantee future performance.
      </motion.p>
    </div>
  );
}
