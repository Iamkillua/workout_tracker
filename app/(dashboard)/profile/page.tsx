"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Scale, TrendingUp, User, Ruler, LogOut } from "lucide-react";
import dynamic from "next/dynamic";

const WeightBMIChart = dynamic(() => import("@/components/WeightBMIChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-white/30 text-sm">
      Loading chart…
    </div>
  ),
});

interface Profile {
  age: number;
  height: number;
  weight: number;
}

interface WeightLog {
  id: string;
  date: string;
  weight: number;
  bmi: number;
}

function calcBMI(weight: number, height: number) {
  const h = height / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
}

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#60a5fa", hint: "Consider increasing caloric intake" };
  if (bmi < 25) return { label: "Normal weight", color: "#34d399", hint: "Maintain your healthy lifestyle!" };
  if (bmi < 30) return { label: "Overweight", color: "#f59e0b", hint: "Focus on cardio and nutrition" };
  return { label: "Obese", color: "#f87171", hint: "Consult a healthcare professional" };
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/profile").then((r) => r.json()),
        fetch("/api/weight-logs").then((r) => r.json()),
      ]).then(([p, logs]) => {
        if (p && !p.error) {
          setProfile(p);
          setAge(String(p.age));
          setHeight(String(p.height));
          setWeight(String(p.weight));
        }
        if (Array.isArray(logs)) setWeightLogs(logs);
        setLoading(false);
      });
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age: parseInt(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save");
    } else {
      setProfile(data);
      setSuccess(true);
      // Refresh weight logs
      fetch("/api/weight-logs")
        .then((r) => r.json())
        .then((logs) => {
          if (Array.isArray(logs)) setWeightLogs(logs);
        });
      setTimeout(() => setSuccess(false), 3000);
    }
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

  const bmi = profile ? calcBMI(profile.weight, profile.height) : null;
  const bmiInfo = bmi ? bmiCategory(bmi) : null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        {/* Sign-out visible on mobile (desktop uses navbar) */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="md:hidden btn-danger flex items-center gap-1.5 text-sm py-2 px-3"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      {/* BMI card */}
      {profile && bmi && bmiInfo && (
        <div
          className="glass p-5 flex items-center gap-5 flex-wrap"
          style={{ borderColor: `${bmiInfo.color}30` }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
            style={{ background: `${bmiInfo.color}15` }}
          >
            <span className="text-xl font-bold" style={{ color: bmiInfo.color }}>
              {bmi}
            </span>
            <span className="text-xs text-white/40">BMI</span>
          </div>
          <div>
            <p className="text-white font-semibold">{bmiInfo.label}</p>
            <p className="text-sm text-white/50 mt-0.5">{bmiInfo.hint}</p>
          </div>
        </div>
      )}

      {/* Update form */}
      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <User size={18} style={{ color: "#a78bfa" }} />
          Your Stats
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5 flex items-center gap-1">
                <User size={13} />
                Age (years)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="glass-input"
                min={1}
                max={150}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5 flex items-center gap-1">
                <Ruler size={13} />
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
                className="glass-input"
                min={50}
                max={300}
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5 flex items-center gap-1">
                <Scale size={13} />
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
                className="glass-input"
                min={1}
                max={500}
                step="0.1"
                required
              />
            </div>
          </div>

          {profile && (
            <p className="text-xs text-white/35">
              Saving will add a new data point to your weight history graph.
            </p>
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

          {success && (
            <p
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                color: "#34d399",
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.2)",
              }}
            >
              Profile updated successfully!
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Saving…" : profile ? "Update profile" : "Save profile"}
            </button>
            {!profile && (
              <p className="text-xs text-white/35">
                Fill in your stats to unlock BMI tracking
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Weight & BMI history chart */}
      <div className="glass p-6">
        <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <TrendingUp size={18} style={{ color: "#34d399" }} />
          Weight &amp; BMI History
        </h2>
        <p className="text-xs text-white/40 mb-4">
          {weightLogs.length} data point{weightLogs.length !== 1 ? "s" : ""}{" "}
          recorded
        </p>
        <WeightBMIChart logs={weightLogs} />
      </div>

      {/* History table */}
      {weightLogs.length > 0 && (
        <div className="glass p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Weight Log History
          </h2>
          <div className="table-wrap scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Date", "Weight (kg)", "BMI", "Category"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 text-white/40 font-medium text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...weightLogs].reverse().map((log) => {
                  const cat = bmiCategory(log.bmi);
                  return (
                    <tr
                      key={log.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td className="py-2.5 px-3 text-white/70">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 text-white font-medium">
                        {log.weight}
                      </td>
                      <td className="py-2.5 px-3 font-medium" style={{ color: cat.color }}>
                        {log.bmi}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className="badge"
                          style={{
                            background: `${cat.color}15`,
                            color: cat.color,
                            border: `1px solid ${cat.color}30`,
                          }}
                        >
                          {cat.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
