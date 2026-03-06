"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useAnalysisStore } from "@/stores/analysisStore";
import { useAuth } from "@/components/auth/AuthProvider";
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
  const { result, articles, portfolio } = useAnalysisStore();
  const { user, signIn } = useAuth();
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Save portfolio prompt — shown only to guests with stocks */}
      {!user && portfolio.length > 0 && (
        <motion.div
          custom={-1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 p-4 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold text-brand-800">
              Sign in to save your portfolio
            </p>
            <p className="text-xs text-brand-600 mt-0.5">
              Your stocks will persist across sessions when you&apos;re signed
              in.
            </p>
          </div>
          <button
            onClick={signIn}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      )}

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
