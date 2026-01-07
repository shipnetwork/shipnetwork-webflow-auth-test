// Effects Engine - Central manager for visual animations
// Handles confetti, pulses, particle explosions, and other effects

import confetti from "canvas-confetti";

// ============================================================================
// TYPES
// ============================================================================

export interface Milestone {
  id: string;
  type: "orders" | "units" | "value";
  threshold: number;
  reached: boolean;
  emoji: string;
  title: string;
  description: string;
}

export interface DailyGoal {
  target: number;
  current: number;
  percentage: number;
  isComplete: boolean;
  trend: "ahead" | "behind" | "on_track";
}

export interface PulseEffect {
  id: string;
  warehouseName: string;
  lat: number;
  lng: number;
  startTime: number;
  duration: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// ============================================================================
// MILESTONE DEFINITIONS
// ============================================================================

export const MILESTONE_THRESHOLDS: Omit<Milestone, "id" | "reached">[] = [
  { type: "orders", threshold: 50, emoji: "🎯", title: "50 Orders!", description: "First milestone reached!" },
  { type: "orders", threshold: 100, emoji: "🔥", title: "100 Orders!", description: "Shipping is on fire!" },
  { type: "orders", threshold: 250, emoji: "🚀", title: "250 Orders!", description: "We're launching!" },
  { type: "orders", threshold: 500, emoji: "⭐", title: "500 Orders!", description: "Half a thousand!" },
  { type: "orders", threshold: 1000, emoji: "💎", title: "1,000 Orders!", description: "Diamond milestone!" },
  { type: "units", threshold: 500, emoji: "📦", title: "500 Units!", description: "Boxes are moving!" },
  { type: "units", threshold: 1000, emoji: "📦📦", title: "1K Units!", description: "Thousand units shipped!" },
  { type: "units", threshold: 5000, emoji: "🏭", title: "5K Units!", description: "Factory mode!" },
  { type: "value", threshold: 5000, emoji: "💵", title: "$5K Revenue!", description: "Money is flowing!" },
  { type: "value", threshold: 10000, emoji: "💰", title: "$10K Revenue!", description: "Ten thousand dollars!" },
  { type: "value", threshold: 25000, emoji: "💎", title: "$25K Revenue!", description: "Quarter of $100K!" },
  { type: "value", threshold: 50000, emoji: "🏆", title: "$50K Revenue!", description: "Halfway to $100K!" },
];

// ============================================================================
// EFFECTS ENGINE CLASS
// ============================================================================

class EffectsEngine {
  private activePulses: PulseEffect[] = [];
  private particles: Particle[] = [];
  private lastFrameTime: number = 0;

  // -------------------------------------------------------------------------
  // CONFETTI EFFECTS
  // -------------------------------------------------------------------------

  /**
   * Fire confetti burst for milestone celebrations
   */
  fireMilestoneConfetti() {
    // Multiple bursts from different angles
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Shoot confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#00d4ff", "#00ff9d", "#ffd93d", "#ff6b6b", "#a855f7"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#00d4ff", "#00ff9d", "#ffd93d", "#ff6b6b", "#a855f7"],
      });
    }, 250);
  }

  /**
   * Fire a quick burst of confetti
   */
  fireQuickBurst(x: number = 0.5, y: number = 0.5) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ["#00d4ff", "#00ff9d", "#ffffff"],
      zIndex: 9999,
    });
  }

  /**
   * Fire school pride style confetti
   */
  fireSchoolPride() {
    const end = Date.now() + 1000;
    const colors = ["#00d4ff", "#0a0e1a"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        zIndex: 9999,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  // -------------------------------------------------------------------------
  // PULSE EFFECTS
  // -------------------------------------------------------------------------

  /**
   * Create a pulse effect from a warehouse location
   */
  createWarehousePulse(warehouseName: string, lat: number, lng: number): PulseEffect {
    const pulse: PulseEffect = {
      id: `pulse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      warehouseName,
      lat,
      lng,
      startTime: Date.now(),
      duration: 2000, // 2 seconds
    };

    this.activePulses.push(pulse);

    // Auto-remove after duration
    setTimeout(() => {
      this.activePulses = this.activePulses.filter((p) => p.id !== pulse.id);
    }, pulse.duration);

    return pulse;
  }

  /**
   * Get all active pulse effects
   */
  getActivePulses(): PulseEffect[] {
    return this.activePulses;
  }

  // -------------------------------------------------------------------------
  // PARTICLE EFFECTS
  // -------------------------------------------------------------------------

  /**
   * Create delivery explosion particles at a point
   */
  createDeliveryExplosion(x: number, y: number) {
    const particleCount = 12;
    const colors = ["#00d4ff", "#00ff9d", "#ffffff", "#ffd93d"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;

      this.particles.push({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
      });
    }
  }

  /**
   * Update all particles (call in animation loop)
   */
  updateParticles(deltaTime: number) {
    const gravity = 0.1;

    this.particles = this.particles
      .map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy + gravity,
        vy: p.vy + gravity * 0.5,
        life: p.life - deltaTime * 0.002,
      }))
      .filter((p) => p.life > 0);
  }

  /**
   * Get all active particles
   */
  getParticles(): Particle[] {
    return this.particles;
  }

  /**
   * Clear all particles
   */
  clearParticles() {
    this.particles = [];
  }

  // -------------------------------------------------------------------------
  // UTILITY
  // -------------------------------------------------------------------------

  /**
   * Clear all effects
   */
  clearAll() {
    this.activePulses = [];
    this.particles = [];
  }
}

// Singleton instance
export const effectsEngine = new EffectsEngine();

// ============================================================================
// MILESTONE DETECTION
// ============================================================================

/**
 * Detect if any new milestones have been reached
 */
export function detectNewMilestone(
  stats: { totalOrders: number; totalUnits: number; totalValue: number },
  previousMilestones: Milestone[]
): Milestone | null {
  const reachedIds = new Set(previousMilestones.map((m) => `${m.type}-${m.threshold}`));

  for (const threshold of MILESTONE_THRESHOLDS) {
    const id = `${threshold.type}-${threshold.threshold}`;
    if (reachedIds.has(id)) continue;

    let currentValue = 0;
    switch (threshold.type) {
      case "orders":
        currentValue = stats.totalOrders;
        break;
      case "units":
        currentValue = stats.totalUnits;
        break;
      case "value":
        currentValue = stats.totalValue;
        break;
    }

    if (currentValue >= threshold.threshold) {
      return {
        id,
        ...threshold,
        reached: true,
      };
    }
  }

  return null;
}

// ============================================================================
// DAILY GOAL CALCULATION
// ============================================================================

/**
 * Calculate daily goal progress
 */
export function calculateDailyGoal(
  totalOrders: number,
  targetOrders: number = 500
): DailyGoal {
  const current = totalOrders;
  const percentage = Math.min((current / targetOrders) * 100, 100);
  const isComplete = current >= targetOrders;

  // Calculate trend based on time of day
  const now = new Date();
  const hoursElapsed = now.getHours() + now.getMinutes() / 60;
  const expectedPercentage = (hoursElapsed / 24) * 100;
  
  let trend: "ahead" | "behind" | "on_track";
  if (percentage > expectedPercentage + 5) {
    trend = "ahead";
  } else if (percentage < expectedPercentage - 5) {
    trend = "behind";
  } else {
    trend = "on_track";
  }

  return {
    target: targetOrders,
    current,
    percentage,
    isComplete,
    trend,
  };
}

