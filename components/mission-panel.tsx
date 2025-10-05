"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Droplets, Thermometer, CloudRain, Calendar } from "lucide-react"
import type { Mission } from "@/lib/missions"
import { cn } from "@/lib/utils"

interface MissionPanelProps {
  mission: Mission
  onComplete?: () => void
  environmental?: {
    temperature: { min: number; max: number }
    precipitation: number
    soilHumidity: number
    season: string
  }
}

export function MissionPanel({ mission, onComplete, environmental }: MissionPanelProps) {
  const getMissionIcon = () => {
    if (mission.id === "mission-1") {
      return "🍋" // Lemon for mission 1
    }
    return "🌱"
  }

  return (
    <Card className="p-4 border-2 border-primary/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{getMissionIcon()}</div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-primary">{mission.title}</h3>
            <p className="text-sm text-muted-foreground">{mission.description}</p>
          </div>
        </div>
        {mission.completed && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
      </div>

      {environmental && mission.id === "mission-1" && (
        <Card className="p-3 mb-4 bg-info/10 border-info">
          <p className="text-xs font-semibold text-info-foreground mb-2">Condiciones Ambientales (NASA):</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-env-temperature" />
              <span className="text-foreground">
                {environmental.temperature.min}°C - {environmental.temperature.max}°C
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CloudRain className="h-3.5 w-3.5 text-env-precipitation" />
              <span className="text-foreground">{environmental.precipitation}mm/mes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-env-humidity" />
              <span className="text-foreground">{environmental.soilHumidity}% humedad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-env-growth" />
              <span className="text-foreground">{environmental.season}</span>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">Objetivos:</p>
        {mission.objectives.map((objective, index) => (
          <div key={index} className="flex items-start gap-2">
            <Circle
              className={cn("h-4 w-4 shrink-0 mt-0.5", mission.completed ? "text-green-600" : "text-muted-foreground")}
            />
            <span className="text-sm text-foreground">{objective}</span>
          </div>
        ))}
      </div>

      {!mission.completed && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning rounded-lg">
          <p className="text-xs font-medium text-warning-foreground">
            💡 <strong>Consejo:</strong> Lee los diálogos de API con atención. Ella te explicará las condiciones y te
            ayudará a tomar la mejor decisión para plantar los limones.
          </p>
        </div>
      )}

      {mission.completed && onComplete && (
        <Button onClick={onComplete} className="w-full mt-4">
          Siguiente Misión
        </Button>
      )}
    </Card>
  )
}
