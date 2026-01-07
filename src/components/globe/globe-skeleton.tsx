"use client";

import { Package, Boxes, MapPin, Tag } from "lucide-react";

export function GlobeSkeleton() {
  return (
    <div className="w-full h-full min-h-[600px] rounded-xl bg-[#0a0e1a] border border-cyan-500/20 flex flex-col overflow-hidden relative">
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
      </div>

      {/* Globe loading animation */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Pulsing globe silhouette */}
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-2 border-cyan-500/20 animate-pulse" />
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 relative">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-140px)`,
                    animation: `spin 3s linear infinite`,
                    animationDelay: `${i * 0.125}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Center loading text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-cyan-400 text-sm font-medium animate-pulse">
                Initializing Globe Visualization
              </p>
              <p className="text-cyan-600 text-xs mt-1">
                Loading fulfillment network...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton stat cards */}
      <div className="absolute inset-0 pointer-events-none p-4">
        {/* Left column */}
        <div className="absolute top-16 left-4 flex flex-col gap-2">
          <SkeletonStatCard icon={Package} />
          <SkeletonStatCard icon={MapPin} />
        </div>

        {/* Right column */}
        <div className="absolute top-16 right-4">
          <SkeletonStatCard icon={Boxes} />
        </div>
      </div>

      {/* Skeleton ticker */}
      <div className="flex-shrink-0 bg-black/90 backdrop-blur-md border-t border-cyan-500/30 px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="h-4 w-32 bg-cyan-500/10 rounded animate-pulse" />
          <div className="h-4 w-24 bg-cyan-500/10 rounded animate-pulse" />
          <div className="h-4 w-40 bg-cyan-500/10 rounded animate-pulse" />
          <div className="h-4 w-28 bg-cyan-500/10 rounded animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function SkeletonStatCard({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div className="bg-black/70 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4 shadow-lg shadow-cyan-500/10 w-48 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 rounded bg-cyan-500/10">
          <Icon className="w-4 h-4 text-cyan-400/50" />
        </div>
        <div className="h-3 w-24 bg-cyan-500/10 rounded" />
      </div>
      <div className="h-8 w-32 bg-cyan-500/10 rounded" />
    </div>
  );
}

