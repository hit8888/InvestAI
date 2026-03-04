import { NextRequest, NextResponse } from "next/server";
import { resolveStockTicker } from "@/lib/groq";
import { resolveAndFetchStock } from "@/lib/stocks";

export async function POST(req: NextRequest) {
  try {
    const { query } = (await req.json()) as { query: string };
    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Try to resolve ticker via LLM
    const resolved = await resolveStockTicker(query.trim());
    if (!resolved) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    // Fetch live price from Yahoo Finance
    const stock = await resolveAndFetchStock(query, resolved.ticker, resolved.name);
    if (!stock) {
      return NextResponse.json(
        { error: `Could not fetch price for ${resolved.ticker}` },
        { status: 404 },
      );
    }

    return NextResponse.json({ stock });
  } catch (err) {
    console.error("[/api/stocks]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
