"use client";

import { useEffect, useRef, useState } from "react";
import type { Warehouse, Order } from "@/lib/globe-mock-data";

// Category color palette for arc visualization
const CATEGORY_COLORS: Record<string, [string, string]> = {
  'Electronics': ['rgba(59, 130, 246, 0.9)', 'rgba(96, 165, 250, 0.7)'],      // blue gradient
  'Apparel': ['rgba(236, 72, 153, 0.9)', 'rgba(244, 114, 182, 0.7)'],         // pink gradient
  'Home & Garden': ['rgba(16, 185, 129, 0.9)', 'rgba(52, 211, 153, 0.7)'],    // green gradient
  'Health & Beauty': ['rgba(139, 92, 246, 0.9)', 'rgba(167, 139, 250, 0.7)'], // purple gradient
  'Sports & Outdoors': ['rgba(249, 115, 22, 0.9)', 'rgba(251, 146, 60, 0.7)'], // orange gradient
  'Toys & Games': ['rgba(234, 179, 8, 0.9)', 'rgba(250, 204, 21, 0.7)'],      // yellow gradient
  'Food & Beverage': ['rgba(239, 68, 68, 0.9)', 'rgba(248, 113, 113, 0.7)'],  // red gradient
  'Office Supplies': ['rgba(148, 163, 184, 0.9)', 'rgba(203, 213, 225, 0.7)'], // gray gradient
  'Pet Supplies': ['rgba(245, 158, 11, 0.9)', 'rgba(251, 191, 36, 0.7)'],     // amber gradient
  'Automotive': ['rgba(100, 116, 139, 0.9)', 'rgba(148, 163, 184, 0.7)'],     // slate gradient
};

// Default color for unknown categories
const DEFAULT_ARC_COLORS: [string, string] = ['rgba(0, 212, 255, 0.8)', 'rgba(255, 255, 255, 0.6)'];

interface GlobeVisualizationProps {
  warehouses: Warehouse[];
  orders: Order[];
  width?: number;
  height?: number;
  onWarehouseClick?: (warehouse: Warehouse) => void;
}

// Detect if device is mobile for performance optimizations
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

