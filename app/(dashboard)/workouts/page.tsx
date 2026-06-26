"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dumbbell,
  Plus,
  Zap,
  Activity,
  Bike,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

interface Workout {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  logs: { date: string }[];
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

const typeLabel: Record<string, string> = {
  WEIGHTS: "Weights / Machines",
  BODYWEIGHT: "Bodyweight",
  TREADMILL: "Treadmill",
  CYCLING: "Cycling",
};

const typeGroups = ["WEIGHTS", "BODYWEIGHT", "TREADMILL", "CYCLING"];

export default function WorkoutsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/workouts")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setWorkouts(data);
          setLoading(false);
        });
    }
  }, [status, router]);

  async function deleteWorkout(id: string) {
    if (!confirm("Delete this workout and all its history?")) return;
    setDeletingId(id);
    await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    setDeletingId(null);
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">My Workouts</h1>
        <Link href="/workouts/new">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Workout
          </button>
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="glass p-12 flex flex-col items-center gap-4 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.15)" }}
          >
            <Dumbbell size={28} style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">No workouts yet</p>
            <p className="text-white/50 text-sm mt-1">
              Add your first workout to start tracking
            </p>
          </div>
          <Link href="/workouts/new">
            <button className="btn-primary">Add your first workout</button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {typeGroups.map((type) => {
            const group = workouts.filter((w) => w.type === type);
            if (group.length === 0) return null;
            const Icon = typeIcon[type];
            const color = typeColors[type];

            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: `${color}20` }}
                  >
                    <Icon size={13} style={{ color }} />
                  </div>
                  <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                    {typeLabel[type]}
                  </h2>
                  <span
                    className="badge"
                    style={{
                      background: `${color}15`,
                      color: `${color}99`,
                      fontSize: 11,
                    }}
                  >
                    {group.length}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.map((w) => {
                    const lastLog = w.logs[0];
                    return (
                      <div
                        key={w.id}
                        className="glass-hover relative group"
                        style={{ padding: 0 }}
                      >
                        <Link href={`/workouts/${w.id}`}>
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${color}20` }}
                              >
                                <Icon size={18} style={{ color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">
                                  {w.name}
                                </p>
                                <p
                                  className="text-xs mt-0.5"
                                  style={{ color: "rgba(255,255,255,0.4)" }}
                                >
                                  {lastLog
                                    ? `Last: ${format(new Date(lastLog.date), "MMM d, yyyy")}`
                                    : "No logs yet"}
                                </p>
                                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                                  {w.logs.length} session{w.logs.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <ChevronRight
                                size={16}
                                className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 mt-0.5"
                              />
                            </div>
                          </div>
                        </Link>

                        {/* Delete button — always visible on touch, hover-only on desktop */}
                        <button
                          onClick={() => deleteWorkout(w.id)}
                          disabled={deletingId === w.id}
                          className="absolute top-3 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 rounded-lg"
                          style={{
                            color: "#f87171",
                            background: "rgba(239,68,68,0.1)",
                            minHeight: "unset",
                          }}
                          title="Delete workout"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
