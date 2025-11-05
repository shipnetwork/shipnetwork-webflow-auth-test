"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function WelcomeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal")
    
    if (!hasSeenWelcome) {
      // Show modal after a brief delay for better UX
      const timer = setTimeout(() => {
        setOpen(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    // Mark as seen so it doesn't show again
    localStorage.setItem("hasSeenWelcomeModal", "true")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold mb-2">
            Welcome to the ShipNetwork Client Portal
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Open and view your support cases, download client manuals, and browse our support articles.
          </p>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/VKicBxK6_BY"
              title="ShipNetwork Welcome Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

