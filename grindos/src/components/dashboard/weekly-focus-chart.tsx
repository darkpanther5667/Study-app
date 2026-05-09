"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyPoint } from "@/lib/types";

export function WeeklyFocusChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 0, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          stroke="#94a3b8"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          interval={0}
        />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={28} />
        <Tooltip
          contentStyle={{
            background: "rgba(2,6,23,0.92)",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: "12px",
          }}
        />
        <Bar dataKey="focus" radius={[8, 8, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.day}
              fill={entry.focus > 200 ? "rgba(168,179,198,0.75)" : "rgba(111,122,144,0.75)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
