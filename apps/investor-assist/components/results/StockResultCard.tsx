"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import type { SimulationResult } from "@/types";
import SentimentBadge from "./SentimentBadge";
import DistributionChart from "./DistributionChart";
import { cn } from "@/lib/utils";

export default function StockResultCard({ result }: { result: SimulationResult }) {
  const [expanded, setExpanded] = useState(false);

  const isPositive = result.expectedChangePct >= 0;
  const changeFmt = (n: number) =>
    `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  const priceFmt = (n: number) => `$${n.toFixed(2)}`;

  const confidencePct = Math.round(result.confidence * 100);
  const confidenceColor =
    confidencePct >= 70 ? "text-emerald-600" :
    confidencePct >= 45 ? "text-amber-600" : "text-red-600";

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-brand-700">
              {result.ticker.slice(0, 2)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-semibold text-gray-900">{result.ticker}</span>
              <SentimentBadge sentiment={result.sentiment} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{result.name}</p>
          </div>
        </div>

        {/* Expected change */}
        <div className="text-right">
          <p
            className={cn(
              "text-xl font-bold",
              isPositive ? "text-emerald-600" : "text-red-600",
            )}
          >
            {changeFmt(result.expectedChangePct)}
          </p>
          <p className="text-xs text-gray-500">expected change</p>
        </div>
      </div>

      {/* Probability bar */}
      <div className="px-5 pb-4">
        <div className="flex gap-px rounded-full overflow-hidden h-2 mb-1.5">
          <div
            className="bg-red-300"
            style={{ width: `${result.probNegative}%` }}
          />
          <div
            className="bg-emerald-300"
            style={{ width: `${result.probPositive}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{result.probNegative.toFixed(0)}% chance down</span>
          <span>{result.probPositive.toFixed(0)}% chance up</span>
        </div>
      </div>

      {/* Price range table */}
      <div className="grid grid-cols-5 gap-px bg-gray-100 mx-5 rounded-lg overflow-hidden mb-4">
        {([
          ["Bearish (5th)", result.pricePercentiles.p5, result.changePctPercentiles.p5],
          ["Low (25th)", result.pricePercentiles.p25, result.changePctPercentiles.p25],
          ["Median", result.pricePercentiles.p50, result.changePctPercentiles.p50],
          ["High (75th)", result.pricePercentiles.p75, result.changePctPercentiles.p75],
          ["Bullish (95th)", result.pricePercentiles.p95, result.changePctPercentiles.p95],
        ] as [string, number, number][]).map(([label, price, pct]) => (
          <div key={label} className="bg-white p-2.5 text-center">
            <p className="text-[10px] text-gray-400 mb-0.5 leading-tight">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{priceFmt(price)}</p>
            <p className={cn("text-[10px] font-medium", pct >= 0 ? "text-emerald-600" : "text-red-600")}>
              {changeFmt(pct)}
            </p>
          </div>
        ))}
      </div>

      {/* Distribution chart */}
      <div className="px-5 pb-4">
        <p className="text-xs text-gray-400 mb-1">Simulation distribution</p>
        <DistributionChart distribution={result.changePctDistribution} />
      </div>

      {/* Technical details toggle */}
      <div className="border-t border-gray-50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Technical details
          </span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-4">
            {/* Confidence + volatility */}
            <div className="grid grid-cols-2 gap-3">
              <MetricBox
                label="Confidence Score"
                value={`${confidencePct}%`}
                valueClass={confidenceColor}
                sub="AI analysis confidence"
              />
              <MetricBox
                label="Volatility Projection"
                value={`${(result.volatilityProjection * 100).toFixed(0)}%`}
                valueClass="text-gray-700"
                sub="Annualised vol (sim)"
              />
              <MetricBox
                label="Sentiment Score"
                value={result.sentimentScore.toFixed(2)}
                valueClass={result.sentimentScore >= 0 ? "text-emerald-600" : "text-red-600"}
                sub="-1 bearish → +1 bullish"
              />
              <MetricBox
                label="Current Price"
                value={`$${result.currentPrice.toFixed(2)}`}
                valueClass="text-gray-700"
                sub="At analysis time"
              />
            </div>

            {/* Key factors */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Key Factors</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keyFactors.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Reasoning */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1.5">Reasoning</p>
              <p className="text-xs text-gray-600 leading-relaxed">{result.reasoning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
  valueClass,
  sub,
}: {
  label: string;
  value: string;
  valueClass: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <p className={cn("text-base font-bold", valueClass)}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}
