"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ProvinceDetailModal } from "@/components/province-detail-modal"
import { provincesData, type ProvinceData } from "@/lib/provinces-data"

interface ArgentinaMapOpenStreetMapProps {
  onProvinceSelect: (provinceId: string) => void
}

const argentinaMapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=-73.5889%2C-55.05%2C-53.629%2C-21.5&layer=mapnik"

function latLngToPercent(lat: number, lng: number, mapBounds: any) {
  // Convert longitude to percentage (0-100)
  const xPercent = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100

  // Convert latitude to percentage (0-100)
  // Note: latitude is inverted (north is top, so smaller y values)
  const yPercent = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100

  console.log("[v0] Province position:", { lat, lng, xPercent, yPercent })

  return { x: xPercent, y: yPercent }
}

export function ArgentinaMapOpenStreetMap({ onProvinceSelect }: ArgentinaMapOpenStreetMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null)
  const [showModal, setShowModal] = useState(false)

  const argentinaBounds = {
    north: -21.5,
    south: -55.5,
    west: -73.5,
    east: -53.5,
  }

  const handleProvinceClick = (province: ProvinceData) => {
    console.log("[v0] Province clicked:", province.name)
    setSelectedProvince(province)
    setShowModal(true)
  }

  const handleConfirm = (provinceId: string) => {
    console.log("[v0] Province confirmed:", provinceId)
    setShowModal(false)
    setTimeout(() => {
      onProvinceSelect(provinceId)
    }, 300)
  }

  console.log("[v0] Rendering map with", provincesData.length, "provinces")

  return (
    <>
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Api Character with Instructions */}
        <Card className="mb-6 bg-gradient-to-r from-[#F8E985]/30 to-[#A6D672]/30 border-2 border-[#A6D672] p-6">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 flex-shrink-0 animate-bounce-gentle">
              <Image src="/images/api-bee.png" alt="Api la abeja" fill className="object-contain drop-shadow-lg" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#557B35] mb-2 font-serif">
                ¡Bienvenido/a, futuro/a agricultor/a!
              </h3>
              <p className="text-[#947355] leading-relaxed">
                Soy Api y te ayudaré a elegir la mejor provincia para comenzar tu aventura agrícola. Cada provincia
                tiene características únicas de clima, suelo y recursos.
                <span className="font-semibold text-[#557B35]"> Haz clic en los íconos de azada</span> para conocer más
                sobre cada región.
              </p>
            </div>
          </div>
        </Card>

        {/* Map Container */}
        <div className="relative w-full aspect-[3/4] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#557B35]">
          <iframe
            src={argentinaMapUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            scrolling="no"
            title="Mapa de Argentina"
          />

          {provincesData.map((province) => {
            const position = latLngToPercent(province.position.lat, province.position.lng, argentinaBounds)

            return (
              <button
                key={province.id}
                onClick={() => handleProvinceClick(province)}
                onMouseEnter={() => setHoveredProvince(province.id)}
                onMouseLeave={() => setHoveredProvince(null)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 cursor-pointer z-10 group"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                aria-label={`Seleccionar ${province.name}`}
              >
                <div className="relative w-12 h-12 drop-shadow-lg">
                  <Image
                    src="/images/hoe-icon.png"
                    alt={province.capital}
                    fill
                    className="object-contain transition-transform group-hover:rotate-12"
                  />
                </div>

                {hoveredProvince === province.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-[#557B35] text-white px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap shadow-lg animate-fade-in">
                    {province.name}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-[#557B35]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <ProvinceDetailModal
        province={selectedProvince}
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
      />
    </>
  )
}
