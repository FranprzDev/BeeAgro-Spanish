"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Thermometer, Droplets, Mountain, AlertTriangle, Truck, Shield, Sprout, MapPin } from "lucide-react"
import type { ProvinceData } from "@/lib/provinces-data"

interface ProvinceDetailModalProps {
  province: ProvinceData | null
  open: boolean
  onClose: () => void
  onConfirm: (provinceId: string) => void
}

export function ProvinceDetailModal({ province, open, onClose, onConfirm }: ProvinceDetailModalProps) {
  if (!province) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[#557B35] font-serif flex items-center gap-2">
            <MapPin className="w-8 h-8" />
            {province.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Api Character with Introduction */}
          <Card className="bg-gradient-to-r from-[#F8E985]/20 to-[#A6D672]/20 border-2 border-[#A6D672] p-6">
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 flex-shrink-0 animate-bounce-gentle">
                <Image src="/images/api-bee.png" alt="Api la abeja" fill className="object-contain drop-shadow-lg" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#557B35] mb-2">¡Hola! Déjame contarte sobre {province.name}</h3>
                <p className="text-[#947355] leading-relaxed">{province.description}</p>
              </div>
            </div>
          </Card>

          {/* Climate Section */}
          <Card className="p-4 border-2 border-[#B8E0F9]">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-6 h-6 text-[#EF7C6A]" />
              <h3 className="text-lg font-bold text-[#557B35]">Clima</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-semibold text-foreground">{province.climate.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperatura promedio:</span>
                <span className="font-semibold text-foreground">{province.climate.avgTemp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precipitaciones:</span>
                <span className="font-semibold text-foreground">{province.climate.rainfall}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estación:</span>
                <span className="font-semibold text-foreground">{province.climate.season}</span>
              </div>
              <p className="text-muted-foreground italic mt-2">{province.climate.description}</p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Soil Section */}
            <Card className="p-4 border-2 border-[#947355]">
              <div className="flex items-center gap-2 mb-3">
                <Sprout className="w-6 h-6 text-[#947355]" />
                <h3 className="text-lg font-bold text-[#557B35]">Tipo de Suelo</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Textura: </span>
                  <span className="font-semibold text-foreground">{province.soil.texture}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fertilidad: </span>
                  <span className="font-semibold text-foreground">{province.soil.fertility}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Drenaje: </span>
                  <span className="font-semibold text-foreground">{province.soil.drainage}</span>
                </div>
              </div>
            </Card>

            {/* Water Section */}
            <Card className="p-4 border-2 border-[#B8E0F9]">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-6 h-6 text-[#B8E0F9]" />
                <h3 className="text-lg font-bold text-[#557B35]">Disponibilidad de Agua</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Riego: </span>
                  <span className="font-semibold text-foreground">{province.water.irrigation}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fuentes: </span>
                  <span className="font-semibold text-foreground">{province.water.sources}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Lluvias: </span>
                  <span className="font-semibold text-foreground">{province.water.rainfall}</span>
                </div>
              </div>
            </Card>

            {/* Altitude Section */}
            <Card className="p-4 border-2 border-[#A6D672]">
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="w-6 h-6 text-[#557B35]" />
                <h3 className="text-lg font-bold text-[#557B35]">Altitud y Relieve</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Elevación: </span>
                  <span className="font-semibold text-foreground">{province.altitude.elevation}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Terreno: </span>
                  <span className="font-semibold text-foreground">{province.altitude.terrain}</span>
                </div>
              </div>
            </Card>

            {/* Infrastructure Section */}
            <Card className="p-4 border-2 border-[#F8E985]">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-6 h-6 text-[#947355]" />
                <h3 className="text-lg font-bold text-[#557B35]">Infraestructura</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Rutas: </span>
                  <span className="font-semibold text-foreground">{province.infrastructure.roads}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mercados: </span>
                  <span className="font-semibold text-foreground">{province.infrastructure.markets}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Almacenamiento: </span>
                  <span className="font-semibold text-foreground">{province.infrastructure.storage}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Climate Risks */}
          <Card className="p-4 border-2 border-[#EF7C6A]">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-6 h-6 text-[#EF7C6A]" />
              <h3 className="text-lg font-bold text-[#557B35]">Riesgos Climáticos</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {province.risks.map((risk, index) => (
                <Badge key={index} variant="destructive" className="bg-[#EF7C6A]/20 text-[#EF7C6A] border-[#EF7C6A]">
                  {risk}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Environmental Restrictions */}
          <Card className="p-4 border-2 border-[#A6D672]">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-6 h-6 text-[#557B35]" />
              <h3 className="text-lg font-bold text-[#557B35]">Restricciones Ambientales</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Áreas protegidas: </span>
                <span className="font-semibold text-foreground">{province.environmental.protectedAreas}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Normativas: </span>
                <span className="font-semibold text-foreground">{province.environmental.regulations}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Erosión: </span>
                <span className="font-semibold text-foreground">{province.environmental.erosion}</span>
              </div>
            </div>
          </Card>

          {/* Api's Final Message */}
          <Card className="bg-gradient-to-r from-[#A6D672]/20 to-[#F8E985]/20 border-2 border-[#A6D672] p-4">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image src="/images/api-bee.png" alt="Api la abeja" fill className="object-contain" />
              </div>
              <p className="text-[#557B35] font-medium italic">
                "¡Ahora que conoces las características de {province.name}, estás lista/o para comenzar tu aventura
                agrícola! ¿Qué dices, empezamos?"
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-2 border-[#557B35] text-[#557B35] bg-transparent"
            >
              Ver otras provincias
            </Button>
            <Button onClick={() => onConfirm(province.id)} className="bg-[#A6D672] hover:bg-[#557B35] text-white">
              ¡Comenzar en {province.name}!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
