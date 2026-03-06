import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchLatestNews, fetchArticleFromUrl } from "../lib/news";

beforeEach(() => {
  vi.resetAllMocks();
});

const mockRSS = (items: { title: string; date: string }[]) =>
  `<rss><channel>${items
    .map(
      (i) =>
        `<item><title><![CDATA[${i.title}]]></title><link>https://example.com</link><pubDate>${i.date}</pubDate><description></description></item>`,
    )
    .join("")}</channel></rss>`;

describe("fetchLatestNews", () => {
  it("returns merged and deduplicated articles from Yahoo and Google", async () => {
    const yahooXml = mockRSS([
      { title: "Apple hits new high", date: "Mon, 03 Mar 2026 10:00:00 +0000" },
      {
        title: "Market rally continues",
        date: "Mon, 03 Mar 2026 09:00:00 +0000",
      },
    ]);
    const googleXml = `<rss><channel>${[
      {
        title: "Apple hits new high",
        date: "Mon, 03 Mar 2026 10:00:00 +0000",
      }, // duplicate
      {
        title: "Apple earnings beat",
        date: "Mon, 03 Mar 2026 11:00:00 +0000",
      },
    ]
      .map(
        (i) =>
          `<item><title>${i.title}</title><link>https://google.com</link><pubDate>${i.date}</pubDate><description></description></item>`,
      )
      .join("")}</channel></rss>`;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("feeds.finance.yahoo.com"))
          return Promise.resolve({ text: async () => yahooXml });
        if (url.includes("news.google.com"))
          return Promise.resolve({ text: async () => googleXml });
        if (url.includes("newsapi.org"))
          return Promise.resolve({ json: async () => ({ articles: [] }) });
        return Promise.reject(new Error("Unexpected URL"));
      }),
    );

    const results = await fetchLatestNews(["AAPL"], ["Apple Inc."]);
    const titles = results.map((a) => a.title);
    expect(titles).toContain("Apple hits new high");
    expect(titles).toContain("Apple earnings beat");
    // Deduplicated — "Apple hits new high" appears only once
    expect(titles.filter((t) => t === "Apple hits new high")).toHaveLength(1);
  });

  it("returns articles even when Yahoo RSS fails (Google fallback)", async () => {
    // Google News RSS uses plain text titles (no CDATA)
    const googleXml = `<rss><channel><item><title>Reliance Q4 results</title><link>https://news.google.com/1</link><pubDate>Mon, 03 Mar 2026 08:00:00 +0000</pubDate><description></description></item></channel></rss>`;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("feeds.finance.yahoo.com"))
          return Promise.reject(new Error("Yahoo RSS down"));
        if (url.includes("news.google.com"))
          return Promise.resolve({ text: async () => googleXml });
        return Promise.resolve({ json: async () => ({ articles: [] }) });
      }),
    );

    const results = await fetchLatestNews(
      ["RELIANCE.NS"],
      ["Reliance Industries"],
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("Reliance Q4 results");
  });

  it("returns empty array when all sources fail", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("All sources down")),
    );

    const results = await fetchLatestNews(["AAPL"], ["Apple"]);
    expect(results).toEqual([]);
  });

  it("sorts articles newest first", async () => {
    const xml = mockRSS([
      { title: "Old news", date: "Mon, 01 Mar 2026 08:00:00 +0000" },
      { title: "New news", date: "Wed, 05 Mar 2026 08:00:00 +0000" },
      { title: "Middle news", date: "Tue, 03 Mar 2026 08:00:00 +0000" },
    ]);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("feeds.finance.yahoo.com"))
          return Promise.resolve({ text: async () => xml });
        if (url.includes("news.google.com"))
          return Promise.resolve({
            text: async () => "<rss><channel></channel></rss>",
          });
        return Promise.resolve({ json: async () => ({ articles: [] }) });
      }),
    );

    const results = await fetchLatestNews(["AAPL"], ["Apple"]);
    expect(results[0].title).toBe("New news");
    expect(results[results.length - 1].title).toBe("Old news");
  });
});

describe("fetchArticleFromUrl", () => {
  it("extracts title and description from og tags", async () => {
    const html = `<html><head>
      <meta property="og:title" content="Big Market Move" />
      <meta property="og:description" content="Stocks surged today." />
    </head><body></body></html>`;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: async () => html }),
    );

    const article = await fetchArticleFromUrl("https://example.com/article");
    expect(article.title).toBe("Big Market Move");
    expect(article.summary).toContain("Stocks surged today.");
  });

  it("throws on non-OK HTTP response", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: false, status: 404, text: async () => "" }),
    );

    await expect(
      fetchArticleFromUrl("https://example.com/404"),
    ).rejects.toThrow("HTTP 404");
  });

  it("throws on network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    );

    await expect(
      fetchArticleFromUrl("https://unreachable.example.com"),
    ).rejects.toThrow();
  });
});
