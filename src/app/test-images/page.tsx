"use client"

import { useEffect } from "react"
import Image from "next/image"

export default function TestImagesPage() {
  useEffect(() => {
    console.log("=== IMAGE TEST PAGE ===")
    console.log("Current pathname:", window.location.pathname)
    console.log("Current origin:", window.location.origin)
    console.log("Base path from config: /portal")
    
    // Test image URLs
    const testUrls = [
      "/image-login.jpg",
      "/portal/image-login.jpg",
      "/image-signup.jpg", 
      "/portal/image-signup.jpg"
    ]
    
    testUrls.forEach(url => {
      const img = new window.Image()
      img.onload = () => console.log(`✅ SUCCESS: ${url} loaded`)
      img.onerror = () => console.log(`❌ FAILED: ${url} failed to load`)
      img.src = url
    })
  }, [])

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Image Loading Test</h1>
      <p className="text-muted-foreground">Check your browser console for detailed logs</p>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test 1: Regular img tag with /image-login.jpg</h2>
        <div className="border-2 border-blue-500 p-4">
          <img 
            src="/image-login.jpg" 
            alt="Test 1"
            className="w-full h-48 object-cover"
            onLoad={() => console.log("✅ img tag /image-login.jpg LOADED")}
            onError={(e) => console.log("❌ img tag /image-login.jpg FAILED", e)}
          />
        </div>

        <h2 className="text-xl font-semibold">Test 2: Regular img tag with /portal/image-login.jpg</h2>
        <div className="border-2 border-green-500 p-4">
          <img 
            src="/portal/image-login.jpg" 
            alt="Test 2"
            className="w-full h-48 object-cover"
            onLoad={() => console.log("✅ img tag /portal/image-login.jpg LOADED")}
            onError={(e) => console.log("❌ img tag /portal/image-login.jpg FAILED", e)}
          />
        </div>

        <h2 className="text-xl font-semibold">Test 3: Next.js Image with /image-login.jpg</h2>
        <div className="border-2 border-purple-500 p-4 relative h-48">
          <Image
            src="/image-login.jpg"
            alt="Test 3"
            fill
            className="object-cover"
            unoptimized
            onLoad={() => console.log("✅ Next Image /image-login.jpg LOADED")}
            onError={(e) => console.log("❌ Next Image /image-login.jpg FAILED", e)}
          />
        </div>

        <h2 className="text-xl font-semibold">Test 4: Next.js Image with /portal/image-login.jpg</h2>
        <div className="border-2 border-red-500 p-4 relative h-48">
          <Image
            src="/portal/image-login.jpg"
            alt="Test 4"
            fill
            className="object-cover"
            unoptimized
            onLoad={() => console.log("✅ Next Image /portal/image-login.jpg LOADED")}
            onError={(e) => console.log("❌ Next Image /portal/image-login.jpg FAILED", e)}
          />
        </div>

        <h2 className="text-xl font-semibold">Test 5: Signup Image</h2>
        <div className="border-2 border-orange-500 p-4">
          <img 
            src="/image-signup.jpg" 
            alt="Test 5"
            className="w-full h-48 object-cover"
            onLoad={() => console.log("✅ img tag /image-signup.jpg LOADED")}
            onError={(e) => console.log("❌ img tag /image-signup.jpg FAILED", e)}
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open your browser's Developer Tools (F12)</li>
          <li>Go to the Console tab</li>
          <li>Look for the log messages showing which URLs work</li>
          <li>Check the Network tab to see actual HTTP requests</li>
          <li>Screenshot the results and share with me!</li>
        </ol>
      </div>
    </div>
  )
}

