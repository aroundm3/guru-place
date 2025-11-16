"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"

export default function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const prevPathnameRef = useRef<string>("")

  useEffect(() => {
    const currentPath = pathname + searchParams.toString()

    // Only show loading if pathname actually changed
    if (prevPathnameRef.current !== currentPath) {
      prevPathnameRef.current = currentPath

      // Start loading
      setLoading(true)
      setProgress(0)

      // Simulate progress with easing
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15
        if (currentProgress >= 90) {
          currentProgress = 90
          clearInterval(interval)
        }
        setProgress(currentProgress)
      }, 100)

      // Complete loading after route is ready
      const timeout = setTimeout(() => {
        setProgress(100)
        setTimeout(() => {
          setLoading(false)
          setProgress(0)
        }, 150)
      }, 200)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [pathname, searchParams])

  // Handle link clicks to show loading immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (
        link &&
        link.href &&
        !link.target &&
        link.href.startsWith(window.location.origin)
      ) {
        const href = new URL(link.href).pathname + new URL(link.href).search
        if (href !== pathname + searchParams.toString()) {
          setLoading(true)
          setProgress(10)
        }
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 transition-all duration-200 ease-out shadow-lg"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(236, 72, 153, 0.5)",
        }}
      />
    </div>
  )
}
