"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Palette, Bell, User } from "lucide-react";
import { WarehouseSettings } from "@/components/settings/warehouse-settings";
import { GoalSettings } from "@/components/settings/goal-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { GeneralSettings } from "@/components/settings/general-settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Settings" />
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Settings className="w-8 h-8" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your ShipNetwork dashboard preferences and configurations
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="general" className="gap-2">
                  <User className="w-4 h-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="globe" className="gap-2">
                  <Globe className="w-4 h-4" />
                  Globe
                </TabsTrigger>
                <TabsTrigger value="theme" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <GeneralSettings />
              </TabsContent>

              <TabsContent value="globe" className="space-y-4">
                <div className="space-y-6">
                  <WarehouseSettings />
                  <GoalSettings />
                </div>
              </TabsContent>

              <TabsContent value="theme" className="space-y-4">
                <ThemeSettings />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <div className="bg-card rounded-lg p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                  <p className="text-muted-foreground">
                    Notification settings coming soon. You'll be able to configure email alerts,
                    milestone celebrations, and capacity warnings.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

