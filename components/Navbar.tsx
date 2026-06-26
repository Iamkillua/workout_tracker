"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Dumbbell, User, LogOut, Activity } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "rgba(15, 12, 41, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            <Activity size={17} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg">FitTrack</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  background: active ? "rgba(124,58,237,0.25)" : "transparent",
                  border: active
                    ? "1px solid rgba(124,58,237,0.4)"
                    : "1px solid transparent",
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Username — visible on mobile too */}
          <span className="text-sm text-white/50 max-w-[120px] truncate">
            {session?.user?.name}
          </span>
          {/* Sign-out — desktop only; mobile uses profile page */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(239,68,68,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.5)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.1)";
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
