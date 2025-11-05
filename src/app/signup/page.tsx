"use client"

import { useEffect } from "react"
import { SignupForm } from "@/components/signup-form"
import Image from "next/image"

export default function SignupPage() {
  useEffect(() => {
    console.log("SIGNUP PAGE - Attempting to load: /image-signup.jpg")
  }, [])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center">
          <a href="/" className="flex items-center">
            <img 
              src="https://cdn.prod.website-files.com/62c7655349d9e17aad25bb35/6578f055736885dadcb8a919_ShipNetwork%20Logo-Horizontal-Blue%20and%20Black%201.svg" 
              alt="ShipNetwork" 
              className="h-6 w-auto"
              onLoad={() => console.log("✅ Logo SVG loaded successfully")}
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative bg-muted">
        <Image
          src="/portal/image-signup.jpg"
          alt="ShipNetwork Customer"
          fill
          className="object-cover"
          priority
          unoptimized
          onLoad={() => console.log("✅ SIGNUP IMAGE LOADED SUCCESSFULLY")}
          onError={(e) => console.error("❌ SIGNUP IMAGE FAILED TO LOAD:", e)}
        />
      </div>
    </div>
  )
}
