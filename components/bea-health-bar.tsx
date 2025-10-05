"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, AlertTriangle, Skull } from "lucide-react"
import { cn } from "@/lib/utils"

interface BeaHealthBarProps {
  health: number // 0-100
  className?: string
}

export function BeaHealthBar({ health, className }: BeaHealthBarProps) {
  const getHealthStatus = () => {
    if (health > 70)
      return { label: "Saludable", color: "text-success-foreground", icon: Heart, bgColor: "bg-health-good" }
    if (health > 40)
      return {
        label: "Preocupada",
        color: "text-warning-foreground",
        icon: AlertTriangle,
        bgColor: "bg-health-warning",
      }
    return { label: "En Peligro", color: "text-destructive-foreground", icon: Skull, bgColor: "bg-health-danger" }
  }

  const status = getHealthStatus()
  const Icon = status.icon

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-5 w-5", status.color)} />
            <span className="font-semibold text-foreground">Salud de Bea</span>
          </div>
          <span className={cn("text-sm font-semibold", status.color)}>{status.label}</span>
        </div>

        <div className="space-y-2">
          <Progress value={health} className="h-3" indicatorClassName={status.bgColor} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-semibold text-foreground">{health}%</span>
            <span>100%</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {health > 70 && "Bea está feliz y saludable. El ecosistema prospera y la polinización es óptima."}
          {health > 40 &&
            health <= 70 &&
            "Bea está preocupada. Algunas prácticas están afectando su bienestar y el del ecosistema."}
          {health <= 40 && "Bea está en peligro. Las prácticas actuales están dañando gravemente el ecosistema."}
        </p>
      </div>
    </Card>
  )
}
