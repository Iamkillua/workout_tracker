"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface WeightLog {
  id: string;
  date: string;
  weight: number;
  bmi: number;
}

interface Props {
  logs: WeightLog[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass"
      style={{ padding: "10px 14px", minWidth: 140 }}
    >
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 6 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, fontSize: 13, fontWeight: 600 }}>
          {entry.name}: {entry.value}
          {entry.name === "Weight" ? " kg" : ""}
        </p>
      ))}
    </div>
  );
};

export default function WeightBMIChart({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: 200, color: "rgba(255,255,255,0.35)" }}
      >
        No weight history yet
      </div>
    );
  }

  const data = logs.map((log) => ({
    date: format(new Date(log.date), "MMM d"),
    Weight: log.weight,
    BMI: log.bmi,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="date"
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          yAxisId="weight"
          orientation="left"
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <YAxis
          yAxisId="bmi"
          orientation="right"
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
        />
        <Line
          yAxisId="weight"
          type="monotone"
          dataKey="Weight"
          stroke="#a78bfa"
          strokeWidth={2.5}
          dot={{ fill: "#a78bfa", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#a78bfa" }}
        />
        <Line
          yAxisId="bmi"
          type="monotone"
          dataKey="BMI"
          stroke="#34d399"
          strokeWidth={2.5}
          dot={{ fill: "#34d399", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#34d399" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
