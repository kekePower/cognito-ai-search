"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "performance" in window) {
      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime)
          }
          if (entry.entryType === "first-input") {
            console.log("FID:", entry.processingStart - entry.startTime)
          }
          if (entry.entryType === "layout-shift") {
            if (!entry.hadRecentInput) {
              console.log("CLS:", entry.value)
            }
          }
        }
      })

      observer.observe({ entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"] })

      // Monitor navigation timing
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        console.log("Page Load Time:", navigation.loadEventEnd - navigation.fetchStart)
        console.log("DOM Content Loaded:", navigation.domContentLoadedEventEnd - navigation.fetchStart)
        console.log("Time to Interactive:", navigation.domInteractive - navigation.fetchStart)
      })

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return null
}