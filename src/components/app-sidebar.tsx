"use client"

import * as React from "react"
import {
  TicketIcon,
  BookOpenIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  HelpCircleIcon,
  SearchIcon,
  SettingsIcon,
  MailIcon,
  GlobeIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { CreateTicketDialog } from "@/components/create-ticket-dialog"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getMemberstack } from "@/lib/memberstack"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: GlobeIcon,
    },
    {
      title: "Tickets",
      url: "/tickets",
      icon: TicketIcon,
    },
    {
      title: "Knowledge Base",
      url: "/knowledge-base",
      icon: BookOpenIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    avatar: "",
  })

  React.useEffect(() => {
    async function loadMemberData() {
      try {
        const memberstack = await getMemberstack()
        const { data: member } = await memberstack.getCurrentMember()

        if (member) {
          const firstName = member.customFields?.["first-name"] || ""
          const lastName = member.customFields?.["last-name"] || ""
          const fullName = [firstName, lastName].filter(Boolean).join(" ") || member.auth?.email || "User"

          setUser({
            name: fullName,
            email: member.auth?.email || "",
            avatar: member.profileImage || "",
          })
        }
      } catch (error) {
        // Silently handle errors - user data will remain empty
      }
    }

    loadMemberData()
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <img 
                src="https://cdn.prod.website-files.com/62c7655349d9e17aad25bb35/6578f055736885dadcb8a919_ShipNetwork%20Logo-Horizontal-Blue%20and%20Black%201.svg" 
                alt="ShipNetwork" 
                width={120} 
                height={24}
                className="h-6 w-auto"
              />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <div className="px-2 flex items-center gap-2">
              <CreateTicketDialog />
              <Button
                size="icon"
                className="h-10 w-10 shrink-0"
                variant="outline"
                asChild
              >
                <a href="mailto:clientservices@shipnetwork.com">
                  <MailIcon />
                  <span className="sr-only">Contact Support</span>
                </a>
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
