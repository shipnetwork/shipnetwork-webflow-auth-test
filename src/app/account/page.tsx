"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { getMemberstack } from "@/lib/memberstack"
import { useEffect, useState } from "react"

export default function AccountPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [hasPassword, setHasPassword] = useState(true)
  const [authProviders, setAuthProviders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function loadMemberData() {
      try {
        const memberstack = await getMemberstack()
        const { data: member } = await memberstack.getCurrentMember()

        if (member) {
          setEmail(member.auth?.email || "")
          setFirstName(member.customFields?.["first-name"] || "")
          setLastName(member.customFields?.["last-name"] || "")
          setHasPassword(member.auth?.hasPassword || false)
          setAuthProviders(member.auth?.providers || [])
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load profile data" })
      } finally {
        setIsLoading(false)
      }
    }

    loadMemberData()
  }, [])

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const memberstack = await getMemberstack()

      // Update custom fields
      await memberstack.updateMember({
        customFields: {
          "first-name": firstName,
          "last-name": lastName,
        },
      })

      // Update email if changed (only if not using social login)
      if (authProviders.length === 0) {
        const { data: currentMember } = await memberstack.getCurrentMember()
        if (currentMember?.auth?.email !== email) {
          await memberstack.updateMemberAuth({ email })
        }
      }

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update profile. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const memberstack = await getMemberstack()

      if (hasPassword) {
        // User has existing password - require current password
        await memberstack.updateMemberAuth({
          oldPassword: currentPassword,
          newPassword: newPassword,
        })
        setMessage({ type: "success", text: "Password updated successfully!" })
      } else {
        // OAuth user creating their first password
        await memberstack.updateMemberAuth({
          newPassword: newPassword,
        })
        setMessage({ type: "success", text: "Password created successfully! You can now log in with email and password." })
        setHasPassword(true) // Update state to reflect they now have a password
      }

      setCurrentPassword("")
      setNewPassword("")
    } catch (error: any) {
      // Handle authentication errors gracefully without console.error
      const errorMessage = error.message || error.code || "Failed to update password"
      setMessage({
        type: "error",
        text: errorMessage.includes("password") || errorMessage.includes("auth")
          ? "Current password is incorrect"
          : "Failed to update password. Please try again."
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Account" />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">Account Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            {message && (
              <div
                className={`rounded-lg p-4 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100"
                    : "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100"
                }`}
              >
                {message.text}
              </div>
            )}

            <Tabs defaultValue="account" className="w-full">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-4">
                <div className="rounded-lg border p-6">
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={isLoading || isSaving}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={isLoading || isSaving}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading || isSaving || authProviders.length > 0}
                        />
                        {authProviders.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Email is managed by your social login provider and cannot be changed here
                          </p>
                        )}
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading || isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="rounded-lg border p-6">
                  {!hasPassword && authProviders.length > 0 ? (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">Social Login</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          You signed in with a social provider
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm">
                          You're using a social provider to sign in. Your password is managed by your social login provider, so you cannot change it here.
                        </p>
                        <p className="text-sm mt-2 text-muted-foreground">
                          To manage your password, please visit your social provider's account settings.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">
                          {hasPassword ? "Change Password" : "Create Password"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {hasPassword
                            ? "Update your password to keep your account secure"
                            : "Create a password to secure your account"}
                        </p>
                      </div>

                      <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-4">
                          {hasPassword && (
                            <div className="grid gap-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={isSaving}
                                required
                              />
                            </div>
                          )}

                          <div className="grid gap-2">
                            <Label htmlFor="newPassword">
                              {hasPassword ? "New Password" : "Password"}
                            </Label>
                            <Input
                              id="newPassword"
                              type="password"
                              placeholder={hasPassword ? "Enter your new password" : "Create a password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              disabled={isSaving}
                              required
                            />
                          </div>
                        </div>

                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? "Saving..." : hasPassword ? "Update Password" : "Create Password"}
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
