"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type BeaHealth = "healthy" | "warning" | "danger"

interface BeaCharacterProps {
  health: BeaHealth
  isAnimating?: boolean
  className?: string
}

export function BeaCharacter({ health, isAnimating = false, className }: BeaCharacterProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative transition-all duration-500",
          isAnimating && "animate-bounce",
          health === "healthy" && "opacity-100 scale-100",
          health === "warning" && "opacity-90 scale-95",
          health === "danger" && "opacity-75 scale-90",
        )}
      >
        <Image
          src="/images/design-mode/Gemini_Generated_Image_rdxcp6rdxcp6rdxc-removebg-preview.png"
          alt="Bea la abeja guía"
          width={120}
          height={120}
          className="drop-shadow-lg"
        />

        <div
          className={cn(
            "absolute inset-0 rounded-full blur-xl transition-all duration-500 -z-10",
            health === "healthy" && "bg-health-good/30",
            health === "warning" && "bg-warning/30",
            health === "danger" && "bg-health-danger/30",
          )}
        />
      </div>

      <div className="mt-2 w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            health === "healthy" && "w-full bg-health-good",
            health === "warning" && "w-2/3 bg-warning",
            health === "danger" && "w-1/3 bg-health-danger",
          )}
        />
      </div>
    </div>
  )
}
