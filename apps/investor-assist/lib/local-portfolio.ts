import type { Stock } from "@/types";

const LOCAL_PORTFOLIO_KEY = "investai:temp_portfolio:v1";

export function readLocalPortfolio(): Stock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_PORTFOLIO_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as Stock[];
  } catch {
    return [];
  }
}

export function writeLocalPortfolio(stocks: Stock[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_PORTFOLIO_KEY, JSON.stringify(stocks));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
}

export function clearLocalPortfolio(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LOCAL_PORTFOLIO_KEY);
  } catch {
    // ignore
  }
}

