"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, User, Plus } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/workouts/new", label: "Log", icon: Plus, primary: true },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "rgba(10, 8, 30, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, label, icon: Icon, primary }) => {
          const active =
            pathname === href ||
            (href !== "/workouts/new" && pathname.startsWith(href + "/"));

          if (primary) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center -mt-6 relative"
              >
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    width: 52,
                    height: 52,
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
                  }}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <span
                  className="text-xs mt-1 font-medium"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all"
            >
              <Icon
                size={21}
                style={{
                  color: active ? "#a78bfa" : "rgba(255,255,255,0.4)",
                  transition: "color 0.15s",
                }}
              />
              <span
                className="text-xs font-medium"
                style={{
                  color: active ? "#a78bfa" : "rgba(255,255,255,0.4)",
                  transition: "color 0.15s",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
