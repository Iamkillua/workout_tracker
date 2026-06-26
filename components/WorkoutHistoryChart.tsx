"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface WorkoutLog {
  id: string;
  date: string;
  weight?: number | null;
  reps?: number | null;
  sets?: number | null;
  time?: number | null;
  steps?: number | null;
  distance?: number | null;
}

interface Props {
  logs: WorkoutLog[];
  type: string;
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
    <div className="glass" style={{ padding: "10px 14px", minWidth: 150 }}>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 6 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, fontSize: 13, fontWeight: 600 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const axisStyle = {
  tick: { fill: "rgba(255,255,255,0.5)", fontSize: 11 },
  axisLine: { stroke: "rgba(255,255,255,0.1)" },
};

export default function WorkoutHistoryChart({ logs, type }: Props) {
  if (logs.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: 200, color: "rgba(255,255,255,0.35)" }}
      >
        No workout history yet
      </div>
    );
  }

  const fmt = (d: string) => format(new Date(d), "MMM d");

  if (type === "WEIGHTS") {
    const data = logs.map((l) => ({
      date: fmt(l.date),
      "Weight (kg)": l.weight,
      Reps: l.reps,
      Sets: l.sets,
    }));
    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" {...axisStyle} tickLine={false} />
          <YAxis yAxisId="w" orientation="left" {...axisStyle} tickLine={false} width={40} />
          <YAxis yAxisId="r" orientation="right" {...axisStyle} tickLine={false} width={35} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }} />
          <Line yAxisId="w" type="monotone" dataKey="Weight (kg)" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }} />
          <Line yAxisId="r" type="monotone" dataKey="Reps" stroke="#34d399" strokeWidth={2.5} dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }} />
          <Line yAxisId="r" type="monotone" dataKey="Sets" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 4, fill: "#60a5fa", strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "BODYWEIGHT") {
    const data = logs.map((l) => ({
      date: fmt(l.date),
      Reps: l.reps,
      Sets: l.sets,
    }));
    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" {...axisStyle} tickLine={false} />
          <YAxis {...axisStyle} tickLine={false} width={35} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }} />
          <Bar dataKey="Reps" fill="#a78bfa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Sets" fill="#34d399" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "TREADMILL") {
    const data = logs.map((l) => ({
      date: fmt(l.date),
      "Time (min)": l.time,
      "Distance (km)": l.distance,
      Steps: l.steps,
    }));
    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" {...axisStyle} tickLine={false} />
          <YAxis yAxisId="t" orientation="left" {...axisStyle} tickLine={false} width={40} />
          <YAxis yAxisId="d" orientation="right" {...axisStyle} tickLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }} />
          <Line yAxisId="t" type="monotone" dataKey="Time (min)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} />
          <Line yAxisId="d" type="monotone" dataKey="Distance (km)" stroke="#34d399" strokeWidth={2.5} dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }} />
          <Line yAxisId="t" type="monotone" dataKey="Steps" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 4, fill: "#60a5fa", strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // CYCLING
  const data = logs.map((l) => ({
    date: fmt(l.date),
    "Time (min)": l.time,
    "Distance (km)": l.distance,
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="date" {...axisStyle} tickLine={false} />
        <YAxis yAxisId="t" orientation="left" {...axisStyle} tickLine={false} width={40} />
        <YAxis yAxisId="d" orientation="right" {...axisStyle} tickLine={false} width={40} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }} />
        <Line yAxisId="t" type="monotone" dataKey="Time (min)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} />
        <Line yAxisId="d" type="monotone" dataKey="Distance (km)" stroke="#34d399" strokeWidth={2.5} dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
