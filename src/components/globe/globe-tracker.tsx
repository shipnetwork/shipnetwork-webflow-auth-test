"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { GlobeVisualization } from "./globe-visualization";
import { StatsOverlay } from "./stats-overlay";
import { GlobeControls, type TimeRange } from "./globe-controls";
import { WarehouseModal } from "./warehouse-modal";
import { OrderTicker } from "./order-ticker";
import { FilterControls, applyFilters, type FilterState } from "./filter-controls";
import { DailyGoal } from "./daily-goal";
import { MilestoneCelebration } from "./milestone-celebration";
import { FullscreenManager, FullscreenButtons, FullscreenMode } from "./fullscreen-manager";
import { ScreenshotButton } from "./screenshot-button";
import { KeyboardHelpModal } from "./keyboard-help-modal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { soundEngine } from "@/lib/sound-engine";
import {
  effectsEngine,
  detectNewMilestone,
  calculateDailyGoal,
  type Milestone,
} from "@/lib/effects-engine";
import {
  generateOrder,
  calculateStats,
  updateWarehouseIntensity,
  getInitialData,
  generateHistoricalOrders,
  getTimeRangeDates,
  getOrdersPerHour,
  WAREHOUSES,
  type Order,
  type Warehouse,
  type Stats,
} from "@/lib/globe-mock-data";
import { cn } from "@/lib/utils";

// Configuration
const ORDER_GENERATION_INTERVAL = 1500;
const ORDER_LIFETIME = 3000;
const STATS_UPDATE_INTERVAL = 2000;
const DAILY_GOAL_TARGET = 500;

const getMaxActiveOrders = (width: number) => {
  if (width < 640) return 30;
  if (width < 1024) return 50;
  return 75;
};

interface GlobeTrackerProps {
  className?: string;
}

