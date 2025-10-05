"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Flower2, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface Effect {
  label: string
  value: number
  icon: React.ElementType
}

interface DecisionFeedbackProps {
  effects: {
    money?: number
    productivity?: number
    biodiversity?: number
    beaHealth?: number
  }
  onComplete?: () => void
}

export function DecisionFeedback({ effects, onComplete }: DecisionFeedbackProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onComplete?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!visible) return null

  const effectsList: Effect[] = []

  if (effects.money !== undefined) {
    effectsList.push({ label: "Fondos", value: effects.money, icon: DollarSign })
  }
  if (effects.productivity !== undefined) {
    effectsList.push({ label: "Productividad", value: effects.productivity, icon: TrendingUp })
  }
  if (effects.biodiversity !== undefined) {
    effectsList.push({ label: "Biodiversidad", value: effects.biodiversity, icon: Flower2 })
  }
  if (effects.beaHealth !== undefined) {
    effectsList.push({ label: "Salud de Bea", value: effects.beaHealth, icon: Heart })
  }

  return (
    <Card className="p-4 border-2 border-primary/50 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="font-serif text-lg font-semibold text-primary mb-3 text-center">Resultados de tu Decisión</h3>

      <div className="grid grid-cols-2 gap-3">
        {effectsList.map((effect) => {
          const Icon = effect.icon
          const isPositive = effect.value > 0
          const isNegative = effect.value < 0

          return (
            <div
              key={effect.label}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg",
                isPositive && "bg-success/10",
                isNegative && "bg-destructive/10",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isPositive && "text-success-foreground",
                  isNegative && "text-destructive-foreground",
                )}
              />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{effect.label}</p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isPositive && "text-success-foreground",
                    isNegative && "text-destructive-foreground",
                  )}
                >
                  {isPositive && "+"}
                  {effect.value}
                  {effect.label !== "Fondos" && "%"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
