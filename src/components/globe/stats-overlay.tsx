"use client";

import { useEffect, useState, memo } from "react";
import { Package, Boxes, MapPin, Tag, Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Stats } from "@/lib/globe-mock-data";
import type { DailyGoal as DailyGoalType } from "@/lib/effects-engine";
import { cn } from "@/lib/utils";

interface StatsOverlayProps {
  stats: Stats;
  dailyGoal?: DailyGoalType;
}

// Animated counter component with smooth easing
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate from current to target value with easing
    const duration = 1000; // 1 second
    const startValue = displayValue;
    const startTime = Date.now();
    
    if (Math.abs(value - displayValue) < 1) {
      setDisplayValue(value);
      return;
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic easing for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * eased;
      
      setDisplayValue(Math.round(current));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

// Stat card component with enhanced styling and hover effects
function StatCard({
  title,
  value,
  icon: Icon,
  prefix = "",
  suffix = "",
  children,
}: {
  title: string;
  value?: number;
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
  children?: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-black/70 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-3 sm:p-4 shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-500/20 hover:scale-105 hover:bg-black/80 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <div className={cn(
          "p-1 rounded bg-cyan-500/10 transition-all duration-300",
          isHovered && "bg-cyan-500/20 scale-110"
        )}>
          <Icon className={cn(
            "w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 transition-all duration-300",
            isHovered && "text-cyan-300 scale-110"
          )} />
        </div>
        <h3 className={cn(
          "text-[10px] sm:text-xs font-medium text-cyan-400 uppercase tracking-wider transition-colors duration-300",
          isHovered && "text-cyan-300"
        )}>{title}</h3>
      </div>
      {value !== undefined ? (
        <p className={cn(
          "text-xl sm:text-2xl font-bold text-white tabular-nums transition-all duration-300",
          isHovered && "text-cyan-100 scale-105"
        )}>
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </p>
      ) : (
        children
      )}
      
      {/* Subtle glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-cyan-500/5 rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  );
}

// Progress bar for states/categories
function ProgressBar({ label, value, maxValue }: { label: string; value: number; maxValue: number }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-300 w-16 truncate" title={label}>
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-cyan-400 w-10 text-right">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

// Compact Daily Goal component for stats overlay
function CompactDailyGoal({ goal }: { goal: DailyGoalType }) {
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

  const progressColor = goal.isComplete
    ? "bg-green-500"
    : goal.percentage >= 75
    ? "bg-gradient-to-r from-yellow-500 to-green-500"
    : "bg-gradient-to-r from-cyan-500 to-blue-500";

  return (
    <div className="bg-black/70 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-3 sm:p-4 shadow-lg shadow-cyan-500/10">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-500/10">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
          </div>
          <h3 className="text-[10px] sm:text-xs font-medium text-cyan-400 uppercase tracking-wider">Daily Goal</h3>
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon className={cn("w-3 h-3", trendColor)} />
          <span className={cn("text-[10px] font-medium", trendColor)}>
            {goal.trend === "ahead" ? "Ahead" : goal.trend === "behind" ? "Behind" : "On Track"}
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1.5">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", progressColor)}
          style={{ width: `${Math.min(goal.percentage, 100)}%` }}
        />
      </div>
      
      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white font-bold tabular-nums">{goal.current.toLocaleString()}</span>
        <span className="text-gray-500 text-xs">/ {goal.target.toLocaleString()}</span>
        <span className={cn("font-bold tabular-nums text-sm", goal.isComplete ? "text-green-400" : "text-cyan-400")}>
          {Math.round(goal.percentage)}%
        </span>
      </div>
    </div>
  );
}

// Memoized for performance - only re-render when stats or dailyGoal change
export const StatsOverlay = memo(function StatsOverlay({ stats, dailyGoal }: StatsOverlayProps) {
  const maxStateCount = Math.max(...stats.topStates.map((s) => s.count), 1);
  const maxCategoryCount = Math.max(...stats.topCategories.map((c) => c.count), 1);

  return (
    <div className="absolute inset-0 pointer-events-none p-2 sm:p-4">
      {/* Left Column - Daily Goal, Destinations, Categories */}
      <div className="absolute top-12 sm:top-16 left-2 sm:left-4 flex flex-col gap-2 max-h-[calc(100%-120px)] overflow-y-auto scrollbar-hide">
        {/* Daily Goal */}
        {dailyGoal && (
          <div className="pointer-events-auto">
            <CompactDailyGoal goal={dailyGoal} />
          </div>
        )}

        {/* Top Destinations */}
        <div className="pointer-events-auto hidden sm:block">
          <StatCard title="Top Destinations" icon={MapPin}>
            <div className="space-y-1.5 mt-2 min-w-[140px]">
              {stats.topStates.length > 0 ? (
                stats.topStates.slice(0, 4).map((state) => (
                  <ProgressBar
                    key={state.state}
                    label={state.state}
                    value={state.count}
                    maxValue={maxStateCount}
                  />
                ))
              ) : (
                <p className="text-xs text-gray-400">Loading...</p>
              )}
            </div>
          </StatCard>
        </div>

        {/* Top Categories */}
        <div className="pointer-events-auto hidden sm:block">
          <StatCard title="Top Categories" icon={Tag}>
            <div className="space-y-1.5 mt-2 min-w-[140px]">
              {stats.topCategories.length > 0 ? (
                stats.topCategories.slice(0, 4).map((cat) => (
                  <ProgressBar
                    key={cat.category}
                    label={cat.category}
                    value={cat.count}
                    maxValue={maxCategoryCount}
                  />
                ))
              ) : (
                <p className="text-xs text-gray-400">Loading...</p>
              )}
            </div>
          </StatCard>
        </div>
      </div>

      {/* Right Column - Orders, Units */}
      <div className="absolute top-12 sm:top-16 right-2 sm:right-4 flex flex-col gap-2">
        {/* Total Orders */}
        <div className="pointer-events-auto">
          <StatCard title="Total Orders" value={stats.totalOrders} icon={Package} />
        </div>
        
        {/* Total Units */}
        <div className="pointer-events-auto">
          <StatCard title="Total Units" value={stats.totalUnits} icon={Boxes} />
        </div>
      </div>
    </div>
  );
});

