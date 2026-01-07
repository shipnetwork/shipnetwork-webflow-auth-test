"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
} from "lucide-react";

export type TimeRange = "live" | "1h" | "24h" | "7d" | "30d";

interface GlobeControlsProps {
  mode: TimeRange;
  onModeChange: (mode: TimeRange) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  replaySpeed: number;
  onSpeedChange: (speed: number) => void;
  replayProgress: number;
  onProgressChange: (progress: number) => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "live", label: "Live" },
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "Last 24h" },
  { value: "7d", label: "Last Week" },
  { value: "30d", label: "Last Month" },
];

const SPEEDS = [
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 5, label: "5x" },
  { value: 10, label: "10x" },
];

export function GlobeControls({
  mode,
  onModeChange,
  isPlaying,
  onTogglePlay,
  replaySpeed,
  onSpeedChange,
  replayProgress,
  onProgressChange,
  onReset,
  isMuted,
  onToggleMute,
}: GlobeControlsProps) {
  const isLive = mode === "live";

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-black/40 backdrop-blur-md rounded-lg border border-cyan-500/20">
      {/* Time Range Selection */}
      <div className="flex gap-1">
        {TIME_RANGES.map(({ value, label }) => (
          <Button
            key={value}
            variant={mode === value ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange(value)}
            className={
              mode === value
                ? "bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500"
                : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            }
          >
            {value === "live" && (
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className={`${mode === "live" ? "animate-ping" : ""} absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75`} />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            )}
            {label}
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-600" />

      {/* Replay Controls (only visible when not in live mode) */}
      {!isLive && (
        <>
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              variant="outline"
              size="icon"
              onClick={onTogglePlay}
              className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            {/* Reset */}
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            {/* Progress Slider */}
            <div className="w-32 sm:w-48">
              <Slider
                value={[replayProgress]}
                onValueChange={([v]) => onProgressChange(v)}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-cyan-500"
              />
            </div>

            {/* Speed Selection */}
            <Select
              value={replaySpeed.toString()}
              onValueChange={(v) => onSpeedChange(Number(v))}
            >
              <SelectTrigger className="w-16 h-8 border-gray-600 bg-transparent text-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {SPEEDS.map(({ value, label }) => (
                  <SelectItem key={value} value={value.toString()}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-600" />
        </>
      )}

      {/* Live Indicator (only in live mode) */}
      {isLive && (
        <>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>Streaming Live</span>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-600" />
        </>
      )}

      {/* Mute Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

