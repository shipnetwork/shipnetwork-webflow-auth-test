"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TicketsTableEnhanced } from "@/components/tickets-table-enhanced"
import { WelcomeModal } from "@/components/welcome-modal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold tracking-tight">HubSpot Tickets</h2>
                  <p className="text-muted-foreground">
                    View and manage your support tickets
                  </p>
                </div>
                <TicketsTableEnhanced />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <WelcomeModal />
    </SidebarProvider>
  )
}
