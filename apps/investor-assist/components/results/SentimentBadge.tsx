import { cn } from "@/lib/utils";
import type { SentimentLabel } from "@/types";

const SENTIMENT_CONFIG: Record<
  SentimentLabel,
  { label: string; className: string }
> = {
  very_positive: { label: "Very Bullish", className: "bg-emerald-100 text-emerald-700" },
  positive:      { label: "Bullish",      className: "bg-green-100 text-green-700" },
  neutral:       { label: "Neutral",      className: "bg-gray-100 text-gray-600" },
  negative:      { label: "Bearish",      className: "bg-red-100 text-red-700" },
  very_negative: { label: "Very Bearish", className: "bg-red-200 text-red-800" },
};

export default function SentimentBadge({
  sentiment,
  size = "sm",
}: {
  sentiment: SentimentLabel;
  size?: "xs" | "sm";
}) {
  const config = SENTIMENT_CONFIG[sentiment];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
