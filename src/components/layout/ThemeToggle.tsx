"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      className={`p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-xs ${className}`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
}
