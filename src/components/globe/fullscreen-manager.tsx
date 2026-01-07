"use client";

import { useEffect, useState, useCallback, ReactNode } from "react";
import { Maximize2, Minimize2, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimeRange } from "./globe-controls";

export enum FullscreenMode {
  None = "none",
  Manual = "manual",
  Kiosk = "kiosk",
}

interface FullscreenManagerProps {
  children: ReactNode;
  mode: FullscreenMode;
  onModeChange: (mode: FullscreenMode) => void;
  onViewChange?: (view: TimeRange | "heatmap") => void;
  className?: string;
}

// Kiosk mode views rotation
const KIOSK_VIEWS: (TimeRange | "heatmap")[] = ["live", "1h", "24h", "7d"];
const KIOSK_INTERVAL = 30000; // 30 seconds per view

export function FullscreenManager({
  children,
  mode,
  onModeChange,
  onViewChange,
  className,
}: FullscreenManagerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [kioskViewIndex, setKioskViewIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      // Exit mode if leaving fullscreen
      if (!isNowFullscreen && mode !== FullscreenMode.None) {
        onModeChange(FullscreenMode.None);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [mode, onModeChange]);

  // Enter fullscreen
  const enterFullscreen = useCallback(
    async (newMode: FullscreenMode) => {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        onModeChange(newMode);

        // Reset kiosk view index
        if (newMode === FullscreenMode.Kiosk) {
          setKioskViewIndex(0);
          onViewChange?.(KIOSK_VIEWS[0]);
          setShowControls(false);
        }
      } catch (e) {
        console.error("Failed to enter fullscreen:", e);
      }
    },
    [onModeChange, onViewChange]
  );

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.error("Failed to exit fullscreen:", e);
    }
  }, []);

  // Kiosk mode auto-rotation
  useEffect(() => {
    if (mode !== FullscreenMode.Kiosk) return;

    const interval = setInterval(() => {
      setKioskViewIndex((prev) => {
        const nextIndex = (prev + 1) % KIOSK_VIEWS.length;
        onViewChange?.(KIOSK_VIEWS[nextIndex]);
        return nextIndex;
      });
    }, KIOSK_INTERVAL);

    return () => clearInterval(interval);
  }, [mode, onViewChange]);

  // Show controls briefly on mouse move in kiosk mode
  useEffect(() => {
    if (mode !== FullscreenMode.Kiosk) {
      setShowControls(true);
      return;
    }

    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [mode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode !== FullscreenMode.None) {
        exitFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, exitFullscreen]);

  return (
    <div className={cn("relative", className)}>
      {children}

      {/* Fullscreen controls overlay */}
      {isFullscreen && (
        <div
          className={cn(
            "absolute top-4 right-4 z-50 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={exitFullscreen}
            className="bg-black/60 border-gray-600 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Kiosk mode indicator */}
      {mode === FullscreenMode.Kiosk && (
        <div
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex gap-1">
            {KIOSK_VIEWS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === kioskViewIndex ? "bg-cyan-400" : "bg-gray-600"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">Kiosk Mode</span>
        </div>
      )}
    </div>
  );
}

// Fullscreen buttons component
interface FullscreenButtonsProps {
  onEnterManual: () => void;
  onEnterKiosk: () => void;
  isFullscreen: boolean;
  onExit: () => void;
}

export function FullscreenButtons({
  onEnterManual,
  onEnterKiosk,
  isFullscreen,
  onExit,
}: FullscreenButtonsProps) {
  if (isFullscreen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onExit}
        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white gap-2"
      >
        <Minimize2 className="h-4 w-4" />
        Exit
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEnterManual}
        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white gap-2"
        title="Fullscreen with controls"
      >
        <Maximize2 className="h-4 w-4" />
        <span className="hidden sm:inline">Fullscreen</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEnterKiosk}
        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white gap-2"
        title="Kiosk mode - auto-rotates views"
      >
        <Monitor className="h-4 w-4" />
        <span className="hidden sm:inline">Kiosk</span>
      </Button>
    </div>
  );
}

