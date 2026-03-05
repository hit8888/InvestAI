"use client";

import { useState } from "react";
import {
  Rss,
  Link2,
  Newspaper,
  Loader2,
  ExternalLink,
  ChevronLeft,
  Search,
} from "lucide-react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/types";
import { format } from "date-fns";

export default function EventSelector() {
  const {
    portfolio,
    newsSource,
    newsUrl,
    newsTopic,
    articles,
    setNewsSource,
    setNewsUrl,
    setNewsTopic,
    setArticles,
    setStep,
  } = useAnalysisStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchNews() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: newsSource,
          url: newsUrl,
          topic: newsTopic,
          stocks: portfolio,
        }),
      });
      const data = (await res.json()) as {
        articles?: NewsArticle[];
        error?: string;
      };
      if (!res.ok || !data.articles)
        throw new Error(data.error ?? "Failed to fetch news");
      if (data.articles.length === 0)
        throw new Error(
          "No articles found for that topic. Try different keywords.",
        );
      setArticles(data.articles);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  }

  const canFetch =
    newsSource === "latest" ||
    (newsSource === "url" && !!newsUrl.trim()) ||
    (newsSource === "topic" && !!newsTopic.trim());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Select News Event
        </h2>
        <p className="text-sm text-gray-500">
          Choose how to source the news event for analysis.
        </p>
      </div>

      {/* Source toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SourceOption
          active={newsSource === "latest"}
          icon={<Rss className="h-5 w-5" />}
          label="Latest News"
          description="Auto-pull recent news for your stocks"
          onClick={() => {
            setNewsSource("latest");
            setArticles([]);
          }}
        />
        <SourceOption
          active={newsSource === "url"}
          icon={<Link2 className="h-5 w-5" />}
          label="Article URL"
          description="Paste a specific news article link"
          onClick={() => {
            setNewsSource("url");
            setArticles([]);
          }}
        />
        <SourceOption
          active={newsSource === "topic"}
          icon={<Search className="h-5 w-5" />}
          label="Topic"
          description="Search by any news topic or keyword"
          onClick={() => {
            setNewsSource("topic");
            setArticles([]);
          }}
        />
      </div>

      {/* URL input */}
      {newsSource === "url" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Article URL
          </label>
          <input
            type="url"
            value={newsUrl}
            onChange={(e) => setNewsUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}

      {/* Topic input */}
      {newsSource === "topic" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            News Topic
          </label>
          <input
            type="text"
            value={newsTopic}
            onChange={(e) => setNewsTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canFetch && fetchNews()}
            placeholder="e.g. Fed interest rates, AI regulation, oil prices…"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Articles will be shown for your review before analysis runs.
          </p>
        </div>
      )}

      {/* Fetch button */}
      <button
        onClick={fetchNews}
        disabled={loading || !canFetch}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Newspaper className="h-4 w-4" />
        )}
        {loading ? "Fetching…" : "Fetch News"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Articles list + confirmation */}
      {articles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {articles.length} article{articles.length !== 1 ? "s" : ""} found
              {newsSource === "topic" && newsTopic && (
                <span className="text-gray-400 font-normal">
                  {" "}
                  for &ldquo;{newsTopic}&rdquo;
                </span>
              )}
            </p>
            {newsSource === "topic" && (
              <p className="text-xs text-brand-600">
                Looks right? Click Continue →
              </p>
            )}
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {articles.map((article, i) => (
              <ArticleCard key={i} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setStep("portfolio")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {articles.length > 0 && (
          <button
            onClick={() => setStep("simulate")}
            className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}

function SourceOption({
  active,
  icon,
  label,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all",
        active
          ? "border-brand-500 bg-brand-50"
          : "border-gray-100 bg-white hover:border-gray-200",
      )}
    >
      <div className={cn("mb-1", active ? "text-brand-600" : "text-gray-400")}>
        {icon}
      </div>
      <p
        className={cn(
          "text-sm font-medium",
          active ? "text-brand-700" : "text-gray-700",
        )}
      >
        {label}
      </p>
      <p className="text-xs text-gray-500">{description}</p>
    </button>
  );
}

function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-white border border-gray-100">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
          {article.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {article.source} ·{" "}
          {format(new Date(article.publishedAt), "MMM d, HH:mm")}
          {article.relatedTickers.length > 0 && (
            <span className="ml-1">
              ·{" "}
              {article.relatedTickers.map((t) => (
                <span
                  key={t}
                  className="inline-block bg-gray-100 text-gray-600 text-[10px] font-mono px-1 rounded ml-0.5"
                >
                  {t}
                </span>
              ))}
            </span>
          )}
        </p>
        {article.summary && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {article.summary}
          </p>
        )}
      </div>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-gray-300 hover:text-gray-500 mt-0.5"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
