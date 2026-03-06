"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  distribution: number[];
}

export default function DistributionChart({ distribution }: Props) {
  // Build histogram buckets
  const min = Math.min(...distribution);
  const max = Math.max(...distribution);
  const buckets = 30;
  const width = (max - min) / buckets;

  const data: { range: string; count: number; midpoint: number }[] = Array.from(
    { length: buckets },
    (_, i) => ({
      range: `${(min + i * width).toFixed(1)}%`,
      midpoint: min + (i + 0.5) * width,
      count: 0,
    }),
  );

  for (const val of distribution) {
    const idx =
      width === 0
        ? Math.floor(buckets / 2)
        : Math.min(buckets - 1, Math.floor((val - min) / width));
    data[idx].count++;
  }

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
        <XAxis
          dataKey="range"
          tick={{ fontSize: 9, fill: "#9ca3af" }}
          interval={Math.floor(buckets / 5)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={false} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v) => [`${v} simulations`, "Count"]}
          labelFormatter={(l) => `~${l}`}
          contentStyle={{ fontSize: 11, borderRadius: 6 }}
        />
        <ReferenceLine
          x={data.find((d) => d.midpoint >= 0)?.range}
          stroke="#d1d5db"
          strokeDasharray="3 3"
        />
        <Bar dataKey="count" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.midpoint < 0 ? "#fca5a5" : "#86efac"}
              opacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
