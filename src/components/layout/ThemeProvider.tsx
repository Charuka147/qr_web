"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem("qr_studio_theme") as Theme | null;
  if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
    return saved;
  }
  return "system";
}

function getServerSnapshot(): Theme {
  return "system";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const storedTheme = useSyncExternalStore(
    subscribeStorage,
    getStoredTheme,
    getServerSnapshot
  );
  const [userTheme, setUserTheme] = useState<Theme | null>(null);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  const activeTheme = userTheme ?? storedTheme;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateDOM = () => {
      const isDark =
        activeTheme === "dark" ||
        (activeTheme === "system" && mediaQuery.matches);

      setResolvedTheme(isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateDOM();
    mediaQuery.addEventListener("change", updateDOM);
    return () => mediaQuery.removeEventListener("change", updateDOM);
  }, [activeTheme]);

  const setTheme = (newTheme: Theme) => {
    setUserTheme(newTheme);
    localStorage.setItem("qr_studio_theme", newTheme);
    window.dispatchEvent(new Event("storage"));
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme: activeTheme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
