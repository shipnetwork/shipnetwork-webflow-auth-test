"use client";

import { Package, TrendingUp, Globe } from "lucide-react";

export function GlobeEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
      {/* Animated illustration */}
      <div className="relative mb-8">
        {/* Pulsing globe */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-2 border-cyan-500/20 animate-pulse flex items-center justify-center">
          <Globe className="w-16 h-16 text-cyan-400/50" />
        </div>
        
        {/* Orbiting packages */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "8s" }}>
          <Package className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400/70" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }}>
          <Package className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 text-blue-400/70" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "12s" }}>
          <Package className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400/70" />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-bold text-white">
          Waiting for First Order
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Your fulfillment network is ready. Orders will appear here in real-time as they flow through the ShipNetwork system.
        </p>
        
        {/* Stats preview */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
              <Package className="w-4 h-4" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-xs text-gray-500">Orders Today</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-xs text-gray-500">Units Shipped</p>
          </div>
        </div>
      </div>
    </div>
  );
}

