"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Search, Loader2, TrendingUp } from "lucide-react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginBanner from "@/components/auth/LoginBanner";
import { getUserPortfolio, saveStock, deleteStock } from "@/lib/supabase-db";
import type { Stock } from "@/types";

export default function PortfolioInput() {
  const { portfolio, addStock, removeStock, setPortfolio, setStep } =
    useAnalysisStore();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState<"US" | "LSE" | "NSE">("US");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load portfolio from Supabase on mount if logged in
  useEffect(() => {
    if (!user) return;
    getUserPortfolio(user.uid).then((stocks) => {
      if (stocks.length > 0) setPortfolio(stocks);
    });
  }, [user, setPortfolio]);

  async function handleAdd() {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), market }),
      });
      const data = (await res.json()) as { stock?: Stock; error?: string };
      if (!res.ok || !data.stock) throw new Error(data.error ?? "Not found");
      addStock(data.stock);
      if (user) await saveStock(user.uid, data.stock);
      setQuery("");
      inputRef.current?.focus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Stock not found");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(ticker: string) {
    removeStock(ticker);
    if (user) await deleteStock(user.uid, ticker);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Your Portfolio
        </h2>
        <p className="text-sm text-gray-500">
          Enter company names or ticker symbols to add stocks.
        </p>
      </div>

      {!user && <LoginBanner />}

      {/* Market selector */}
      <div className="flex gap-2">
        {(["US", "LSE", "NSE"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMarket(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              market === m
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-brand-400"
            }`}
          >
            {m === "US" ? "🇺🇸 US" : m === "LSE" ? "🇬🇧 London" : "🇮🇳 India NSE"}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={
              market === "US"
                ? "e.g. Apple, MSFT, Tesla…"
                : market === "LSE"
                  ? "e.g. BP, Barclays, Vodafone…"
                  : "e.g. Reliance, TCS, Infosys…"
            }
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!query.trim() || loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add
        </button>
      </div>

      {error && <p className="text-sm text-red-600 -mt-2">{error}</p>}

      {/* Stock cards */}
      {portfolio.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {portfolio.map((stock) => (
            <StockCard
              key={stock.ticker}
              stock={stock}
              onRemove={() => handleRemove(stock.ticker)}
            />
          ))}
        </div>
      )}

      {portfolio.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <TrendingUp className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No stocks added yet</p>
        </div>
      )}

      {/* Continue */}
      {portfolio.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setStep("news")}
            className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

function StockCard({
  stock,
  onRemove,
}: {
  stock: Stock;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center">
          <span className="text-xs font-bold text-brand-700">
            {stock.ticker.slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{stock.ticker}</p>
          <p className="text-xs text-gray-500 truncate max-w-[140px]">
            {stock.name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {stock.currency === "USD"
              ? "$"
              : stock.currency === "GBp"
                ? "p"
                : stock.currency === "GBP"
                  ? "£"
                  : stock.currency === "INR"
                    ? "₹"
                    : stock.currency + " "}
            {(stock.currentPrice ?? 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">{stock.exchange}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
