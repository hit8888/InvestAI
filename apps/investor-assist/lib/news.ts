import type { NewsArticle } from "../types";

// ─── Yahoo Finance RSS ────────────────────────────────────────────────────────

async function fetchYahooRSS(ticker: string): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      `https://finance.yahoo.com/rss/headline?s=${ticker}`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 300 } },
    );
    const xml = await res.text();

    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g));
    return items.slice(0, 5).map((match) => {
      const content = match[1];
      const title =
        content.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] ??
        content.match(/<title>(.*?)<\/title>/)?.[1] ??
        "";
      const link = content.match(/<link>(.*?)<\/link>/)?.[1] ?? "";
      const pubDate = content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
      const description =
        content.match(/<description><!\[CDATA\[(.*?)\]\]>/)?.[1] ??
        content.match(/<description>(.*?)<\/description>/)?.[1] ??
        "";

      return {
        title: title.trim(),
        url: link.trim(),
        source: "Yahoo Finance",
        publishedAt: pubDate
          ? new Date(pubDate).toISOString()
          : new Date().toISOString(),
        summary: description
          .replace(/<[^>]+>/g, "")
          .trim()
          .slice(0, 300),
        relatedTickers: [ticker],
      };
    });
  } catch {
    return [];
  }
}

// ─── NewsAPI ──────────────────────────────────────────────────────────────────

async function fetchNewsAPI(
  tickers: string[],
  names: string[],
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  const query = [...names.slice(0, 3), ...tickers.slice(0, 3)].join(" OR ");

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&language=en`,
      { headers: { "X-Api-Key": apiKey }, next: { revalidate: 300 } },
    );
    const data = (await res.json()) as {
      articles?: Array<{
        title: string;
        url: string;
        source: { name: string };
        publishedAt: string;
        description: string | null;
        content: string | null;
      }>;
    };

    return (data.articles ?? []).map((a) => ({
      title: a.title,
      url: a.url,
      source: a.source.name,
      publishedAt: a.publishedAt,
      summary: (a.description ?? a.content ?? "").slice(0, 300),
      relatedTickers: tickers.filter((t) =>
        (a.title + (a.description ?? "")).toUpperCase().includes(t),
      ),
    }));
  } catch {
    return [];
  }
}

// ─── Article URL scraper ──────────────────────────────────────────────────────

export async function fetchArticleFromUrl(url: string): Promise<NewsArticle> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; InvestAI/1.0)" },
  });
  const html = await res.text();

  // Extract title
  const title =
    html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ??
    html.match(/<title>(.*?)<\/title>/)?.[1] ??
    "Article";

  // Extract description/summary
  const description =
    html.match(/<meta property="og:description" content="([^"]+)"/)?.[1] ??
    html.match(/<meta name="description" content="([^"]+)"/)?.[1] ??
    "";

  // Extract main article text (crude but effective)
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);

  // Detect source from URL
  const hostname = new URL(url).hostname.replace("www.", "");

  return {
    title: title.trim(),
    url,
    source: hostname,
    publishedAt: new Date().toISOString(),
    summary: description || bodyText.slice(0, 400),
    relatedTickers: [],
  };
}

// ─── Google News RSS (topic search) ──────────────────────────────────────────

async function fetchGoogleNewsRSS(topic: string): Promise<NewsArticle[]> {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
    });
    const xml = await res.text();

    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g));
    return items
      .slice(0, 12)
      .map((match) => {
        const content = match[1]!;
        const title =
          content
            .match(/<title>(.*?)<\/title>/)?.[1]
            ?.replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"') ?? "";
        const link =
          content.match(/<link\/>(.*?)<\/link>/)?.[1] ??
          content.match(/<link>(.*?)<\/link>/)?.[1] ??
          "";
        const pubDate = content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
        const description =
          content.match(/<description><!\[CDATA\[(.*?)\]\]>/)?.[1] ??
          content.match(/<description>(.*?)<\/description>/)?.[1] ??
          "";
        const source =
          content.match(/<source[^>]*>(.*?)<\/source>/)?.[1] ?? "Google News";

        return {
          title: title.trim(),
          url: link.trim(),
          source: source.trim(),
          publishedAt: pubDate
            ? new Date(pubDate).toISOString()
            : new Date().toISOString(),
          summary: description
            .replace(/<[^>]+>/g, "")
            .trim()
            .slice(0, 300),
          relatedTickers: [],
        };
      })
      .filter((a) => a.title && a.url);
  } catch {
    return [];
  }
}

// ─── Public: fetch news by topic ──────────────────────────────────────────────

export async function fetchNewsByTopic(topic: string): Promise<NewsArticle[]> {
  const [googleResults, newsApiResults] = await Promise.all([
    fetchGoogleNewsRSS(topic),
    (async () => {
      const apiKey = process.env.NEWS_API_KEY;
      if (!apiKey) return [];
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&sortBy=publishedAt&pageSize=10&language=en`,
          { headers: { "X-Api-Key": apiKey }, next: { revalidate: 300 } },
        );
        const data = (await res.json()) as {
          articles?: Array<{
            title: string;
            url: string;
            source: { name: string };
            publishedAt: string;
            description: string | null;
          }>;
        };
        return (data.articles ?? []).map((a) => ({
          title: a.title,
          url: a.url,
          source: a.source.name,
          publishedAt: a.publishedAt,
          summary: (a.description ?? "").slice(0, 300),
          relatedTickers: [],
        }));
      } catch {
        return [];
      }
    })(),
  ]);

  const seen = new Set<string>();
  const unique: NewsArticle[] = [];
  for (const article of [...googleResults, ...newsApiResults]) {
    const key = article.title.slice(0, 40).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  }

  return unique
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 15);
}

// ─── Public: fetch latest news ────────────────────────────────────────────────

export async function fetchLatestNews(
  tickers: string[],
  names: string[],
): Promise<NewsArticle[]> {
  const [yahooResults, newsApiResults] = await Promise.all([
    Promise.all(tickers.map((t) => fetchYahooRSS(t))),
    fetchNewsAPI(tickers, names),
  ]);

  const allArticles = [...yahooResults.flat(), ...newsApiResults];

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const unique: NewsArticle[] = [];
  for (const article of allArticles) {
    const key = article.title.slice(0, 40).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  }

  // Sort by date descending
  return unique
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 15);
}
