"use client";

import { useRef, useState } from "react";
import { Package, ChevronRight } from "lucide-react";
import type { Order } from "@/lib/globe-mock-data";

interface OrderTickerProps {
  orders: Order[];
  maxOrders?: number;
}

// Category colors for visual differentiation
const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "text-blue-400",
  Apparel: "text-pink-400",
  "Home & Garden": "text-green-400",
  "Health & Beauty": "text-purple-400",
  "Sports & Outdoors": "text-orange-400",
  "Toys & Games": "text-yellow-400",
  "Food & Beverage": "text-red-400",
  "Office Supplies": "text-gray-400",
  "Pet Supplies": "text-amber-400",
  Automotive: "text-slate-400",
};

function OrderItem({ order }: { order: Order }) {
  const categoryColor = CATEGORY_COLORS[order.category] || "text-gray-400";

  return (
    <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap px-2 sm:px-4 py-0.5 sm:py-1">
      <Package className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
      <span className="text-cyan-400 font-mono text-xs sm:text-sm">
        #{order.id.slice(-5).toUpperCase()}
      </span>
      <span className="hidden sm:inline text-gray-500">from</span>
      <span className="font-semibold text-white text-xs sm:text-sm">{order.from.name}</span>
      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
      <span className="font-semibold text-white text-xs sm:text-sm">
        {order.to.city}, {order.to.state || order.to.country}
      </span>
      <span className="hidden sm:inline text-gray-600">•</span>
      <span className={`hidden sm:inline font-medium text-xs sm:text-sm ${categoryColor}`}>{order.category}</span>
      <span className="text-gray-600">•</span>
      <span className="text-green-400 font-semibold text-xs sm:text-sm">
        ${order.value.toFixed(0)}
      </span>
    </div>
  );
}

export function OrderTicker({ orders, maxOrders = 30 }: OrderTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const recentOrders = orders.slice(-maxOrders);

  // Duplicate orders for seamless infinite scroll
  const displayOrders = [...recentOrders, ...recentOrders];

  return (
    <div
      className="flex-shrink-0 bg-black/90 backdrop-blur-md border-t border-cyan-500/30 overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header label */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-black via-black/90 to-transparent z-10 flex items-center pl-2 sm:pl-4">
        <span className="text-[9px] sm:text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          Live Orders
        </span>
      </div>

      {/* Scrolling content */}
      <div
        ref={containerRef}
        className={`flex items-center h-7 sm:h-10 ${isPaused ? "" : "animate-ticker"}`}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {displayOrders.map((order, index) => (
          <OrderItem key={`${order.id}-${index}`} order={order} />
        ))}
      </div>

      {/* Fade overlays */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none" />

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          animation: ticker 60s linear infinite;
        }
      `}</style>
    </div>
  );
}