export function GlobeTracker({ className }: GlobeTrackerProps) {
  // Core state
  const [warehouses, setWarehouses] = useState<Warehouse[]>(WAREHOUSES);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalUnits: 0,
    totalValue: 0,
    topStates: [],
    topCategories: [],
  });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(true);
  const replayIndexRef = useRef(0);

  // Mode & Controls State
  const [mode, setMode] = useState<TimeRange>("live");
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [replayProgress, setReplayProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [replayData, setReplayData] = useState<Order[]>([]);

  // Feature State
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [filters, setFilters] = useState<FilterState>({ categories: new Set(), warehouses: new Set() });
  const [showTicker, setShowTicker] = useState(true);
  const [fullscreenMode, setFullscreenMode] = useState(FullscreenMode.None);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Milestone State
  const [reachedMilestones, setReachedMilestones] = useState<Milestone[]>([]);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);

  // Responsive sizing with ResizeObserver
  useEffect(() => {
    const updateDimensions = () => {
      if (globeContainerRef.current) {
        const rect = globeContainerRef.current.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        const finalWidth = Math.max(width, 300);
        const finalHeight = Math.max(height, 400);
        setDimensions({ width: finalWidth, height: finalHeight });
      }
    };

    // Debounce resize observer for better performance
    let resizeTimeout: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 100);
    };

    const resizeObserver = new ResizeObserver(debouncedUpdate);
    if (globeContainerRef.current) {
      resizeObserver.observe(globeContainerRef.current);
    }

    updateDimensions();
    window.addEventListener("resize", debouncedUpdate);
    
    const timeouts = [
      setTimeout(updateDimensions, 100),
      setTimeout(updateDimensions, 500),
      setTimeout(updateDimensions, 1000),
    ];
    
    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedUpdate);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Visibility tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Initialize data
  useEffect(() => {
    const initial = getInitialData();
    setActiveOrders(initial.orders.slice(0, 20));
    setOrderHistory(initial.orders);
    setStats(initial.stats);
    setWarehouses(initial.warehouses);
  }, []);

  // Mode change handler
  useEffect(() => {
    if (mode === "live") {
      setReplayData([]);
      setReplayProgress(0);
      replayIndexRef.current = 0;
      setIsPlaying(false);
    } else {
      const { startDate, endDate } = getTimeRangeDates(mode);
      const ordersPerHour = getOrdersPerHour(mode);
      const historical = generateHistoricalOrders(startDate, endDate, ordersPerHour);
      setReplayData(historical);
      setReplayProgress(0);
      replayIndexRef.current = 0;
      setActiveOrders([]);
    }
  }, [mode]);

  // Live order generation
  useEffect(() => {
    if (mode !== "live") return;
    const maxOrders = getMaxActiveOrders(dimensions.width);

    const interval = setInterval(() => {
      if (!isVisible.current) return;

      const newOrder = generateOrder();

      if (!isMuted) {
        if (newOrder.value > 500) {
          soundEngine.playHighValueOrderSound();
        } else {
          soundEngine.playOrderShipSound();
        }
      }

      setActiveOrders((prev) => {
        const updated = [...prev, newOrder];
        return updated.length > maxOrders ? updated.slice(-maxOrders) : updated;
      });

      setOrderHistory((prev) => {
        const updated = [...prev, newOrder];
        return updated.length > 500 ? updated.slice(-500) : updated;
      });

      setTimeout(() => {
        setActiveOrders((prev) => prev.filter((o) => o.id !== newOrder.id));
      }, ORDER_LIFETIME);
    }, ORDER_GENERATION_INTERVAL);

    return () => clearInterval(interval);
  }, [mode, dimensions.width, isMuted]);

  // Replay mode animation
  useEffect(() => {
    if (mode === "live" || !isPlaying || replayData.length === 0) return;
    const maxOrders = getMaxActiveOrders(dimensions.width);
    const baseInterval = 50;

    const interval = setInterval(() => {
      if (!isVisible.current) return;

      replayIndexRef.current += 1;
      
      if (replayIndexRef.current >= replayData.length) {
        setIsPlaying(false);
        replayIndexRef.current = replayData.length - 1;
        return;
      }

      const progress = (replayIndexRef.current / replayData.length) * 100;
      setReplayProgress(progress);

      const windowSize = Math.min(maxOrders, 50);
      const startIdx = Math.max(0, replayIndexRef.current - windowSize);
      const visibleOrders = replayData.slice(startIdx, replayIndexRef.current + 1);
      setActiveOrders(visibleOrders);

      if (!isMuted && replayIndexRef.current < replayData.length) {
        const newOrder = replayData[replayIndexRef.current];
        if (newOrder.value > 500) {
          soundEngine.playHighValueOrderSound();
        } else {
          soundEngine.playOrderShipSound();
        }
      }
    }, baseInterval / replaySpeed);

    return () => clearInterval(interval);
  }, [mode, isPlaying, replaySpeed, replayData, dimensions.width, isMuted]);

  // Stats update
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isVisible.current) return;

      const ordersForStats = mode === "live" ? orderHistory : replayData.slice(0, replayIndexRef.current + 1);
      const newStats = calculateStats(ordersForStats);
      setStats(newStats);
      setWarehouses((prev) => updateWarehouseIntensity(prev, ordersForStats.slice(-50)));

      // Check for new milestones
      const newMilestone = detectNewMilestone(newStats, reachedMilestones);
      if (newMilestone && !isMuted) {
        setCurrentMilestone(newMilestone);
        setReachedMilestones((prev) => [...prev, newMilestone]);
      }
    }, STATS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [orderHistory, mode, replayData, reachedMilestones, isMuted]);

  // Handlers
  const handleModeChange = useCallback((newMode: TimeRange) => setMode(newMode), []);
  const handleTogglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);
  const handleSpeedChange = useCallback((speed: number) => setReplaySpeed(speed), []);
  
  const handleProgressChange = useCallback((progress: number) => {
    setReplayProgress(progress);
    replayIndexRef.current = Math.floor((progress / 100) * replayData.length);
    const maxOrders = getMaxActiveOrders(dimensions.width);
    const windowSize = Math.min(maxOrders, 50);
    const startIdx = Math.max(0, replayIndexRef.current - windowSize);
    const visibleOrders = replayData.slice(startIdx, replayIndexRef.current + 1);
    setActiveOrders(visibleOrders);
  }, [replayData, dimensions.width]);
  
  const handleReset = useCallback(() => {
    setReplayProgress(0);
    replayIndexRef.current = 0;
    setActiveOrders([]);
    setIsPlaying(false);
  }, []);
  
  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEngine.setMuted(newMuted);
  }, [isMuted]);

  const handleWarehouseClick = useCallback((warehouse: Warehouse) => setSelectedWarehouse(warehouse), []);
  const handleCloseModal = useCallback(() => setSelectedWarehouse(null), []);
  const handleMilestoneComplete = useCallback(() => setCurrentMilestone(null), []);

  const handleEnterFullscreen = useCallback(async (mode: FullscreenMode) => {
    try {
      await document.documentElement.requestFullscreen();
      setFullscreenMode(mode);
    } catch (e) {
      console.error("Failed to enter fullscreen:", e);
    }
  }, []);

  const handleExitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setFullscreenMode(FullscreenMode.None);
    } catch (e) {
      console.error("Failed to exit fullscreen:", e);
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTogglePlay: handleTogglePlay,
    onToggleMute: handleToggleMute,
    onToggleFullscreen: () => handleEnterFullscreen(FullscreenMode.Manual),
    onToggleKiosk: () => handleEnterFullscreen(FullscreenMode.Kiosk),
    onToggleTicker: () => setShowTicker((prev) => !prev),
    onToggleLive: () => setMode("live"),
    onShowHelp: () => setShowHelpModal(true),
    onSetSpeed: handleSpeedChange,
    onEscape: handleExitFullscreen,
    onScreenshot: () => {
      if (containerRef.current) {
        import("@/lib/screenshot").then(({ takeScreenshotWithFlash }) => {
          takeScreenshotWithFlash(containerRef.current!, "shipnetwork-globe");
        });
      }
    },
  });

  // Apply filters (memoized for performance)
  const filteredOrders = useMemo(() => applyFilters(activeOrders, filters), [activeOrders, filters]);
  const dailyGoal = useMemo(() => calculateDailyGoal(stats.totalOrders, DAILY_GOAL_TARGET), [stats.totalOrders]);

  return (
    <FullscreenManager
      mode={fullscreenMode}
      onModeChange={setFullscreenMode}
      onViewChange={(view) => {
        if (view !== "heatmap") setMode(view as TimeRange);
      }}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative w-full h-full bg-[#0a0e1a] border border-cyan-500/20 shadow-2xl shadow-cyan-500/5 flex flex-col",
          className
        )}
      >
        {/* Top Order Ticker */}
        {showTicker && <OrderTicker orders={orderHistory} />}

        {/* Controls Bar */}
        <div className="flex-shrink-0 p-3 z-20 flex flex-wrap items-center justify-between gap-3">
          <GlobeControls
            mode={mode}
            onModeChange={handleModeChange}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            replaySpeed={replaySpeed}
            onSpeedChange={handleSpeedChange}
            replayProgress={replayProgress}
            onProgressChange={handleProgressChange}
            onReset={handleReset}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
          
          <div className="flex items-center gap-2">
            <FilterControls filters={filters} onFiltersChange={setFilters} />
            <ScreenshotButton targetRef={containerRef as React.RefObject<HTMLElement>} />
            <FullscreenButtons
              onEnterManual={() => handleEnterFullscreen(FullscreenMode.Manual)}
              onEnterKiosk={() => handleEnterFullscreen(FullscreenMode.Kiosk)}
              isFullscreen={fullscreenMode !== FullscreenMode.None}
              onExit={handleExitFullscreen}
            />
          </div>
        </div>

        {/* Globe Container - takes remaining space after bottom elements */}
        <div ref={globeContainerRef} className="flex-1 relative min-h-0 overflow-hidden">
          <GlobeVisualization
            warehouses={warehouses}
            orders={filteredOrders}
            width={dimensions.width}
            height={dimensions.height}
            onWarehouseClick={handleWarehouseClick}
          />

          <StatsOverlay stats={stats} dailyGoal={dailyGoal} />

          {/* Title Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white drop-shadow-lg">
                ShipNetwork Fulfillment Network
              </h3>
              <p className="text-xs text-cyan-400">
                {mode === "live"
                  ? "Real-time order activity from 10 fulfillment centers"
                  : `Historical data - ${mode === "1h" ? "Last Hour" : mode === "24h" ? "Last 24 Hours" : mode === "7d" ? "Last 7 Days" : "Last 30 Days"}`}
              </p>
            </div>
          </div>
        </div>

        {/* Order Ticker - flex child, guaranteed visible */}
        {showTicker && <OrderTicker orders={orderHistory} />}

        {/* Modals */}
        <WarehouseModal
          warehouse={selectedWarehouse}
          isOpen={!!selectedWarehouse}
          onClose={handleCloseModal}
          orderHistory={mode === "live" ? orderHistory : replayData}
        />

        <KeyboardHelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

        {/* Milestone Celebration */}
        <MilestoneCelebration milestone={currentMilestone} onComplete={handleMilestoneComplete} />
      </div>
    </FullscreenManager>
  );
}
