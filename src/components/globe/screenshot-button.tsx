"use client";

import { useState, RefObject } from "react";
import { Camera, Loader2, Check, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { takeScreenshotWithFlash, record10Seconds } from "@/lib/screenshot";
import { cn } from "@/lib/utils";

interface ScreenshotButtonProps {
  targetRef: RefObject<HTMLElement>;
  className?: string;
}

export function ScreenshotButton({ targetRef, className }: ScreenshotButtonProps) {
  const [state, setState] = useState<"idle" | "capturing" | "recording" | "success">("idle");

  const handleCapture = async () => {
    if (!targetRef.current || state !== "idle") return;

    setState("capturing");

    try {
      await takeScreenshotWithFlash(targetRef.current, "shipnetwork-globe");
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    } catch (error) {
      console.error("Screenshot failed:", error);
      setState("idle");
    }
  };

  const handleRecord = async () => {
    if (!targetRef.current || state !== "idle") return;

    setState("recording");

    try {
      await record10Seconds(targetRef.current);
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    } catch (error) {
      console.error("Recording failed:", error);
      setState("idle");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={state === "capturing" || state === "recording"}
          className={cn(
            "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white gap-2 transition-colors",
            state === "success" && "border-green-500 text-green-400",
            className
          )}
          title="Capture"
        >
          {state === "capturing" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Capturing...</span>
            </>
          ) : state === "recording" ? (
            <>
              <Video className="h-4 w-4 text-red-400 animate-pulse" />
              <span className="hidden sm:inline">Recording...</span>
            </>
          ) : state === "success" ? (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Saved!</span>
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Capture</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-600">
        <DropdownMenuItem
          onClick={handleCapture}
          disabled={state !== "idle"}
          className="text-white hover:bg-gray-700 cursor-pointer"
        >
          <Camera className="h-4 w-4 mr-2" />
          Screenshot
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleRecord}
          disabled={state !== "idle"}
          className="text-white hover:bg-gray-700 cursor-pointer"
        >
          <Video className="h-4 w-4 mr-2" />
          Record 10s
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

