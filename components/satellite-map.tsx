"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layers, Droplets, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

type MapLayer = "ndvi" | "humidity" | "base"

interface PlotData {
  id: string
  name: string
  ndvi: number // 0-1 scale
  humidity: number // 0-100 scale
  x: number // Position on map
  y: number
  width: number
  height: number
}

interface SatelliteMapProps {
  plots: PlotData[]
  activeLayer: MapLayer
  onLayerChange: (layer: MapLayer) => void
  onPlotClick?: (plot: PlotData) => void
  selectedPlotId?: string
}

export function SatelliteMap({ plots, activeLayer, onLayerChange, onPlotClick, selectedPlotId }: SatelliteMapProps) {
  const getPlotColor = (plot: PlotData) => {
    if (activeLayer === "ndvi") {
      if (plot.ndvi < 0.3) return "bg-vegetation-poor"
      if (plot.ndvi < 0.5) return "bg-vegetation-low"
      if (plot.ndvi < 0.7) return "bg-vegetation-medium"
      return "bg-vegetation-good"
    }

    if (activeLayer === "humidity") {
      if (plot.humidity < 30) return "bg-env-temperature"
      if (plot.humidity < 50) return "bg-warning"
      if (plot.humidity < 70) return "bg-env-humidity"
      return "bg-env-precipitation"
    }

    return "bg-env-growth/30" // Base layer
  }

  const getPlotLabel = (plot: PlotData) => {
    if (activeLayer === "ndvi") return `NDVI: ${plot.ndvi.toFixed(2)}`
    if (activeLayer === "humidity") return `${plot.humidity}%`
    return plot.name
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-semibold text-primary">Mapa Satelital - La Próspera</h3>

        <div className="flex gap-2">
          <Button
            variant={activeLayer === "base" ? "default" : "outline"}
            size="sm"
            onClick={() => onLayerChange("base")}
            className="gap-2"
          >
            <Layers className="h-4 w-4" />
            Base
          </Button>
          <Button
            variant={activeLayer === "ndvi" ? "default" : "outline"}
            size="sm"
            onClick={() => onLayerChange("ndvi")}
            className="gap-2"
          >
            <Leaf className="h-4 w-4" />
            NDVI
          </Button>
          <Button
            variant={activeLayer === "humidity" ? "default" : "outline"}
            size="sm"
            onClick={() => onLayerChange("humidity")}
            className="gap-2"
          >
            <Droplets className="h-4 w-4" />
            Humedad
          </Button>
        </div>
      </div>

      {/* Map visualization */}
      <div className="relative w-full aspect-video bg-gradient-to-b from-sky-200 to-green-100 rounded-lg overflow-hidden border-2 border-primary/20">
        {/* Sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-transparent h-1/3" />

        {/* Farm plots */}
        <div className="relative w-full h-full p-4">
          {plots.map((plot) => (
            <button
              key={plot.id}
              onClick={() => onPlotClick?.(plot)}
              className={cn(
                "absolute border-2 border-primary/40 rounded transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-lg group",
                getPlotColor(plot),
                selectedPlotId === plot.id && "ring-4 ring-primary scale-105 border-primary",
              )}
              style={{
                left: `${plot.x}%`,
                top: `${plot.y}%`,
                width: `${plot.width}%`,
                height: `${plot.height}%`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                  {getPlotLabel(plot)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Legend */}
        {activeLayer !== "base" && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <p className="text-xs font-semibold mb-2 text-primary">
              {activeLayer === "ndvi" ? "Índice NDVI" : "Humedad del Suelo"}
            </p>
            <div className="flex flex-col gap-1">
              {activeLayer === "ndvi" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-vegetation-poor rounded" />
                    <span className="text-xs">Bajo (0-0.3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-vegetation-low rounded" />
                    <span className="text-xs">Medio (0.3-0.5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-vegetation-medium rounded" />
                    <span className="text-xs">Bueno (0.5-0.7)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-vegetation-good rounded" />
                    <span className="text-xs">Excelente (0.7-1.0)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-env-temperature rounded" />
                    <span className="text-xs">Seco (0-30%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-warning rounded" />
                    <span className="text-xs">Bajo (30-50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-env-humidity rounded" />
                    <span className="text-xs">Óptimo (50-70%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-env-precipitation rounded" />
                    <span className="text-xs">Húmedo (70-100%)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
