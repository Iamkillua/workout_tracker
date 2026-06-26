"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function ServiceWorkerRegistrar() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("[SW] registered", reg.scope);
        })
        .catch((err) => {
          console.warn("[SW] registration failed", err);
        });
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Only show banner if not already installed
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        setShowBanner(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  }

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50"
      style={{
        background: "rgba(15, 12, 41, 0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(124, 58, 237, 0.4)",
        borderRadius: 16,
        padding: "14px 16px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      }}
    >
      <button
        onClick={() => setShowBanner(false)}
        className="absolute top-3 right-3 text-white/30 hover:text-white/60"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3 pr-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(124,58,237,0.2)" }}
        >
          <Download size={18} style={{ color: "#a78bfa" }} />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">Install FitTrack</p>
          <p className="text-white/50 text-xs mt-0.5">
            Add to your home screen for quick access
          </p>
          <button
            onClick={handleInstall}
            className="btn-primary text-xs py-1.5 px-3 mt-2"
          >
            Install app
          </button>
        </div>
      </div>
    </div>
  );
}
