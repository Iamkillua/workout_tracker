import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass p-10 max-w-sm w-full flex flex-col items-center gap-5 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(124,58,237,0.15)" }}
        >
          <WifiOff size={30} style={{ color: "#a78bfa" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">You&apos;re offline</h1>
          <p className="text-white/50 text-sm mt-2">
            No internet connection. Some features may not be available until
            you&apos;re back online.
          </p>
        </div>
        <Link href="/dashboard" className="btn-primary w-full text-center py-3">
          Try again
        </Link>
      </div>
    </div>
  );
}
