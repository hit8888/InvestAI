import type { LLMAnalysisResult, NewsArticle, Stock } from "../types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getGroqKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set");
  return key;
}

// ─── Stock ticker resolution ──────────────────────────────────────────────────

export async function resolveStockTicker(query: string): Promise<{
  ticker: string;
  name: string;
} | null> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGroqKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            'You are a financial data assistant. Given a company name or partial ticker, return the primary US stock ticker symbol and full company name. Respond with ONLY valid JSON: {"ticker": "AAPL", "name": "Apple Inc."}. If not found, respond with null.',
        },
        { role: "user", content: query },
      ],
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text || text === "null") return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ─── News analysis ────────────────────────────────────────────────────────────

export async function analyzeNewsImpact(
  stocks: Stock[],
  articles: NewsArticle[],
): Promise<LLMAnalysisResult> {
  const stockList = stocks.map((s) => `${s.ticker} (${s.name})`).join(", ");
  const articleSummaries = articles
    .map(
      (a, i) =>
        `[${i + 1}] "${a.title}" — ${a.source} (${a.publishedAt})\n${a.summary}`,
    )
    .join("\n\n");

  const systemPrompt = `You are an expert quantitative financial analyst specializing in event-driven investing and market microstructure.

Analyze the provided news articles and estimate their impact on the specified stocks. Consider:
- Direct business impact (revenue, costs, competition)
- Investor sentiment and behavioral reactions
- Sector contagion and correlation effects
- Historical precedents for similar events
- Short-term (days) vs medium-term dynamics

CRITICAL: In the "reasoning" field, always cite the specific news article (by headline, source, or date) that drives the impact. Do not use vague language like "recent news" or "reports suggest". Name the exact event, who reported it, and explain the precise mechanism linking it to the stock price movement.

Return ONLY a valid JSON object with exactly this structure:
{
  "stocks": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "sentiment": "negative",
      "sentimentScore": -0.65,
      "expectedImpactPct": -2.3,
      "impactRangePct": [-5.1, 0.8],
      "confidence": 0.72,
      "volatilityMultiplier": 1.4,
      "reasoning": "2-3 sentences citing the specific news event (use exact headline or source) and explaining the direct mechanism by which it moves this stock — e.g. 'Reuters reported on [date] that X, which will compress AAPL margins by Y because Z'",
      "keyFactors": ["supply chain disruption", "tariff risk", "demand uncertainty"]
    }
  ],
  "marketContext": "Brief paragraph on broader market context",
  "overallSentiment": "negative",
  "analysisTimestamp": "ISO string"
}

Sentiment values must be one of: very_positive, positive, neutral, negative, very_negative
sentimentScore: float from -1 (very bearish) to +1 (very bullish)
expectedImpactPct: percentage change expected (e.g. -2.3 means -2.3%)
impactRangePct: [pessimistic, optimistic] range for the impact
confidence: 0-1 float representing how confident you are given the news clarity
volatilityMultiplier: 1 = normal, 1.5 = 50% more volatile than usual`;

  const userPrompt = `Portfolio stocks: ${stockList}

News Articles:
${articleSummaries}

Analyze each stock's exposure to these news events. If a stock is not directly mentioned but is in the same sector or correlated, still include it with appropriate lower confidence.`;

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGroqKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) throw new Error("Empty LLM response");

  // Extract JSON even if wrapped in markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/) ?? [
    null,
    text,
  ];
  const jsonText = jsonMatch[1] ?? text;

  try {
    const parsed = JSON.parse(jsonText) as LLMAnalysisResult;
    parsed.analysisTimestamp =
      parsed.analysisTimestamp ?? new Date().toISOString();

    // Ensure all portfolio stocks are present
    for (const stock of stocks) {
      if (!parsed.stocks.find((s) => s.ticker === stock.ticker)) {
        parsed.stocks.push({
          ticker: stock.ticker,
          name: stock.name,
          sentiment: "neutral",
          sentimentScore: 0,
          expectedImpactPct: 0,
          impactRangePct: [-1, 1],
          confidence: 0.3,
          volatilityMultiplier: 1,
          reasoning: "No direct news impact identified for this stock.",
          keyFactors: ["no direct exposure"],
        });
      }
    }

    return parsed;
  } catch (e) {
    throw new Error(
      `Failed to parse LLM response: ${String(e)}\n\nRaw: ${jsonText.slice(0, 500)}`,
    );
  }
}
