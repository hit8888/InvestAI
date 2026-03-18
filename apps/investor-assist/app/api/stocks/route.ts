import { NextRequest, NextResponse } from "next/server";
import { resolveStockTicker } from "@/lib/groq";
import { resolveAndFetchStock } from "@/lib/stocks";

export async function POST(req: NextRequest) {
  try {
    const { query } = (await req.json()) as { query: string };
    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const trimmedQuery = query.trim();

    // Try to resolve ticker via LLM (helps when user enters company name)
    const resolved = await resolveStockTicker(trimmedQuery);

    // Fetch live price from Yahoo Finance.
    // If LLM resolution fails (e.g., malformed JSON / missing API key), fall back
    // to treating the input as a ticker (e.g., "NBIS").
    const stock = resolved
      ? await resolveAndFetchStock(trimmedQuery, resolved.ticker, resolved.name)
      : await resolveAndFetchStock(trimmedQuery);
    if (!stock) {
      return NextResponse.json(
        {
          error: resolved
            ? `Could not fetch price for ${resolved.ticker}`
            : "Stock not found",
        },
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
