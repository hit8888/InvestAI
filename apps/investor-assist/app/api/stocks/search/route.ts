import { NextRequest, NextResponse } from "next/server";

type YahooSearchQuote = {
  symbol?: string;
  shortname?: string;
  longname?: string;
  exchange?: string;
  exchDisp?: string;
  quoteType?: string;
  score?: number;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("q") ?? "";
    const q = rawQuery.trim();

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const res = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0&enableFuzzyQuery=true`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const data = (await res.json()) as { quotes?: YahooSearchQuote[] };
    const quotes = data.quotes ?? [];

    const results = quotes
      .filter((x) => (x.quoteType ?? "").toUpperCase() === "EQUITY")
      .filter((x) => !!x.symbol)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .map((x) => ({
        ticker: x.symbol as string,
        name: x.longname ?? x.shortname ?? (x.symbol as string),
        exchange: x.exchDisp ?? x.exchange ?? "",
      }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[/api/stocks/search]", err);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}

