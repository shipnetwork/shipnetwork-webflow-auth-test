"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getMemberstack } from "@/lib/memberstack"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Get email from sessionStorage
    const savedEmail = sessionStorage.getItem("resetEmail")
    if (savedEmail) {
      setEmail(savedEmail)
    } else {
      // If no email found, redirect to forgot password
      router.push("/forgot-password")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const memberstack = await getMemberstack()

      // Login with the passwordless token (code) to authenticate
      await memberstack.loginMemberPasswordless({
        passwordlessToken: code,
        email,
      })

      // Now update the password
      await memberstack.updateMemberAuth({
        newPassword,
      })

      // Clear the stored email
      sessionStorage.removeItem("resetEmail")

      // Redirect to dashboard (user is now logged in)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please check your code and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Enter reset code</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the 6-digit code we sent to {email} and your new password
        </p>
      </div>
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="code">6-Digit Code</Label>
          <Input
            id="code"
            type="text"
            placeholder="000000"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Resetting password..." : "Reset password"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Didn't receive a code?{" "}
        <Link href="/forgot-password" className="underline underline-offset-4">
          Send again
        </Link>
      </div>
    </form>
  )
}
