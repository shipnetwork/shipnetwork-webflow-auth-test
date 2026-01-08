"use client";

import { useMemo } from "react";
import type { Order } from "@/lib/globe-mock-data";

interface DestinationHeatmapProps {
  orders: Order[];
  enabled: boolean;
}

interface HeatmapPoint {
  lat: number;
  lng: number;
  count: number;
  intensity: number;
}

export function DestinationHeatmap({ orders, enabled }: DestinationHeatmapProps) {
  const heatmapData = useMemo(() => {
    if (!enabled || orders.length === 0) return [];

    // Group orders by destination (rounded to nearest 0.5 degrees for clustering)
    const locationMap = new Map<string, { lat: number; lng: number; count: number }>();

    orders.forEach((order) => {
      const roundedLat = Math.round(order.to.lat * 2) / 2; // Round to 0.5
      const roundedLng = Math.round(order.to.lng * 2) / 2;
      const key = `${roundedLat},${roundedLng}`;

      if (!locationMap.has(key)) {
        locationMap.set(key, { lat: roundedLat, lng: roundedLng, count: 0 });
      }

      const location = locationMap.get(key)!;
      location.count += 1;
    });

    // Convert to array and calculate intensity
    const maxCount = Math.max(...Array.from(locationMap.values()).map((l) => l.count));

    return Array.from(locationMap.values()).map((location) => ({
      ...location,
      intensity: location.count / maxCount,
    }));
  }, [orders, enabled]);

  if (!enabled || heatmapData.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      {heatmapData.map((point, index) => (
        <HeatmapPoint key={index} point={point} />
      ))}
    </div>
  );
}

function HeatmapPoint({ point }: { point: HeatmapPoint }) {
  // Convert lat/lng to screen coordinates (simplified - would need globe projection in real implementation)
  const x = ((point.lng + 180) / 360) * 100;
  const y = ((90 - point.lat) / 180) * 100;

  // Color gradient: blue (low) → yellow → red (high)
  const getColor = (intensity: number) => {
    if (intensity < 0.33) {
      // Blue to yellow
      const t = intensity / 0.33;
      return `rgba(${Math.floor(0 + 255 * t)}, ${Math.floor(100 + 155 * t)}, 255, ${intensity * 0.6})`;
    } else if (intensity < 0.66) {
      // Yellow to orange
      const t = (intensity - 0.33) / 0.33;
      return `rgba(255, ${Math.floor(255 - 100 * t)}, ${Math.floor(255 - 255 * t)}, ${intensity * 0.6})`;
    } else {
      // Orange to red
      const t = (intensity - 0.66) / 0.34;
      return `rgba(255, ${Math.floor(155 - 155 * t)}, 0, ${intensity * 0.6})`;
    }
  };

  const size = 20 + point.intensity * 60; // 20-80px

  return (
    <div
      className="absolute rounded-full blur-xl transition-all duration-1000"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: getColor(point.intensity),
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

/**
 * Utility to calculate heatmap data for globe.gl hexBin
 */
export function calculateHexBinData(orders: Order[]): Array<{ lat: number; lng: number; count: number }> {
  const locationMap = new Map<string, { lat: number; lng: number; count: number }>();

  orders.forEach((order) => {
    const roundedLat = Math.round(order.to.lat * 2) / 2;
    const roundedLng = Math.round(order.to.lng * 2) / 2;
    const key = `${roundedLat},${roundedLng}`;

    if (!locationMap.has(key)) {
      locationMap.set(key, { lat: roundedLat, lng: roundedLng, count: 0 });
    }

    const location = locationMap.get(key)!;
    location.count += 1;
  });

  return Array.from(locationMap.values());
}

