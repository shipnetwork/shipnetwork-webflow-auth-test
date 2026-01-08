/**
 * Client theme management utilities
 */

export type ThemeMode = "dark" | "light" | "grey";

export interface ClientTheme {
  mode: ThemeMode;
}

/**
 * Apply theme mode to the document with enhanced styling
 */
export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  
  document.documentElement.setAttribute("data-theme", mode);
  
  // Apply theme-specific CSS variables
  const root = document.documentElement;
  
  switch (mode) {
    case "dark":
      // Dark theme - current styling
      root.style.setProperty("--background", "10 14 26"); // #0a0e1a
      root.style.setProperty("--foreground", "255 255 255");
      root.style.setProperty("--primary", "0 212 255"); // cyan
      root.style.setProperty("--card", "31 41 55"); // gray-800
      root.style.setProperty("--card-foreground", "255 255 255");
      root.style.setProperty("--popover", "31 41 55");
      root.style.setProperty("--popover-foreground", "255 255 255");
      root.style.setProperty("--muted", "55 65 81"); // gray-700
      root.style.setProperty("--muted-foreground", "156 163 175"); // gray-400
      root.style.setProperty("--border", "75 85 99"); // gray-600
      root.style.setProperty("--input", "75 85 99");
      root.style.setProperty("--ring", "0 212 255");
      break;
      
    case "light":
      // Light theme
      root.style.setProperty("--background", "255 255 255");
      root.style.setProperty("--foreground", "10 14 26");
      root.style.setProperty("--primary", "59 130 246"); // blue-500
      root.style.setProperty("--card", "249 250 251"); // gray-50
      root.style.setProperty("--card-foreground", "10 14 26");
      root.style.setProperty("--popover", "255 255 255");
      root.style.setProperty("--popover-foreground", "10 14 26");
      root.style.setProperty("--muted", "243 244 246"); // gray-100
      root.style.setProperty("--muted-foreground", "107 114 128"); // gray-500
      root.style.setProperty("--border", "229 231 235"); // gray-200
      root.style.setProperty("--input", "229 231 235");
      root.style.setProperty("--ring", "59 130 246");
      break;
      
    case "grey":
      // Grey theme - balanced
      root.style.setProperty("--background", "75 85 99"); // gray-600
      root.style.setProperty("--foreground", "243 244 246"); // gray-100
      root.style.setProperty("--primary", "156 163 175"); // gray-400
      root.style.setProperty("--card", "55 65 81"); // gray-700
      root.style.setProperty("--card-foreground", "243 244 246");
      root.style.setProperty("--popover", "55 65 81");
      root.style.setProperty("--popover-foreground", "243 244 246");
      root.style.setProperty("--muted", "107 114 128"); // gray-500
      root.style.setProperty("--muted-foreground", "209 213 219"); // gray-300
      root.style.setProperty("--border", "107 114 128");
      root.style.setProperty("--input", "107 114 128");
      root.style.setProperty("--ring", "156 163 175");
      break;
  }
  
  // Emit custom event for components that need to react
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: mode } }));
  }
}

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(mode: ThemeMode): void {
  localStorage.setItem("themeMode", mode);
}

/**
 * Load theme preference from localStorage
 */
export function loadThemePreference(): ThemeMode {
  const saved = localStorage.getItem("themeMode");
  return (saved as ThemeMode) || "dark";
}

/**
 * Initialize theme on app load
 */
export function initializeTheme(): void {
  const theme = loadThemePreference();
  applyThemeMode(theme);
}

