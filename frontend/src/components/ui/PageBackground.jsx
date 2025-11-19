import React from "react";
import { cn } from "../../lib/cn";

const themes = {
  violet: {
    surface:
      "radial-gradient(circle at 20% 20%, rgba(167, 139, 250, 0.22), transparent 52%), radial-gradient(circle at 80% 0%, rgba(248, 113, 113, 0.2), transparent 45%), #04030b",
    texture:
      "linear-gradient(130deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.95) 60%, rgba(2, 6, 23, 0.92))",
    glow: "rgba(129, 140, 248, 0.35)",
    accent: "rgba(249, 168, 212, 0.32)",
  },
  emerald: {
    surface:
      "radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.22), transparent 52%), radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.18), transparent 45%), #021012",
    texture:
      "linear-gradient(130deg, rgba(4, 17, 15, 0.92), rgba(1, 6, 9, 0.96) 60%, rgba(1, 6, 9, 0.96))",
    glow: "rgba(45, 212, 191, 0.35)",
    accent: "rgba(125, 211, 252, 0.28)",
  },
  cyan: {
    surface:
      "radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.25), transparent 55%), radial-gradient(circle at 70% 0%, rgba(129, 140, 248, 0.2), transparent 45%), #010816",
    texture:
      "linear-gradient(120deg, rgba(4, 12, 20, 0.94), rgba(2, 6, 23, 0.96) 55%, rgba(2, 6, 23, 0.95))",
    glow: "rgba(56, 189, 248, 0.35)",
    accent: "rgba(248, 250, 252, 0.18)",
  },
};

export default function PageBackground({
  children,
  variant = "violet",
  className = "",
}) {
  const palette = themes[variant] || themes.violet;
  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden text-slate-50",
        className,
      )}
      style={{ background: palette.surface }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ background: palette.texture }}
      />
      <div
        className="pointer-events-none absolute inset-0 grid-overlay opacity-25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[12%] h-96 w-96 -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: palette.glow }}
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full blur-[120px]"
        style={{ background: palette.accent }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

