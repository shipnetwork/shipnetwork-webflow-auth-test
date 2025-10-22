"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getMemberstack } from "@/lib/memberstack"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    async function checkAuth() {
      try {
        const memberstack = await getMemberstack()
        const { data: member } = await memberstack.getCurrentMember()

        if (member) {
          setIsAuthenticated(true)
          // If authenticated and on login/signup, redirect to dashboard
          if (isPublicRoute) {
            router.push("/dashboard")
          }
        } else {
          setIsAuthenticated(false)
          // If not authenticated and not on public route, redirect to login
          if (!isPublicRoute) {
            router.push("/login")
          }
        }
      } catch (error) {
        setIsAuthenticated(false)
        if (!isPublicRoute) {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [pathname, router, isPublicRoute])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render children if authentication state matches the route type
  if (isPublicRoute && !isAuthenticated) {
    return <>{children}</>
  }

  if (!isPublicRoute && isAuthenticated) {
    return <>{children}</>
  }

  // Render nothing while redirecting
  return null
}
