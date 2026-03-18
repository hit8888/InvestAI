"use client";

import { useState, useRef, useEffect, useId } from "react";
import { Plus, X, Search, Loader2, TrendingUp } from "lucide-react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginBanner from "@/components/auth/LoginBanner";
import { getUserPortfolio, saveStock, deleteStock } from "@/lib/supabase-db";
import type { Stock } from "@/types";

type StockSuggestion = {
  ticker: string;
  name: string;
  exchange: string;
};

export default function PortfolioInput() {
  const { portfolio, addStock, removeStock, setPortfolio, setStep } =
    useAnalysisStore();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Load portfolio from Supabase on mount if logged in
  useEffect(() => {
    if (!user) return;
    getUserPortfolio(user.uid).then((stocks) => {
      if (stocks.length > 0) setPortfolio(stocks);
    });
  }, [user, setPortfolio]);

  // Autocomplete suggestions (debounced)
  useEffect(() => {
    const q = query.trim();
    setError(null);

    if (!q) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const handle = window.setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as { results?: StockSuggestion[] };
        const results = data.results ?? [];
        setSuggestions(results);
        setIsSuggestionsOpen(results.length > 0);
        setActiveSuggestionIndex(-1);
      } catch {
        setSuggestions([]);
        setIsSuggestionsOpen(false);
        setActiveSuggestionIndex(-1);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 200);

    return () => window.clearTimeout(handle);
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const el = containerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
        setActiveSuggestionIndex(-1);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  async function handleAdd() {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(-1);

    try {
      const res = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
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

  function selectSuggestion(s: StockSuggestion) {
    setQuery(s.ticker);
    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(-1);
    // Keep focus so user can hit Enter or click Add
    requestAnimationFrame(() => inputRef.current?.focus());
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

      {/* Search input */}
      <div className="flex gap-2" ref={containerRef}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsSuggestionsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsSuggestionsOpen(false);
                setActiveSuggestionIndex(-1);
                return;
              }

              if (!isSuggestionsOpen || suggestions.length === 0) {
                if (e.key === "Enter") handleAdd();
                return;
              }

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveSuggestionIndex((idx) =>
                  Math.min(idx + 1, suggestions.length - 1),
                );
                return;
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveSuggestionIndex((idx) => Math.max(idx - 1, 0));
                return;
              }

              if (e.key === "Enter") {
                e.preventDefault();
                const s = suggestions[activeSuggestionIndex];
                if (s) {
                  selectSuggestion(s);
                } else {
                  handleAdd();
                }
              }
            }}
            placeholder="e.g. Apple, MSFT, Tesla…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isSuggestionsOpen}
            aria-controls={listboxId}
            aria-activedescendant={
              activeSuggestionIndex >= 0
                ? `${listboxId}-${activeSuggestionIndex}`
                : undefined
            }
          />

          {isSuggestionsOpen && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              {suggestionsLoading ? (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching…
                </div>
              ) : (
                <ul id={listboxId} role="listbox" className="max-h-72 overflow-auto">
                  {suggestions.map((s, idx) => {
                    const isActive = idx === activeSuggestionIndex;
                    return (
                      <li
                        key={`${s.ticker}-${s.exchange}-${idx}`}
                        id={`${listboxId}-${idx}`}
                        role="option"
                        aria-selected={isActive}
                        className={[
                          "flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm",
                          isActive ? "bg-brand-50" : "hover:bg-gray-50",
                        ].join(" ")}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectSuggestion(s)}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {s.ticker}
                            </span>
                            {s.exchange && (
                              <span className="text-xs text-gray-400">
                                {s.exchange}
                              </span>
                            )}
                          </div>
                          <div className="truncate text-xs text-gray-500">
                            {s.name}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">↵</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
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
            {stock.currency === "USD" ? "$" : stock.currency}
            {stock.currentPrice.toFixed(2)}
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
