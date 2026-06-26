"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Dumbbell,
  Plus,
  TrendingUp,
  Scale,
  User,
  ChevronRight,
  Zap,
  Bike,
} from "lucide-react";
import { format } from "date-fns";

interface Profile {
  age: number;
  height: number;
  weight: number;
}

interface WorkoutLog {
  date: string;
}

interface Workout {
  id: string;
  name: string;
  type: string;
  logs: WorkoutLog[];
}

function calcBMI(weight: number, height: number) {
  const h = height / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
}

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#60a5fa" };
  if (bmi < 25) return { label: "Normal", color: "#34d399" };
  if (bmi < 30) return { label: "Overweight", color: "#f59e0b" };
  return { label: "Obese", color: "#f87171" };
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/profile").then((r) => r.json()),
        fetch("/api/workouts").then((r) => r.json()),
      ]).then(([p, w]) => {
        if (p && !p.error) setProfile(p);
        if (Array.isArray(w)) setWorkouts(w);
        setLoading(false);
      });
    }
  }, [status, router]);

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

  const bmi = profile ? calcBMI(profile.weight, profile.height) : null;
  const bmiInfo = bmi ? bmiCategory(bmi) : null;
  const recentWorkouts = workouts.slice(0, 6);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayWorkouts = workouts.filter((w) =>
    w.logs.some((l) => format(new Date(l.date), "yyyy-MM-dd") === todayStr)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hey, {session?.user?.name} 👋
          </h1>
          <p className="text-white/50 text-sm mt-0.5">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
        </div>
        {/* Hide the "Log Workout" button on mobile — bottom nav "Log" button covers this */}
        <Link href="/workouts/new" className="hidden sm:block">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Log Workout
          </button>
        </Link>
      </div>

      {/* Profile setup banner */}
      {!profile && (
        <div
          className="glass p-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: "rgba(124, 58, 237, 0.4)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(124, 58, 237, 0.2)" }}
            >
              <User size={18} style={{ color: "#a78bfa" }} />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Set up your profile</p>
              <p className="text-white/50 text-xs">Add your stats to track BMI and progress</p>
            </div>
          </div>
          <Link href="/profile">
            <button className="btn-primary text-sm py-2">
              Set up profile →
            </button>
          </Link>
        </div>
      )}

      {/* Stats row */}
      {profile && bmi && bmiInfo && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Weight",
              value: `${profile.weight} kg`,
              icon: Scale,
              color: "#a78bfa",
            },
            {
              label: "BMI",
              value: bmi.toString(),
              sub: bmiInfo.label,
              icon: TrendingUp,
              color: bmiInfo.color,
            },
            {
              label: "Height",
              value: `${profile.height} cm`,
              icon: User,
              color: "#60a5fa",
            },
            {
              label: "Workouts",
              value: workouts.length.toString(),
              sub: "total",
              icon: Dumbbell,
              color: "#34d399",
            },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}20` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <span className="text-white/50 text-xs font-medium">{label}</span>
              </div>
              <p className="text-xl font-bold text-white">{value}</p>
              {sub && <p className="text-xs mt-0.5" style={{ color }}>{sub}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Today's workouts */}
      {todayWorkouts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
            Today&apos;s Activity
          </h2>
          <div className="flex flex-wrap gap-2">
            {todayWorkouts.map((w) => {
              const Icon = typeIcon[w.type] || Dumbbell;
              const color = typeColors[w.type] || "#a78bfa";
              return (
                <span
                  key={w.id}
                  className="badge"
                  style={{
                    background: `${color}20`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon size={11} className="mr-1" />
                  {w.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Workouts list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            My Workouts
          </h2>
          <Link
            href="/workouts"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
          >
            View all <ChevronRight size={13} />
          </Link>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="glass p-8 flex flex-col items-center gap-3 text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.15)" }}
            >
              <Dumbbell size={22} style={{ color: "#a78bfa" }} />
            </div>
            <p className="text-white/60">No workouts yet</p>
            <Link href="/workouts/new">
              <button className="btn-primary text-sm py-2">
                Add your first workout
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentWorkouts.map((w) => {
              const Icon = typeIcon[w.type] || Dumbbell;
              const color = typeColors[w.type] || "#a78bfa";
              const lastLog = w.logs[0];
              return (
                <Link key={w.id} href={`/workouts/${w.id}`}>
                  <div className="glass-hover p-4 cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}20` }}
                      >
                        <Icon size={17} style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">
                          {w.name}
                        </p>
                        <p className="text-xs" style={{ color: `${color}99` }}>
                          {w.type.charAt(0) + w.type.slice(1).toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-white/35">
                      {lastLog
                        ? `Last: ${format(new Date(lastLog.date), "MMM d, yyyy")}`
                        : "No logs yet"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
