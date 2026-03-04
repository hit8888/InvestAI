import { NextRequest, NextResponse } from "next/server";
import {
  fetchLatestNews,
  fetchArticleFromUrl,
  fetchNewsByTopic,
} from "@/lib/news";
import type { Stock } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { source, url, topic, stocks } = (await req.json()) as {
      source: "latest" | "url" | "topic";
      url?: string;
      topic?: string;
      stocks: Stock[];
    };

    if (!stocks?.length) {
      return NextResponse.json(
        { error: "Stocks are required" },
        { status: 400 },
      );
    }

    if (source === "url") {
      if (!url?.trim()) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }
      const article = await fetchArticleFromUrl(url.trim());
      return NextResponse.json({ articles: [article] });
    }

    if (source === "topic") {
      if (!topic?.trim()) {
        return NextResponse.json(
          { error: "Topic is required" },
          { status: 400 },
        );
      }
      const articles = await fetchNewsByTopic(topic.trim());
      return NextResponse.json({ articles });
    }

    // source === "latest"
    const tickers = stocks.map((s) => s.ticker);
    const names = stocks.map((s) => s.name);
    const articles = await fetchLatestNews(tickers, names);
    return NextResponse.json({ articles });
  } catch (err) {
    console.error("[/api/news]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
