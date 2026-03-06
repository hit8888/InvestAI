import { describe, it, expect } from "vitest";
import { runSimulations } from "../lib/simulation";
import type { StockAnalysis, SimulationSettings, Stock } from "../types";

const defaultSettings: SimulationSettings = {
  numSimulations: 500,
  timeHorizonDays: 5,
  baseVolatility: 0.02,
  investorClusters: [
    {
      name: "Retail",
      weight: 0.4,
      reactionDelayDays: 0,
      trendFollowing: 0.3,
      noiseMultiplier: 1.2,
    },
    {
      name: "Institutional",
      weight: 0.6,
      reactionDelayDays: 1,
      trendFollowing: -0.1,
      noiseMultiplier: 0.8,
    },
  ],
};

const mockAnalysis = (
  overrides: Partial<StockAnalysis> = {},
): StockAnalysis => ({
  ticker: "AAPL",
  name: "Apple Inc.",
  sentiment: "neutral",
  sentimentScore: 0,
  expectedImpactPct: 0,
  impactRangePct: [-2, 2],
  confidence: 0.5,
  volatilityMultiplier: 1,
  reasoning: "No news.",
  keyFactors: [],
  ...overrides,
});

const mockStock = (overrides: Partial<Stock> = {}): Stock => ({
  ticker: "AAPL",
  name: "Apple Inc.",
  currentPrice: 100,
  currency: "USD",
  exchange: "NASDAQ",
  ...overrides,
});

describe("runSimulations", () => {
  it("returns one result per stock", () => {
    const results = runSimulations(
      [
        mockAnalysis({ ticker: "AAPL" }),
        mockAnalysis({ ticker: "MSFT", name: "Microsoft" }),
      ],
      [
        mockStock({ ticker: "AAPL" }),
        mockStock({ ticker: "MSFT", name: "Microsoft" }),
      ],
      defaultSettings,
    );
    expect(results).toHaveLength(2);
    expect(results[0].ticker).toBe("AAPL");
    expect(results[1].ticker).toBe("MSFT");
  });

  it("percentiles are in correct order (p5 < p25 < p50 < p75 < p95)", () => {
    const [result] = runSimulations(
      [mockAnalysis()],
      [mockStock()],
      defaultSettings,
    );
    const { p5, p25, p50, p75, p95 } = result.changePctPercentiles;
    expect(p5).toBeLessThanOrEqual(p25);
    expect(p25).toBeLessThanOrEqual(p50);
    expect(p50).toBeLessThanOrEqual(p75);
    expect(p75).toBeLessThanOrEqual(p95);
  });

  it("probPositive + probNegative = 100", () => {
    const [result] = runSimulations(
      [mockAnalysis()],
      [mockStock()],
      defaultSettings,
    );
    expect(result.probPositive + result.probNegative).toBeCloseTo(100, 5);
  });

  it("positive sentiment shifts distribution upward", () => {
    const [bullish] = runSimulations(
      [mockAnalysis({ sentimentScore: 0.8 })],
      [mockStock()],
      defaultSettings,
    );
    const [bearish] = runSimulations(
      [mockAnalysis({ sentimentScore: -0.8 })],
      [mockStock()],
      defaultSettings,
    );
    expect(bullish.expectedChangePct).toBeGreaterThan(
      bearish.expectedChangePct,
    );
    expect(bullish.probPositive).toBeGreaterThan(bearish.probPositive);
  });

  it("falls back to price 100 if stock not found in portfolio", () => {
    const [result] = runSimulations(
      [mockAnalysis({ ticker: "MISSING" })],
      [], // empty portfolio
      defaultSettings,
    );
    expect(result.currentPrice).toBe(100);
  });

  it("higher volatilityMultiplier produces wider spread", () => {
    const [low] = runSimulations(
      [mockAnalysis({ volatilityMultiplier: 0.5 })],
      [mockStock()],
      defaultSettings,
    );
    const [high] = runSimulations(
      [mockAnalysis({ volatilityMultiplier: 3 })],
      [mockStock()],
      defaultSettings,
    );
    const spreadLow =
      low.changePctPercentiles.p95 - low.changePctPercentiles.p5;
    const spreadHigh =
      high.changePctPercentiles.p95 - high.changePctPercentiles.p5;
    expect(spreadHigh).toBeGreaterThan(spreadLow);
  });

  it("does not crash with a single simulation", () => {
    expect(() =>
      runSimulations([mockAnalysis()], [mockStock()], {
        ...defaultSettings,
        numSimulations: 1,
      }),
    ).not.toThrow();
  });
});
