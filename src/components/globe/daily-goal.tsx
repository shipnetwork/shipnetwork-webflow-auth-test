"use client";

import { useEffect, useState } from "react";
import { Target, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyGoal as DailyGoalType } from "@/lib/effects-engine";

interface DailyGoalProps {
  goal: DailyGoalType;
  className?: string;
}

export function DailyGoal({ goal, className }: DailyGoalProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animate percentage on change
  useEffect(() => {
    const start = animatedPercentage;
    const end = goal.percentage;
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = start + (end - start) * eased;
      setAnimatedPercentage(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [goal.percentage]);

  // Show celebration when goal is completed
  useEffect(() => {
    if (goal.isComplete) {
      setShowCelebration(true);
      const timeout = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [goal.isComplete]);

  // Get hours remaining in day
  const getTimeRemaining = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const remaining = endOfDay.getTime() - now.getTime();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Trend icon and color
  const TrendIcon =
    goal.trend === "ahead"
      ? TrendingUp
      : goal.trend === "behind"
      ? TrendingDown
      : Minus;

  const trendColor =
    goal.trend === "ahead"
      ? "text-green-400"
      : goal.trend === "behind"
      ? "text-red-400"
      : "text-yellow-400";

  // Progress bar color based on completion
  const progressColor = goal.isComplete
    ? "bg-green-500"
    : goal.percentage >= 75
    ? "bg-gradient-to-r from-yellow-500 to-green-500"
    : goal.percentage >= 50
    ? "bg-gradient-to-r from-orange-500 to-yellow-500"
    : "bg-gradient-to-r from-cyan-500 to-blue-500";

  return (
    <div
      className={cn(
        "bg-black/60 backdrop-blur-md rounded-lg p-3 border border-cyan-500/30 min-w-[200px]",
        showCelebration && "animate-pulse border-green-500",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target
            className={cn(
              "w-4 h-4",
              goal.isComplete ? "text-green-400" : "text-cyan-400"
            )}
          />
          <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">
            Daily Goal
          </span>
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon className={cn("w-3 h-3", trendColor)} />
          <span className={cn("text-xs font-medium", trendColor)}>
            {goal.trend === "ahead"
              ? "Ahead"
              : goal.trend === "behind"
              ? "Behind"
              : "On Track"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", progressColor)}
          style={{ width: `${Math.min(animatedPercentage, 100)}%` }}
        />
        {/* Glow effect when complete */}
        {goal.isComplete && (
          <div className="absolute inset-0 bg-green-400/20 animate-pulse rounded-full" />
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="font-bold text-white tabular-nums">
            {goal.current.toLocaleString()}
          </span>
          <span className="text-gray-500 ml-1">
            / {goal.target.toLocaleString()}
          </span>
        </div>
        <span
          className={cn(
            "font-bold tabular-nums",
            goal.isComplete ? "text-green-400" : "text-cyan-400"
          )}
        >
          {Math.round(animatedPercentage)}%
        </span>
      </div>

      {/* Time remaining or completion message */}
      <div className="mt-2 flex items-center gap-1 text-xs">
        {goal.isComplete ? (
          <span className="text-green-400 font-medium">
            🎉 Goal Reached!
          </span>
        ) : (
          <>
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-500">{getTimeRemaining()} remaining</span>
          </>
        )}
      </div>
    </div>
  );
}

