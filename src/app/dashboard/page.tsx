"use client"

import dynamic from "next/dynamic"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { WelcomeModal } from "@/components/welcome-modal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Dynamic import for globe component (requires client-side rendering)
const GlobeTracker = dynamic(
  () => import("@/components/globe/globe-tracker").then((mod) => mod.GlobeTracker),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[600px] rounded-xl bg-[#0a0e1a] border border-cyan-500/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-400 text-sm">Loading globe visualization...</p>
        </div>
      </div>
    ),
  }
)

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <SiteHeader title="Dashboard" />
        
        {/* Full-height content area - no padding, globe fills everything */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <GlobeTracker className="h-full w-full rounded-none border-0" />
        </div>
      </SidebarInset>
      <WelcomeModal />
    </SidebarProvider>
  )
}
