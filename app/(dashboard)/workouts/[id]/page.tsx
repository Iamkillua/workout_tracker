"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dumbbell,
  Zap,
  Activity,
  Bike,
  ChevronLeft,
  Plus,
  Download,
  X,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import dynamic from "next/dynamic";

const WorkoutHistoryChart = dynamic(
  () => import("@/components/WorkoutHistoryChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-60 flex items-center justify-center text-white/30 text-sm">
        Loading chart…
      </div>
    ),
  }
);

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

interface Workout {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  logs: WorkoutLog[];
}

const typeIcon: Record<string, React.ElementType> = {
  WEIGHTS: Dumbbell,
  BODYWEIGHT: Zap,
  TREADMILL: Activity,
  CYCLING: Bike,
};
const typeColors: Record<string, string> = {
  WEIGHTS: "#a78bfa",
  BODYWEIGHT: "#34d399",
  TREADMILL: "#f59e0b",
  CYCLING: "#60a5fa",
};

function LogForm({
  type,
  onSave,
  onClose,
}: {
  type: string;
  onSave: (data: Partial<WorkoutLog>) => void;
  onClose: () => void;
}) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [time, setTime] = useState("");
  const [steps, setSteps] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const data: Partial<WorkoutLog> & { date: string } = { date };
    if (type === "WEIGHTS") {
      data.weight = parseFloat(weight);
      data.reps = parseInt(reps);
      data.sets = parseInt(sets);
    } else if (type === "BODYWEIGHT") {
      data.reps = parseInt(reps);
      data.sets = parseInt(sets);
    } else if (type === "TREADMILL") {
      data.time = parseFloat(time);
      data.steps = parseInt(steps);
      data.distance = parseFloat(distance);
    } else if (type === "CYCLING") {
      data.time = parseFloat(time);
      data.distance = parseFloat(distance);
    }
    onSave(data);
    setSaving(false);
  }

  return (
    <div
      className="glass p-5 mb-4"
      style={{ borderColor: "rgba(124,58,237,0.3)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Log Entry</h3>
        <button onClick={onClose} className="text-white/30 hover:text-white/60">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1.5 flex items-center gap-1">
            <Calendar size={13} />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="glass-input"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {type === "WEIGHTS" && (
            <>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  step="0.5"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Reps</label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Sets</label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  min="1"
                  required
                />
              </div>
            </>
          )}

          {type === "BODYWEIGHT" && (
            <>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Reps</label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Sets</label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  min="1"
                  required
                />
              </div>
            </>
          )}

          {type === "TREADMILL" && (
            <>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Time (min)
                </label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  step="0.5"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Steps</label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  step="0.01"
                  min="0"
                />
              </div>
            </>
          )}

          {type === "CYCLING" && (
            <>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Time (min)
                </label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  step="0.5"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="0"
                  className="glass-input"
                  step="0.01"
                  min="0"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save entry"}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch(`/api/workouts/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            router.push("/workouts");
          } else {
            setWorkout(data);
          }
          setLoading(false);
        });
    }
  }, [status, id, router]);

  async function handleSaveLog(data: Partial<WorkoutLog> & { date?: string }) {
    setError("");
    const res = await fetch(`/api/workouts/${id}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      setError(result.error || "Failed to save");
    } else {
      setWorkout((prev) =>
        prev
          ? { ...prev, logs: [...prev.logs, result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }
          : prev
      );
      setShowForm(false);
    }
  }

  function handleExport() {
    window.location.href = `/api/workouts/${id}/export`;
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!workout) return null;

  const Icon = typeIcon[workout.type] || Dumbbell;
  const color = typeColors[workout.type] || "#a78bfa";
  const logsReversed = [...workout.logs].reverse();

  function getLogSummary(log: WorkoutLog) {
    switch (workout!.type) {
      case "WEIGHTS":
        return `${log.weight ?? "?"}kg × ${log.reps ?? "?"} reps × ${log.sets ?? "?"} sets`;
      case "BODYWEIGHT":
        return `${log.reps ?? "?"} reps × ${log.sets ?? "?"} sets`;
      case "TREADMILL":
        return `${log.time ?? "?"} min · ${log.steps ?? "?"} steps · ${log.distance ?? "?"} km`;
      case "CYCLING":
        return `${log.time ?? "?"} min · ${log.distance ?? "?"} km`;
      default:
        return "";
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link href="/workouts">
          <button className="btn-secondary flex items-center gap-1 py-2 px-3 text-sm flex-shrink-0">
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Workouts</span>
          </button>
        </Link>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{workout.name}</h1>
            <span
              className="badge text-xs"
              style={{ background: `${color}15`, color, minHeight: "unset" }}
            >
              {workout.type.charAt(0) + workout.type.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center gap-1.5 text-sm py-2 px-3 flex-shrink-0"
          title="Export CSV"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Add log button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus size={16} />
          Log today&apos;s session
        </button>
      )}

      {/* Log form */}
      {showForm && (
        <LogForm
          type={workout.type}
          onSave={handleSaveLog}
          onClose={() => setShowForm(false)}
        />
      )}

      {error && (
        <p
          className="text-sm px-3 py-2 rounded-lg"
          style={{
            color: "#f87171",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </p>
      )}

      {/* Chart */}
      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          Progress History
        </h2>
        <p className="text-xs text-white/40 mb-4">
          {workout.logs.length} session{workout.logs.length !== 1 ? "s" : ""} logged
        </p>
        <WorkoutHistoryChart logs={workout.logs} type={workout.type} />
      </div>

      {/* Log table */}
      {logsReversed.length > 0 && (
        <div className="glass p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Session Log</h2>
          <div className="table-wrap scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">
                    Date
                  </th>
                  {workout.type === "WEIGHTS" && (
                    <>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Weight</th>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Reps</th>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Sets</th>
                    </>
                  )}
                  {workout.type === "BODYWEIGHT" && (
                    <>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Reps</th>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Sets</th>
                    </>
                  )}
                  {workout.type === "TREADMILL" && (
                    <>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Time (min)</th>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Steps</th>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Distance (km)</th>
                    </>
                  )}
                  {workout.type === "CYCLING" && (
                    <>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Time (min)</th>
                      <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Distance (km)</th>
                    </>
                  )}
                  <th className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">
                    Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                {logsReversed.map((log) => (
                  <tr
                    key={log.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    className="hover:bg-white/[0.02]"
                  >
                    <td className="py-2.5 px-3 text-white/70">
                      {format(new Date(log.date), "MMM d, yyyy")}
                    </td>
                    {workout.type === "WEIGHTS" && (
                      <>
                        <td className="py-2.5 px-3 text-white font-medium">{log.weight ?? "–"} <span className="text-white/30 text-xs">kg</span></td>
                        <td className="py-2.5 px-3 text-white">{log.reps ?? "–"}</td>
                        <td className="py-2.5 px-3 text-white">{log.sets ?? "–"}</td>
                      </>
                    )}
                    {workout.type === "BODYWEIGHT" && (
                      <>
                        <td className="py-2.5 px-3 text-white">{log.reps ?? "–"}</td>
                        <td className="py-2.5 px-3 text-white">{log.sets ?? "–"}</td>
                      </>
                    )}
                    {workout.type === "TREADMILL" && (
                      <>
                        <td className="py-2.5 px-3 text-white">{log.time ?? "–"}</td>
                        <td className="py-2.5 px-3 text-white">{log.steps ?? "–"}</td>
                        <td className="py-2.5 px-3 text-white">{log.distance ?? "–"}</td>
                      </>
                    )}
                    {workout.type === "CYCLING" && (
                      <>
                        <td className="py-2.5 px-3 text-white">{log.time ?? "–"}</td>
                        <td className="py-2.5 px-3 text-white">{log.distance ?? "–"}</td>
                      </>
                    )}
                    <td
                      className="py-2.5 px-3 text-xs"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {getLogSummary(log)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {workout.logs.length === 0 && !showForm && (
        <div className="glass p-8 flex flex-col items-center gap-3 text-center">
          <p className="text-white/50">No sessions logged yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm"
          >
            Log your first session
          </button>
        </div>
      )}
    </div>
  );
}