// Compact progress bar for small screens
function CompactProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-gray-300 truncate">{label}</span>
      <span className="text-cyan-400 font-medium">{value}</span>
    </div>
  );
}

// Bottom stats bar - flex child component, responsive for different screen sizes (memoized)
export const BottomStatsBar = memo(function BottomStatsBar({ stats }: { stats: Stats }) {
  const maxStateCount = Math.max(...stats.topStates.map((s) => s.count), 1);
  const maxCategoryCount = Math.max(...stats.topCategories.map((c) => c.count), 1);

  return (
    <div className="flex-shrink-0 bg-black/90 backdrop-blur-md border-t border-cyan-500/30 px-2 py-1.5 sm:px-4 sm:py-2 lg:py-3">
      <div className="flex justify-between gap-2 sm:gap-4">
        {/* Top Destinations */}
        <div className="flex-1 max-w-[200px] sm:max-w-[280px]">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <div className="p-0.5 sm:p-1 rounded bg-cyan-500/10">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
            </div>
            <h3 className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-cyan-400 uppercase tracking-wider">Top Destinations</h3>
          </div>
          {/* Compact view on small screens, full view on larger */}
          <div className="hidden sm:block space-y-1 lg:space-y-1.5">
            {stats.topStates.length > 0 ? (
              stats.topStates.slice(0, 3).map((state) => (
                <ProgressBar
                  key={state.state}
                  label={state.state}
                  value={state.count}
                  maxValue={maxStateCount}
                />
              ))
            ) : (
              <p className="text-xs text-gray-400">Loading...</p>
            )}
          </div>
          {/* Ultra compact on mobile */}
          <div className="sm:hidden space-y-0.5">
            {stats.topStates.slice(0, 2).map((state) => (
              <CompactProgressBar key={state.state} label={state.state} value={state.count} />
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="flex-1 max-w-[200px] sm:max-w-[280px]">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <div className="p-0.5 sm:p-1 rounded bg-cyan-500/10">
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
            </div>
            <h3 className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-cyan-400 uppercase tracking-wider">Top Categories</h3>
          </div>
          {/* Compact view on small screens, full view on larger */}
          <div className="hidden sm:block space-y-1 lg:space-y-1.5">
            {stats.topCategories.length > 0 ? (
              stats.topCategories.slice(0, 3).map((cat) => (
                <ProgressBar
                  key={cat.category}
                  label={cat.category}
                  value={cat.count}
                  maxValue={maxCategoryCount}
                />
              ))
            ) : (
              <p className="text-xs text-gray-400">Loading...</p>
            )}
          </div>
          {/* Ultra compact on mobile */}
          <div className="sm:hidden space-y-0.5">
            {stats.topCategories.slice(0, 2).map((cat) => (
              <CompactProgressBar key={cat.category} label={cat.category} value={cat.count} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
