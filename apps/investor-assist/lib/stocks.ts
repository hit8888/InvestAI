import type { Stock } from "../types";

// Uses Yahoo Finance's public chart API — no API key required
export async function fetchStockPrice(ticker: string): Promise<{
  price: number;
  currency: string;
  exchange: string;
  name: string;
} | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 },
      },
    );
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const price: number =
      result.meta?.regularMarketPrice ?? result.meta?.previousClose ?? 0;

    return {
      price,
      currency: result.meta?.currency ?? "USD",
      exchange:
        result.meta?.exchangeName ?? result.meta?.fullExchangeName ?? "Unknown",
      name: result.meta?.longName ?? result.meta?.shortName ?? ticker,
    };
  } catch {
    return null;
  }
}

export async function resolveAndFetchStock(
  query: string,
  resolvedTicker?: string,
  resolvedName?: string,
): Promise<Stock | null> {
  const ticker = resolvedTicker ?? query.toUpperCase();
  const priceData = await fetchStockPrice(ticker);

  if (!priceData) return null;

  return {
    ticker,
    name: resolvedName ?? priceData.name,
    currentPrice: priceData.price,
    currency: priceData.currency,
    exchange: priceData.exchange,
  };
}
