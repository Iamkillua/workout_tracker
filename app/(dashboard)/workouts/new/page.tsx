"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Zap, Activity, Bike, ChevronLeft } from "lucide-react";
import Link from "next/link";

const workoutTypes = [
  {
    value: "WEIGHTS",
    label: "Weights / Machines",
    desc: "Dumbbells, barbells, cable machines",
    icon: Dumbbell,
    color: "#a78bfa",
  },
  {
    value: "BODYWEIGHT",
    label: "Bodyweight",
    desc: "Push-ups, sit-ups, pull-ups, etc.",
    icon: Zap,
    color: "#34d399",
  },
  {
    value: "TREADMILL",
    label: "Treadmill",
    desc: "Track time, steps & distance",
    icon: Activity,
    color: "#f59e0b",
  },
  {
    value: "CYCLING",
    label: "Cycling",
    desc: "Track time & distance",
    icon: Bike,
    color: "#60a5fa",
  },
];

export default function NewWorkoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSelectType(type: string) {
    setSelectedType(type);
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Workout name is required");
      return;
    }
    setSaving(true);

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), type: selectedType }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to create workout");
    } else {
      router.push(`/workouts/${data.id}`);
    }
  }

  const selectedTypeInfo = workoutTypes.find((t) => t.value === selectedType);

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="btn-secondary flex items-center gap-1 py-2 px-3 text-sm"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add Workout</h1>
          <p className="text-white/50 text-sm">Step {step} of 2</p>
        </div>
      </div>

      {/* Step 1: Type selection */}
      {step === 1 && (
        <div className="glass p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Choose workout type
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {workoutTypes.map(({ value, label, desc, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => handleSelectType(value)}
                className="flex flex-col items-start gap-2 p-4 rounded-xl text-left transition-all min-h-[100px]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid rgba(255,255,255,0.08)`,
                  minHeight: "unset",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${color}15`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}50`;
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}20` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Name entry */}
      {step === 2 && selectedTypeInfo && (
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${selectedTypeInfo.color}20` }}
            >
              <selectedTypeInfo.icon
                size={20}
                style={{ color: selectedTypeInfo.color }}
              />
            </div>
            <div>
              <p className="text-white font-semibold">{selectedTypeInfo.label}</p>
              <p className="text-white/40 text-xs">{selectedTypeInfo.desc}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">
                Workout name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  selectedType === "WEIGHTS"
                    ? "e.g. Bench Press, Squats…"
                    : selectedType === "BODYWEIGHT"
                    ? "e.g. Push-ups, Pull-ups…"
                    : selectedType === "TREADMILL"
                    ? "e.g. Morning Run, Sprint…"
                    : "e.g. Cycling Session…"
                }
                className="glass-input"
                maxLength={100}
                required
                autoFocus
              />
            </div>

            <div
              className="p-3 rounded-lg text-sm"
              style={{
                background: `${selectedTypeInfo.color}08`,
                border: `1px solid ${selectedTypeInfo.color}20`,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <p className="font-medium mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                What you&apos;ll track:
              </p>
              {selectedType === "WEIGHTS" && <p>Weight (kg) · Reps · Sets</p>}
              {selectedType === "BODYWEIGHT" && <p>Reps · Sets</p>}
              {selectedType === "TREADMILL" && <p>Time (min) · Steps · Distance (km)</p>}
              {selectedType === "CYCLING" && <p>Time (min) · Distance (km)</p>}
            </div>

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

            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 text-base w-full"
            >
              {saving ? "Creating…" : "Create workout"}
            </button>
          </form>
        </div>
      )}

      {/* Info card */}
      {step === 1 && (
        <p className="text-center text-sm text-white/30">
          You can add multiple workouts of any type
        </p>
      )}
    </div>
  );
}
