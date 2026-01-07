"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getMemberstack } from "@/lib/memberstack";

export function SiteHeader({ title, children }: { title?: string; children?: React.ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>("Welcome");

  useEffect(() => {
    // Fetch user name from Memberstack
    const fetchUserName = async () => {
      try {
        const memberstack = await getMemberstack();
        const member = await memberstack.getCurrentMember();
        
        // Try to get name from different possible fields
        const name = member?.data?.customFields?.name || 
                     member?.data?.auth?.email?.split('@')[0] || 
                     "there";
        
        setUserName(name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    fetchUserName();
  }, []);

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          {children ? children : <h1 className="text-base font-medium">{title || "Documents"}</h1>}
        </div>
        
        {/* Personalized greeting */}
        {userName && (
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-right-4 duration-500">
            <span className="font-medium">{greeting}, {userName}!</span>
          </div>
        )}
      </div>
    </header>
  )
}
