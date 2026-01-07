"use client";

import { useState, RefObject } from "react";
import { Camera, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { takeScreenshotWithFlash } from "@/lib/screenshot";
import { cn } from "@/lib/utils";

interface ScreenshotButtonProps {
  targetRef: RefObject<HTMLElement>;
  className?: string;
}

export function ScreenshotButton({ targetRef, className }: ScreenshotButtonProps) {
  const [state, setState] = useState<"idle" | "capturing" | "success">("idle");

  const handleCapture = async () => {
    if (!targetRef.current || state !== "idle") return;

    setState("capturing");

    try {
      await takeScreenshotWithFlash(targetRef.current, "shipnetwork-globe");
      setState("success");

      // Reset to idle after showing success
      setTimeout(() => setState("idle"), 2000);
    } catch (error) {
      console.error("Screenshot failed:", error);
      setState("idle");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCapture}
      disabled={state === "capturing"}
      className={cn(
        "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white gap-2 transition-colors",
        state === "success" && "border-green-500 text-green-400",
        className
      )}
      title="Take screenshot (S)"
    >
      {state === "capturing" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Capturing...</span>
        </>
      ) : state === "success" ? (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Saved!</span>
        </>
      ) : (
        <>
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Screenshot</span>
        </>
      )}
    </Button>
  );
}

