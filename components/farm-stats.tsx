"use client"

import { Card } from "@/components/ui/card"
import { DollarSign, TrendingUp, Flower2, AlertTriangle, Thermometer, Droplets, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EnvironmentalData } from "@/lib/game-state"

interface FarmStatsProps {
  money: number
  productivity: number // 0-100
  biodiversity: number // 0-100
  alerts: number
  environmental?: EnvironmentalData
}

export function FarmStats({ money, productivity, biodiversity, alerts, environmental }: FarmStatsProps) {
  const getSeasonName = (season: string) => {
    const seasons = {
      spring: "Primavera",
      summer: "Verano",
      fall: "Otoño",
      winter: "Invierno",
    }
    return seasons[season as keyof typeof seasons] || season
  }

  return (
    <div className="space-y-4">
      {environmental && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-env-temperature/20 rounded-lg">
                <Thermometer className="h-5 w-5 text-env-temperature" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temperatura</p>
                <p className="text-lg font-semibold text-foreground">
                  {environmental.temperature.min}°C - {environmental.temperature.max}°C
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-env-precipitation/20 rounded-lg">
                <Cloud className="h-5 w-5 text-env-precipitation" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Precipitación</p>
                <p className="text-lg font-semibold text-foreground">{environmental.precipitation}mm</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-env-humidity/20 rounded-lg">
                <Droplets className="h-5 w-5 text-env-humidity" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Humedad Suelo</p>
                <p className="text-lg font-semibold text-foreground">{environmental.soilHumidity}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-yellow-500/10">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🌱</div>
              <div>
                <p className="text-xs text-muted-foreground">Estación</p>
                <p className="text-lg font-semibold text-foreground">{getSeasonName(environmental.season)}</p>
                <p className="text-xs text-muted-foreground">{environmental.month}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Existing farm stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fondos</p>
              <p className="text-lg font-semibold text-foreground">${money.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Productividad</p>
              <p className="text-lg font-semibold text-foreground">{productivity}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Flower2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Biodiversidad</p>
              <p className="text-lg font-semibold text-foreground">{biodiversity}%</p>
            </div>
          </div>
        </Card>

        <Card className={cn("p-4", alerts > 0 && "border-warning/50 bg-warning/5")}>
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", alerts > 0 ? "bg-warning/20" : "bg-muted")}>
              <AlertTriangle
                className={cn("h-5 w-5", alerts > 0 ? "text-warning-foreground" : "text-muted-foreground")}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alertas</p>
              <p className="text-lg font-semibold text-foreground">{alerts}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
