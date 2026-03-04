"use client";

import { RotateCcw, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useAnalysisStore } from "@/stores/analysisStore";
import StockResultCard from "./StockResultCard";
import SentimentBadge from "./SentimentBadge";

export default function ResultsView() {
  const { result, reset, articles } = useAnalysisStore();
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Simulation Results</h2>
          <p className="text-sm text-gray-500">
            {result.settings.numSimulations.toLocaleString()} simulations ·{" "}
            {result.settings.timeHorizonDays}d horizon ·{" "}
            {format(new Date(result.createdAt), "MMM d, HH:mm")}
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          New Analysis
        </button>
      </div>

      {/* Market context */}
      <div className="rounded-xl bg-white border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Market Context</p>
          <SentimentBadge sentiment={result.overallSentiment} />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{result.marketContext}</p>
      </div>

      {/* News sources */}
      {articles.length > 0 && (
        <div className="rounded-xl bg-white border border-gray-100 p-5">
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
        </div>
      )}

      {/* Per-stock results */}
      <div className="space-y-4">
        {result.stocks.map((stockResult) => (
          <StockResultCard key={stockResult.ticker} result={stockResult} />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-gray-400 text-center leading-relaxed px-4">
        This analysis is for informational purposes only and does not constitute financial advice.
        Simulated results are probabilistic estimates based on AI analysis and do not guarantee
        future performance.
      </p>
    </div>
  );
}
