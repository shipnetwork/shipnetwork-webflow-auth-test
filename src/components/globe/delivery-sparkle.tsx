"use client";

import { useEffect, useState } from "react";

export interface SparkleEffect {
  id: string;
  lat: number;
  lng: number;
  color: string;
  timestamp: number;
}

interface DeliverySparkleProps {
  sparkles: SparkleEffect[];
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
  size: number;
}

export function DeliverySparkle({ sparkles }: DeliverySparkleProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles for new sparkles
    const newParticles: Particle[] = [];
    
    sparkles.forEach((sparkle) => {
      const particleCount = 8 + Math.floor(Math.random() * 5); // 8-12 particles
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const speed = 2 + Math.random() * 3;
        
        newParticles.push({
          id: `${sparkle.id}-${i}`,
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          opacity: 1,
          color: sparkle.color,
          size: 3 + Math.random() * 3,
        });
      }
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Animate particles
    const animationFrame = requestAnimationFrame(function animate() {
      setParticles((current) =>
        current
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // Gravity
            opacity: p.opacity - 0.02,
          }))
          .filter((p) => p.opacity > 0)
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [sparkles]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            top: `calc(50% + ${particle.y}px)`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Utility to create sparkle effects for order arrivals
 */
export function createSparkleForOrder(order: { to: { lat: number; lng: number }; category: string }): SparkleEffect {
  const categoryColors: Record<string, string> = {
    Electronics: "#3b82f6",
    Apparel: "#ec4899",
    "Home & Garden": "#10b981",
    "Health & Beauty": "#8b5cf6",
    "Sports & Outdoors": "#f97316",
    "Toys & Games": "#facc15",
    "Food & Beverage": "#ef4444",
    "Office Supplies": "#6b7280",
    "Pet Supplies": "#f59e0b",
    Automotive: "#475569",
  };

  return {
    id: `sparkle-${Date.now()}-${Math.random()}`,
    lat: order.to.lat,
    lng: order.to.lng,
    color: categoryColors[order.category] || "#00d4ff",
    timestamp: Date.now(),
  };
}

