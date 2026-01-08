"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Palette, Moon, Sun, Circle } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import type { ThemeMode } from "@/lib/client-theme";

export function ThemeSettings() {
  const { theme: selectedTheme, changeTheme, isLoading } = useTheme();

  const themes: { value: ThemeMode; label: string; description: string; icon: React.ElementType }[] = [
    {
      value: "dark",
      label: "Dark Mode",
      description: "Black backgrounds with cyan accents, high contrast",
      icon: Moon,
    },
    {
      value: "light",
      label: "Light Mode",
      description: "White backgrounds with dark text, softer colors",
      icon: Sun,
    },
    {
      value: "grey",
      label: "Grey Mode",
      description: "Medium grey backgrounds, balanced contrast, easy on eyes",
      icon: Circle,
    },
  ];

  const handleThemeChange = (theme: ThemeMode) => {
    changeTheme(theme);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 border">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme Mode Selection
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your preferred color scheme for the dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.value;

          return (
            <button
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              className={`
                relative p-6 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`
                  p-2 rounded-full
                  ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}
                `}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg">{theme.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{theme.description}</p>

              {/* Preview */}
              <div className="mt-4 p-3 rounded border bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      theme.value === "dark"
                        ? "bg-cyan-500"
                        : theme.value === "light"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <div className="h-2 w-16 bg-muted rounded" />
                </div>
                <div className="h-1.5 w-full bg-muted rounded mb-1" />
                <div className="h-1.5 w-3/4 bg-muted rounded" />
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-primary/20">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Theme Characteristics
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• <strong>Dark:</strong> Optimal for low-light environments, reduces eye strain</li>
          <li>• <strong>Light:</strong> Best for bright environments, traditional appearance</li>
          <li>• <strong>Grey:</strong> Balanced option, works well in any lighting condition</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-3 italic">
          ✨ Theme changes apply instantly across all pages!
        </p>
      </div>
    </div>
  );
}

