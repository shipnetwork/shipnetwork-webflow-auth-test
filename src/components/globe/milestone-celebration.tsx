"use client";

import { useEffect, useState } from "react";
import { effectsEngine, type Milestone } from "@/lib/effects-engine";
import { soundEngine } from "@/lib/sound-engine";

interface MilestoneCelebrationProps {
  milestone: Milestone | null;
  onComplete: () => void;
}

export function MilestoneCelebration({
  milestone,
  onComplete,
}: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumber, setAnimatedNumber] = useState(0);

  useEffect(() => {
    if (milestone) {
      setIsVisible(true);
      setAnimatedNumber(0);

      // Fire confetti
      effectsEngine.fireMilestoneConfetti();

      // Play celebration sound
      soundEngine.playMilestoneSound();

      // Animate the number counting up
      const targetNumber = milestone.threshold;
      const duration = 1500;
      const steps = 30;
      const increment = targetNumber / steps;
      let current = 0;

      const countInterval = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          setAnimatedNumber(targetNumber);
          clearInterval(countInterval);
        } else {
          setAnimatedNumber(Math.floor(current));
        }
      }, duration / steps);

      // Auto-dismiss after 5 seconds
      const dismissTimeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 500); // Wait for fade out
      }, 5000);

      return () => {
        clearInterval(countInterval);
        clearTimeout(dismissTimeout);
      };
    }
  }, [milestone, onComplete]);

  if (!milestone || !isVisible) return null;

  // Format the number based on type
  const formatNumber = () => {
    switch (milestone.type) {
      case "value":
        return `$${animatedNumber.toLocaleString()}`;
      case "units":
      case "orders":
      default:
        return animatedNumber.toLocaleString();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Celebration card */}
      <div className="relative z-10 text-center animate-bounce-in">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full scale-150" />

        {/* Content */}
        <div className="relative bg-gray-900/90 border-2 border-cyan-400 rounded-2xl p-8 shadow-2xl shadow-cyan-500/50">
          {/* Emoji */}
          <div className="text-7xl mb-4 animate-pulse">{milestone.emoji}</div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-white mb-2 animate-glow">
            {milestone.title}
          </h2>

          {/* Animated number */}
          <div className="text-6xl font-black text-cyan-400 mb-4 tabular-nums">
            {formatNumber()}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-lg">{milestone.description}</p>

          {/* Sparkles decoration */}
          <div className="absolute -top-4 -left-4 text-2xl animate-spin-slow">
            ✨
          </div>
          <div className="absolute -top-4 -right-4 text-2xl animate-spin-slow delay-100">
            ✨
          </div>
          <div className="absolute -bottom-4 -left-4 text-2xl animate-spin-slow delay-200">
            ✨
          </div>
          <div className="absolute -bottom-4 -right-4 text-2xl animate-spin-slow delay-300">
            ✨
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.5),
              0 0 40px rgba(0, 212, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(0, 212, 255, 0.8),
              0 0 60px rgba(0, 212, 255, 0.5);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-glow {
          animation: glow 1.5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}

