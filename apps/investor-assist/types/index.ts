// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface Stock {
  ticker: string;
  name: string;
  currentPrice: number;
  currency: string;
  exchange: string;
}

// ─── News ─────────────────────────────────────────────────────────────────────

export type NewsSource = "latest" | "url";

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary: string;
  relatedTickers: string[];
}

// ─── LLM Analysis ─────────────────────────────────────────────────────────────

export type SentimentLabel = "very_positive" | "positive" | "neutral" | "negative" | "very_negative";

export interface StockAnalysis {
  ticker: string;
  name: string;
  sentiment: SentimentLabel;
  sentimentScore: number;        // -1 to +1
  expectedImpactPct: number;     // e.g. -2.3 means -2.3%
  impactRangePct: [number, number]; // [low, high] percentile range
  confidence: number;            // 0-1
  volatilityMultiplier: number;  // 1 = normal, >1 = more volatile
  reasoning: string;
  keyFactors: string[];
}

export interface LLMAnalysisResult {
  stocks: StockAnalysis[];
  marketContext: string;
  overallSentiment: SentimentLabel;
  analysisTimestamp: string;
}

// ─── Simulation Settings ──────────────────────────────────────────────────────

export interface SimulationSettings {
  numSimulations: number;        // 500 – 10000
  timeHorizonDays: number;       // 1, 3, 7, 30
  baseVolatility: number;        // daily vol, default 0.02
  includeMarketCorrelation: boolean;
  investorClusters: InvestorCluster[];
}

export interface InvestorCluster {
  name: string;
  weight: number;               // 0-1, all must sum to 1
  reactionDelayDays: number;    // how many days until full impact
  noiseMultiplier: number;      // 1 = normal, 2 = twice as noisy
  trendFollowing: number;       // -1 (contrarian) to +1 (momentum)
}

export const DEFAULT_SETTINGS: SimulationSettings = {
  numSimulations: 2000,
  timeHorizonDays: 7,
  baseVolatility: 0.02,
  includeMarketCorrelation: true,
  investorClusters: [
    { name: "Retail",        weight: 0.40, reactionDelayDays: 2, noiseMultiplier: 1.6, trendFollowing: 0.3 },
    { name: "Institutional", weight: 0.35, reactionDelayDays: 0, noiseMultiplier: 0.7, trendFollowing: 0.0 },
    { name: "Momentum",      weight: 0.15, reactionDelayDays: 1, noiseMultiplier: 1.2, trendFollowing: 0.8 },
    { name: "Contrarian",    weight: 0.10, reactionDelayDays: 3, noiseMultiplier: 1.0, trendFollowing: -0.7 },
  ],
};

// ─── Simulation Results ───────────────────────────────────────────────────────

export interface PricePercentiles {
  p5: number;
  p25: number;
  p50: number;   // median
  p75: number;
  p95: number;
}

export interface SimulationResult {
  ticker: string;
  name: string;
  currentPrice: number;

  // Price change % across all simulations
  changePctPercentiles: PricePercentiles;
  // Absolute price levels
  pricePercentiles: PricePercentiles;

  // For histogram
  changePctDistribution: number[]; // array of all final % changes (sampled for performance)

  // Derived
  probPositive: number;           // % of sims with positive outcome
  probNegative: number;
  expectedChangePct: number;      // mean across sims
  volatilityProjection: number;   // annualised vol from sim paths

  // From LLM
  sentiment: SentimentLabel;
  sentimentScore: number;
  confidence: number;
  reasoning: string;
  keyFactors: string[];
}

export interface FullAnalysisResult {
  id: string;
  stocks: SimulationResult[];
  newsArticles: NewsArticle[];
  marketContext: string;
  overallSentiment: SentimentLabel;
  settings: SimulationSettings;
  createdAt: string;
}

// ─── App State ────────────────────────────────────────────────────────────────

export type AppStep = "portfolio" | "news" | "simulate" | "results";

export interface AnalysisState {
  step: AppStep;
  portfolio: Stock[];
  newsSource: NewsSource;
  newsUrl: string;
  articles: NewsArticle[];
  settings: SimulationSettings;
  result: FullAnalysisResult | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}
