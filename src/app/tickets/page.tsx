"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TicketsTableEnhanced } from "@/components/tickets-table-enhanced"
import { WelcomeModal } from "@/components/welcome-modal"
import { ChatWidget } from "@/components/chat/chat-widget"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function TicketsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Support Tickets" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                {/* AI Chat Assistant */}
                <div className="mb-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold tracking-tight">AI Assistant</h2>
                    <p className="text-muted-foreground">
                      Ask questions about your orders, shipping, or account
                    </p>
                  </div>
                  <ChatWidget />
                </div>

                {/* HubSpot Tickets Section */}
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

