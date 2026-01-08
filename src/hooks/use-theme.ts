"use client";

import { useState, useEffect } from "react";
import { applyThemeMode, loadThemePreference, saveThemePreference, type ThemeMode } from "@/lib/client-theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved theme preference on mount
    const saved = loadThemePreference();
    setTheme(saved);
    applyThemeMode(saved);
    setIsLoading(false);
  }, []);

  const changeTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyThemeMode(newTheme);
    saveThemePreference(newTheme);
    
    // Emit custom event for components that need to react to theme changes
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: newTheme } }));
  };

  return { theme, changeTheme, isLoading };
}

