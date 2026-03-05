import supabase from "./supabase";
import type { Stock } from "@/types";

export async function getUserPortfolio(userId: string): Promise<Stock[]> {
  const { data, error } = await supabase
    .from("portfolio")
    .select("ticker, name, current_price, currency, exchange")
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ticker: row.ticker as string,
    name: row.name as string,
    currentPrice: row.current_price as number,
    currency: row.currency as string,
    exchange: row.exchange as string,
  }));
}

export async function saveStock(userId: string, stock: Stock): Promise<void> {
  const { error } = await supabase.from("portfolio").upsert(
    {
      user_id: userId,
      ticker: stock.ticker,
      name: stock.name,
      current_price: stock.currentPrice,
      currency: stock.currency,
      exchange: stock.exchange,
    },
    { onConflict: "user_id,ticker" },
  );

  if (error) throw error;
}

export async function deleteStock(
  userId: string,
  ticker: string,
): Promise<void> {
  const { error } = await supabase
    .from("portfolio")
    .delete()
    .eq("user_id", userId)
    .eq("ticker", ticker);

  if (error) throw error;
}
