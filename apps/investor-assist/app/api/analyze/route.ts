import { NextRequest, NextResponse } from "next/server";
import { analyzeNewsImpact } from "@/lib/groq";
import { runSimulations } from "@/lib/simulation";
import { nanoid } from "nanoid";
import type { Stock, NewsArticle, SimulationSettings, FullAnalysisResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const {
      stocks,
      articles,
      settings,
    } = (await req.json()) as {
      stocks: Stock[];
      articles: NewsArticle[];
      settings: SimulationSettings;
    };

    if (!stocks?.length) {
      return NextResponse.json({ error: "Stocks are required" }, { status: 400 });
    }
    if (!articles?.length) {
      return NextResponse.json({ error: "News articles are required" }, { status: 400 });
    }

    // Step 1: LLM analysis
    const llmResult = await analyzeNewsImpact(stocks, articles);

    // Step 2: Monte Carlo simulations (runs in Node.js, synchronously)
    const simulationResults = runSimulations(llmResult.stocks, stocks, settings);

    const result: FullAnalysisResult = {
      id: nanoid(),
      stocks: simulationResults,
      newsArticles: articles,
      marketContext: llmResult.marketContext,
      overallSentiment: llmResult.overallSentiment,
      settings,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
