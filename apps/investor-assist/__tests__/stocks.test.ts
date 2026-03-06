import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchStockPrice, resolveAndFetchStock } from "../lib/stocks";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("fetchStockPrice", () => {
  it("returns price data for a valid ticker", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          chart: {
            result: [
              {
                meta: {
                  regularMarketPrice: 175.5,
                  currency: "USD",
                  exchangeName: "NASDAQ",
                  longName: "Apple Inc.",
                },
              },
            ],
          },
        }),
      }),
    );

    const result = await fetchStockPrice("AAPL");
    expect(result).toEqual({
      price: 175.5,
      currency: "USD",
      exchange: "NASDAQ",
      name: "Apple Inc.",
    });
  });

  it("returns null when Yahoo Finance returns no result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ chart: { result: null } }),
      }),
    );

    const result = await fetchStockPrice("INVALID");
    expect(result).toBeNull();
  });

  it("returns null on network error (fetch throws)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    const result = await fetchStockPrice("AAPL");
    expect(result).toBeNull();
  });

  it("returns null on timeout (AbortError)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(
        Object.assign(new Error("The operation was aborted"), {
          name: "AbortError",
        }),
      ),
    );

    const result = await fetchStockPrice("AAPL");
    expect(result).toBeNull();
  });

  it("falls back to previousClose if regularMarketPrice is missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          chart: {
            result: [
              {
                meta: {
                  previousClose: 170.0,
                  currency: "USD",
                  exchangeName: "NASDAQ",
                  shortName: "Apple",
                },
              },
            ],
          },
        }),
      }),
    );

    const result = await fetchStockPrice("AAPL");
    expect(result?.price).toBe(170.0);
  });

  it("uses Unknown exchange when exchangeName is missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          chart: {
            result: [{ meta: { regularMarketPrice: 100, currency: "USD" } }],
          },
        }),
      }),
    );

    const result = await fetchStockPrice("XYZ");
    expect(result?.exchange).toBe("Unknown");
  });
});

describe("resolveAndFetchStock", () => {
  it("returns null if price fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    const result = await resolveAndFetchStock("Apple", "AAPL", "Apple Inc.");
    expect(result).toBeNull();
  });

  it("uses resolved ticker and name from LLM", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          chart: {
            result: [
              {
                meta: {
                  regularMarketPrice: 200,
                  currency: "USD",
                  exchangeName: "NYSE",
                  longName: "Some Corp",
                },
              },
            ],
          },
        }),
      }),
    );

    const result = await resolveAndFetchStock("query", "TICKER", "My Company");
    expect(result?.ticker).toBe("TICKER");
    expect(result?.name).toBe("My Company");
  });
});
