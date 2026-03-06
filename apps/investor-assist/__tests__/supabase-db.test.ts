import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase module before importing db functions
vi.mock("../lib/supabase", () => ({
  default: {
    from: vi.fn(),
  },
}));

import supabase from "../lib/supabase";
import { getUserPortfolio, saveStock, deleteStock } from "../lib/supabase-db";
import type { Stock } from "../types";

const mockStock: Stock = {
  ticker: "AAPL",
  name: "Apple Inc.",
  currentPrice: 175,
  currency: "USD",
  exchange: "NASDAQ",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getUserPortfolio", () => {
  it("returns mapped stocks on success", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [
            {
              ticker: "AAPL",
              name: "Apple Inc.",
              current_price: 175,
              currency: "USD",
              exchange: "NASDAQ",
            },
          ],
          error: null,
        }),
      }),
    } as never);

    const result = await getUserPortfolio("user123");
    expect(result).toHaveLength(1);
    expect(result[0].ticker).toBe("AAPL");
    expect(result[0].currentPrice).toBe(175);
  });

  it("returns empty array on Supabase error (does not throw)", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "DB connection failed" },
        }),
      }),
    } as never);

    const result = await getUserPortfolio("user123");
    expect(result).toEqual([]);
  });

  it("returns empty array when data is null", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    } as never);

    const result = await getUserPortfolio("user123");
    expect(result).toEqual([]);
  });
});

describe("saveStock", () => {
  it("does not throw on Supabase error", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      upsert: vi.fn().mockResolvedValue({
        error: { message: "Constraint violation" },
      }),
    } as never);

    await expect(saveStock("user123", mockStock)).resolves.toBeUndefined();
  });

  it("resolves on success", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      upsert: vi.fn().mockResolvedValue({ error: null }),
    } as never);

    await expect(saveStock("user123", mockStock)).resolves.toBeUndefined();
  });
});

describe("deleteStock", () => {
  it("does not throw on Supabase error", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: "Row not found" },
          }),
        }),
      }),
    } as never);

    await expect(deleteStock("user123", "AAPL")).resolves.toBeUndefined();
  });
});
