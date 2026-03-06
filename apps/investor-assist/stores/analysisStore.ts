"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnalysisState,
  AppStep,
  NewsSource,
  NewsArticle,
  Stock,
  SimulationSettings,
  FullAnalysisResult,
} from "@/types";
import { DEFAULT_SETTINGS } from "@/types";

interface AnalysisActions {
  setStep: (step: AppStep) => void;
  addStock: (stock: Stock) => void;
  removeStock: (ticker: string) => void;
  setPortfolio: (stocks: Stock[]) => void;
  setNewsSource: (source: NewsSource) => void;
  setNewsUrl: (url: string) => void;
  setNewsTopic: (topic: string) => void;
  setArticles: (articles: NewsArticle[]) => void;
  updateSettings: (patch: Partial<SimulationSettings>) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  setResult: (result: FullAnalysisResult) => void;
  reset: () => void;
}

const initialState: AnalysisState = {
  step: "portfolio",
  portfolio: [],
  newsSource: "latest",
  newsUrl: "",
  newsTopic: "",
  articles: [],
  settings: DEFAULT_SETTINGS,
  result: null,
  isLoading: false,
  loadingMessage: "",
  error: null,
};

export const useAnalysisStore = create<AnalysisState & AnalysisActions>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),
      addStock: (stock) =>
        set((s) => ({
          portfolio: s.portfolio.find((p) => p.ticker === stock.ticker)
            ? s.portfolio
            : [...s.portfolio, stock],
        })),
      removeStock: (ticker) =>
        set((s) => ({
          portfolio: s.portfolio.filter((p) => p.ticker !== ticker),
        })),
      setPortfolio: (stocks) => set({ portfolio: stocks }),
      setNewsSource: (newsSource) => set({ newsSource }),
      setNewsUrl: (newsUrl) => set({ newsUrl }),
      setNewsTopic: (newsTopic) => set({ newsTopic }),
      setArticles: (articles) => set({ articles }),
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      setLoading: (isLoading, loadingMessage = "") =>
        set({ isLoading, loadingMessage }),
      setError: (error) => set({ error }),
      setResult: (result) => set({ result, step: "results" }),
      reset: () => set(initialState),
    }),
    {
      name: "neuraltrade-portfolio",
      // Only persist the portfolio — everything else resets on page load
      partialize: (state) => ({ portfolio: state.portfolio }),
    },
  ),
);
