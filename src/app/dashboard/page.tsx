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
