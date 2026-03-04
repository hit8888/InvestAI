/**
 * Monte Carlo simulation engine for stock price impact analysis.
 * Uses Geometric Brownian Motion with investor cluster overlays.
 */

import type {
  SimulationSettings,
  StockAnalysis,
  SimulationResult,
  PricePercentiles,
  Stock,
} from "../types";

// ─── Math helpers ─────────────────────────────────────────────────────────────

function randn(): number {
  // Box-Muller transform for normal distribution
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function percentile(sorted: number[], p: number): number {
  const index = Math.max(0, Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length)));
  return sorted[index];
}

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr: number[], avg: number): number {
  const variance = arr.reduce((sum, x) => sum + (x - avg) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

// ─── Core simulator ───────────────────────────────────────────────────────────

function runStockSimulation(
  stockAnalysis: StockAnalysis,
  currentPrice: number,
  settings: SimulationSettings,
): SimulationResult {
  const {
    numSimulations,
    timeHorizonDays,
    baseVolatility,
    investorClusters,
  } = settings;

  const dt = 1 / 252; // daily step in years
  const T = timeHorizonDays;

  // Convert sentiment score to annual drift
  // sentimentScore is -1 to +1; map to roughly ±50% annualised drift for extreme events
  const annualDrift = stockAnalysis.sentimentScore * 0.5;
  const adjustedVol = baseVolatility * stockAnalysis.volatilityMultiplier;

  const finalChangePcts: number[] = new Array(numSimulations);

  for (let sim = 0; sim < numSimulations; sim++) {
    let price = currentPrice;

    for (let day = 0; day < T; day++) {
      // Weighted cluster contribution for this day
      let clusterDrift = 0;
      let clusterNoise = 0;

      for (const cluster of investorClusters) {
        // Cluster reacts after its delay
        const reacted = day >= cluster.reactionDelayDays;
        const reactionFraction = reacted
          ? Math.min(1, (day - cluster.reactionDelayDays + 1) / 2)
          : 0;

        // Drift contribution: base + trend-following amplification
        const trendAmplifier = 1 + cluster.trendFollowing * stockAnalysis.sentimentScore;
        clusterDrift +=
          cluster.weight * reactionFraction * annualDrift * trendAmplifier;

        // Noise contribution
        clusterNoise +=
          cluster.weight * adjustedVol * cluster.noiseMultiplier * randn();
      }

      // GBM step: dS = S*(mu*dt + sigma*dW)
      const dailyReturn = clusterDrift * dt + Math.sqrt(dt) * clusterNoise;
      price *= Math.exp(dailyReturn - 0.5 * adjustedVol ** 2 * dt);
    }

    finalChangePcts[sim] = ((price - currentPrice) / currentPrice) * 100;
  }

  // Sort for percentile computation
  finalChangePcts.sort((a, b) => a - b);

  const changePctPercentiles: PricePercentiles = {
    p5:  percentile(finalChangePcts, 5),
    p25: percentile(finalChangePcts, 25),
    p50: percentile(finalChangePcts, 50),
    p75: percentile(finalChangePcts, 75),
    p95: percentile(finalChangePcts, 95),
  };

  const toPrice = (pct: number) => currentPrice * (1 + pct / 100);
  const pricePercentiles: PricePercentiles = {
    p5:  toPrice(changePctPercentiles.p5),
    p25: toPrice(changePctPercentiles.p25),
    p50: toPrice(changePctPercentiles.p50),
    p75: toPrice(changePctPercentiles.p75),
    p95: toPrice(changePctPercentiles.p95),
  };

  const avg = mean(finalChangePcts);
  const sd = stddev(finalChangePcts, avg);
  const probPositive = (finalChangePcts.filter((x) => x > 0).length / numSimulations) * 100;
  const probNegative = 100 - probPositive;

  // Annualised vol from simulation spread
  const volatilityProjection = (sd / Math.sqrt(T / 252)) * Math.sqrt(252);

  // Sample max 200 values for histogram to avoid large payloads
  const step = Math.max(1, Math.floor(numSimulations / 200));
  const changePctDistribution = finalChangePcts.filter((_, i) => i % step === 0);

  return {
    ticker: stockAnalysis.ticker,
    name: stockAnalysis.name,
    currentPrice,
    changePctPercentiles,
    pricePercentiles,
    changePctDistribution,
    probPositive,
    probNegative,
    expectedChangePct: avg,
    volatilityProjection,
    sentiment: stockAnalysis.sentiment,
    sentimentScore: stockAnalysis.sentimentScore,
    confidence: stockAnalysis.confidence,
    reasoning: stockAnalysis.reasoning,
    keyFactors: stockAnalysis.keyFactors,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function runSimulations(
  analysisResults: StockAnalysis[],
  portfolio: Stock[],
  settings: SimulationSettings,
): SimulationResult[] {
  return analysisResults.map((analysis) => {
    const stock = portfolio.find((s) => s.ticker === analysis.ticker);
    const currentPrice = stock?.currentPrice ?? 100;
    return runStockSimulation(analysis, currentPrice, settings);
  });
}