export function GlobeVisualization({
  warehouses,
  orders,
  width = 800,
  height = 600,
  onWarehouseClick,
}: GlobeVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const onWarehouseClickRef = useRef(onWarehouseClick);
  
  // Keep ref updated with latest callback
  useEffect(() => {
    onWarehouseClickRef.current = onWarehouseClick;
  }, [onWarehouseClick]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !containerRef.current) return;

    let isMounted = true;

    // Dynamically import globe.gl (it doesn't support SSR)
    import("globe.gl").then((GlobeModule) => {
      if (!isMounted || !containerRef.current) return;
      
      const Globe = GlobeModule.default;

      // If globe already exists, just update data
      if (globeRef.current) {
        globeRef.current
          .htmlElementsData(warehouses)
          .arcsData(orders);
        return;
      }

      const mobile = isMobile();

      // Create new globe instance
      const globe = new Globe(containerRef.current!)
        // Globe appearance - dark, stylized earth
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
        .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
        .atmosphereColor("#00d4ff")
        .atmosphereAltitude(0.15)
        
        // Enable pointer interaction (touch on mobile)
        .enablePointerInteraction(true)
        
        // Warehouse points with custom HTML markers (pulse rings)
        .htmlElementsData(warehouses)
        .htmlLat((d: any) => d.lat)
        .htmlLng((d: any) => d.lng)
        .htmlAltitude(0)
        .htmlElement((d: any) => {
          const warehouse = d as Warehouse;
          const el = document.createElement('div');
          
          // Determine pulse intensity based on warehouse activity
          const intensity = warehouse.intensity > 80 ? 'high' : warehouse.intensity > 40 ? 'medium' : 'low';
          
          // Random delay for each warehouse (0-8 seconds) so they don't all pulse at once
          const randomDelay = Math.random() * 8;
          
          el.className = `warehouse-marker pulse-${intensity}`;
          el.style.cssText = 'cursor: pointer; width: 24px; height: 24px;';
          el.innerHTML = `
            <div class="pulse-ring" style="animation-delay: ${randomDelay}s"></div>
            <div class="pulse-ring" style="animation-delay: ${randomDelay + 1}s"></div>
            <div class="warehouse-dot"></div>
          `;
          
          // Tooltip on hover
          el.title = `${warehouse.name} - Click for details`;
          
          // Click handler
          el.onclick = (e) => {
            e.stopPropagation();
            if (onWarehouseClickRef.current) {
              onWarehouseClickRef.current(warehouse);
            }
          };
          
          return el;
        })
        
        // Order arcs (animated trails FROM warehouses TO destinations)
        .arcsData(orders)
        .arcStartLat((d: any) => d.from.lat)
        .arcStartLng((d: any) => d.from.lng)
        .arcEndLat((d: any) => d.to.lat)
        .arcEndLng((d: any) => d.to.lng)
        .arcColor((d: any) => {
          // Enhanced glow for high-value orders (value > 200)
          const order = d as Order;
          const colors = CATEGORY_COLORS[order.category] || DEFAULT_ARC_COLORS;
          
          if (order.value > 200) {
            // High-value orders get extra white glow effect
            return (t: number) => {
              if (t < 0.3) {
                return colors[0]; // Start with category color
              } else if (t < 0.7) {
                // Middle section gets bright white glow
                const glowIntensity = Math.sin((t - 0.3) * Math.PI / 0.4);
                return `rgba(255, 255, 255, ${glowIntensity * 0.9})`;
              } else {
                return colors[1]; // End with lighter category color
              }
            };
          }
          
          // Regular gradient for normal orders
          return colors;
        })
        .arcAltitude((d: any) => {
          // Calculate distance-based altitude for more realistic arcs
          const latDiff = Math.abs(d.from.lat - d.to.lat);
          const lngDiff = Math.abs(d.from.lng - d.to.lng);
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
          return Math.min(0.05 + distance * 0.003, 0.4);
        })
        .arcStroke((d: any) => {
          // Thicker, more prominent arcs for high-value orders (glow effect)
          const isHighValue = d.value > 200;
          return isHighValue ? (mobile ? 0.6 : 1.0) : (mobile ? 0.3 : 0.5);
        })
        .arcDashLength(0.9)
        .arcDashGap(4)
        .arcDashAnimateTime(mobile ? 2500 : 2000)
        
        // Size
        .width(width)
        .height(height);

      // Set initial camera position to show US (centered on continental US)
      // Zoomed in closer so warehouses are easier to see and click
      // Latitude lowered to 35 to show more of America, less of Canada
      const initialAltitude = mobile ? 1.3 : 0.9;
      globe.pointOfView({ lat: 35, lng: -98.5, altitude: initialAltitude }, 0);

      // Configure controls
      const controls = globe.controls();
      controls.enableZoom = true;
      controls.minDistance = mobile ? 120 : 100; // Allow closer zoom
      controls.maxDistance = mobile ? 400 : 500;
      controls.enablePan = false; // Disable panning for cleaner UX
      
      // Disable auto-rotation - user can manually rotate with mouse/touch
      controls.autoRotate = false;
      
      // Enhanced mobile touch controls
      if (mobile) {
        // Enable two-finger rotation for better control
        controls.rotateSpeed = 0.5; // Slower rotation for precision
        controls.zoomSpeed = 1.2; // Faster zoom response
        
        // Enable momentum/inertia for smooth gestures
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
      }

      globeRef.current = globe;
      setIsLoaded(true);
    });

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (globeRef.current) {
        // globe.gl doesn't have a proper dispose method, but we can clear the container
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        globeRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update data when props change
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointsData(warehouses);
    }
  }, [warehouses]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.arcsData(orders);
    }
  }, [orders]);

  // Update size when dimensions change
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.width(width).height(height);
    }
  }, [width, height]);

  return (
    <div className="relative w-full h-full">
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a] rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-cyan-400 text-sm">Loading globe...</p>
          </div>
        </div>
      )}
      
      {/* Globe container - fills parent */}
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{
          background: "#0a0e1a",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
}

