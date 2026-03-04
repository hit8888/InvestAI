"use client";

import { create } from "zustand";
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
  setNewsSource: (source: NewsSource) => void;
  setNewsUrl: (url: string) => void;
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
  articles: [],
  settings: DEFAULT_SETTINGS,
  result: null,
  isLoading: false,
  loadingMessage: "",
  error: null,
};

export const useAnalysisStore = create<AnalysisState & AnalysisActions>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  addStock: (stock) =>
    set((s) => ({
      portfolio: s.portfolio.find((p) => p.ticker === stock.ticker)
        ? s.portfolio
        : [...s.portfolio, stock],
    })),
  removeStock: (ticker) =>
    set((s) => ({ portfolio: s.portfolio.filter((p) => p.ticker !== ticker) })),
  setNewsSource: (newsSource) => set({ newsSource }),
  setNewsUrl: (newsUrl) => set({ newsUrl }),
  setArticles: (articles) => set({ articles }),
  updateSettings: (patch) =>
    set((s) => ({ settings: { ...s.settings, ...patch } })),
  setLoading: (isLoading, loadingMessage = "") =>
    set({ isLoading, loadingMessage }),
  setError: (error) => set({ error }),
  setResult: (result) => set({ result, step: "results" }),
  reset: () => set(initialState),
}));
