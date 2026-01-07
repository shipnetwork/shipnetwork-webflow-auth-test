"use client";

import { useEffect, useCallback } from "react";

export interface KeyboardHandlers {
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  onToggleFullscreen?: () => void;
  onToggleKiosk?: () => void;
  onToggleHeatmap?: () => void;
  onToggleTicker?: () => void;
  onToggleLive?: () => void;
  onShowHelp?: () => void;
  onSetSpeed?: (speed: number) => void;
  onEscape?: () => void;
  onScreenshot?: () => void;
}

/**
 * Hook for handling keyboard shortcuts
 * 
 * Shortcuts:
 * - Space: Play/Pause
 * - M: Mute/Unmute
 * - F: Toggle Fullscreen
 * - K: Toggle Kiosk Mode
 * - H: Toggle Heatmap
 * - T: Toggle Ticker
 * - L: Toggle Live Mode
 * - S: Screenshot
 * - 1-5: Speed control (1x, 2x, 5x, 10x, 20x)
 * - ?: Show Help
 * - Escape: Exit fullscreen/close modals
 */
export function useKeyboardShortcuts(handlers: KeyboardHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Handle modifier keys
      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      switch (e.key) {
        case " ": // Space - Play/Pause
          if (!hasModifier) {
            e.preventDefault();
            handlers.onTogglePlay?.();
          }
          break;

        case "m":
        case "M":
          if (!hasModifier) {
            handlers.onToggleMute?.();
          }
          break;

        case "f":
        case "F":
          if (!hasModifier) {
            handlers.onToggleFullscreen?.();
          }
          break;

        case "k":
        case "K":
          if (!hasModifier) {
            handlers.onToggleKiosk?.();
          }
          break;

        case "h":
        case "H":
          if (!hasModifier) {
            handlers.onToggleHeatmap?.();
          }
          break;

        case "t":
        case "T":
          if (!hasModifier) {
            handlers.onToggleTicker?.();
          }
          break;

        case "l":
        case "L":
          if (!hasModifier) {
            handlers.onToggleLive?.();
          }
          break;

        case "s":
        case "S":
          if (!hasModifier) {
            handlers.onScreenshot?.();
          }
          break;

        case "?":
          handlers.onShowHelp?.();
          break;

        case "Escape":
          handlers.onEscape?.();
          break;

        // Speed controls
        case "1":
          if (!hasModifier) {
            handlers.onSetSpeed?.(1);
          }
          break;
        case "2":
          if (!hasModifier) {
            handlers.onSetSpeed?.(2);
          }
          break;
        case "3":
          if (!hasModifier) {
            handlers.onSetSpeed?.(5);
          }
          break;
        case "4":
          if (!hasModifier) {
            handlers.onSetSpeed?.(10);
          }
          break;
        case "5":
          if (!hasModifier) {
            handlers.onSetSpeed?.(20);
          }
          break;
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * List of all keyboard shortcuts for display in help modal
 */
export const KEYBOARD_SHORTCUTS = [
  { key: "Space", description: "Play/Pause replay" },
  { key: "M", description: "Mute/Unmute sounds" },
  { key: "F", description: "Toggle fullscreen" },
  { key: "K", description: "Toggle kiosk mode" },
  { key: "H", description: "Toggle heatmap" },
  { key: "T", description: "Toggle order ticker" },
  { key: "L", description: "Switch to live mode" },
  { key: "S", description: "Take screenshot" },
  { key: "1-5", description: "Set replay speed (1x-20x)" },
  { key: "?", description: "Show this help" },
  { key: "Esc", description: "Exit fullscreen / Close" },
];

