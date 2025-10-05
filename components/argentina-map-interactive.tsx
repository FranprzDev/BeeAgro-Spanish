"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles, MapPin } from "lucide-react"

interface Province {
  id: string
  name: string
  capital: string
  position: { x: number; y: number }
  description: string
}

const provinces: Province[] = [
  {
    id: "tucuman",
    name: "Tucumán",
    capital: "San Miguel de Tucumán",
    position: { x: 48, y: 28 },
    description: "Cultivos de caña de azúcar y limones",
  },
  {
    id: "mendoza",
    name: "Mendoza",
    capital: "Mendoza",
    position: { x: 35, y: 55 },
    description: "Viñedos y agricultura de montaña",
  },
  {
    id: "corrientes",
    name: "Corrientes",
    capital: "Corrientes",
    position: { x: 65, y: 42 },
    description: "Cultivos de arroz y ganadería",
  },
]

interface ArgentinaMapInteractiveProps {
  onProvinceSelect: (provinceId: string) => void
}

export function ArgentinaMapInteractive({ onProvinceSelect }: ArgentinaMapInteractiveProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)

  const handleProvinceClick = (provinceId: string) => {
    setSelectedProvince(provinceId)
    setTimeout(() => {
      onProvinceSelect(provinceId)
    }, 500)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Argentina Map SVG */}
      <div className="relative w-full max-w-2xl aspect-[3/4]">
        <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
          {/* Argentina outline - simplified */}
          <path
            d="M 50 10 L 55 15 L 60 18 L 65 22 L 68 28 L 70 35 L 72 42 L 73 50 L 72 58 L 70 65 L 68 72 L 65 80 L 62 88 L 58 96 L 54 104 L 50 112 L 46 120 L 44 128 L 42 135 L 40 132 L 38 125 L 36 118 L 34 110 L 32 102 L 30 94 L 28 86 L 26 78 L 25 70 L 24 62 L 25 54 L 27 46 L 30 38 L 33 30 L 36 24 L 40 18 L 45 13 Z"
            fill="#F3F3F2"
            stroke="#557B35"
            strokeWidth="0.5"
            className="transition-all duration-300"
          />

          {/* Province markers */}
          {provinces.map((province) => (
            <g key={province.id}>
              {/* Glow effect when hovered */}
              {hoveredProvince === province.id && (
                <circle
                  cx={province.position.x}
                  cy={province.position.y}
                  r="8"
                  fill="#F8E985"
                  opacity="0.4"
                  className="animate-pulse-glow"
                />
              )}

              {/* Hoe icon clickable area */}
              <g
                onClick={() => handleProvinceClick(province.id)}
                onMouseEnter={() => setHoveredProvince(province.id)}
                onMouseLeave={() => setHoveredProvince(null)}
                className="cursor-pointer transition-transform duration-300 hover:scale-110"
                style={{
                  transform: hoveredProvince === province.id ? "scale(1.2)" : "scale(1)",
                  transformOrigin: `${province.position.x}px ${province.position.y}px`,
                }}
              >
                {/* Hoe icon background circle */}
                <circle
                  cx={province.position.x}
                  cy={province.position.y}
                  r="4"
                  fill={selectedProvince === province.id ? "#F8E985" : "#A6D672"}
                  className="transition-all duration-300"
                />

                {/* Hoe icon simplified */}
                <path
                  d={`M ${province.position.x - 1.5} ${province.position.y - 2} L ${province.position.x + 1.5} ${province.position.y - 2} L ${province.position.x + 1} ${province.position.y + 2} L ${province.position.x - 1} ${province.position.y + 2} Z`}
                  fill="#947355"
                />
                <path
                  d={`M ${province.position.x - 2} ${province.position.y - 3} L ${province.position.x + 2} ${province.position.y - 3} L ${province.position.x + 1.5} ${province.position.y - 2} L ${province.position.x - 1.5} ${province.position.y - 2} Z`}
                  fill="#C0C0C0"
                />
              </g>

              {/* Province label */}
              {hoveredProvince === province.id && (
                <text
                  x={province.position.x}
                  y={province.position.y + 8}
                  textAnchor="middle"
                  fill="#557B35"
                  fontSize="3"
                  fontWeight="bold"
                  className="animate-fade-in"
                >
                  {province.name}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Floating hoe icons with images */}
        {provinces.map((province) => (
          <div
            key={`hoe-${province.id}`}
            className="absolute cursor-pointer transition-all duration-300 hover:scale-125"
            style={{
              left: `${province.position.x}%`,
              top: `${province.position.y}%`,
              transform: "translate(-50%, -50%)",
              animation: `float ${2 + provinces.indexOf(province) * 0.5}s ease-in-out infinite`,
            }}
            onClick={() => handleProvinceClick(province.id)}
            onMouseEnter={() => setHoveredProvince(province.id)}
            onMouseLeave={() => setHoveredProvince(null)}
          >
            <div className={`relative w-12 h-12 ${selectedProvince === province.id ? "animate-pulse-glow" : ""}`}>
              <Image
                src="/images/hoe-icon.png"
                alt={`${province.name} - ${province.capital}`}
                fill
                className="object-contain drop-shadow-lg"
              />
              {hoveredProvince === province.id && (
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-[#F8E985] animate-pulse" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Province info tooltip */}
        {hoveredProvince && (
          <div
            className="absolute bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border-2 border-[#A6D672] animate-fade-in"
            style={{
              left: `${provinces.find((p) => p.id === hoveredProvince)!.position.x}%`,
              top: `${provinces.find((p) => p.id === hoveredProvince)!.position.y - 15}%`,
              transform: "translate(-50%, -100%)",
              minWidth: "200px",
            }}
          >
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-[#557B35] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[#557B35] text-lg">
                  {provinces.find((p) => p.id === hoveredProvince)!.name}
                </h3>
                <p className="text-sm text-[#947355] font-medium">
                  {provinces.find((p) => p.id === hoveredProvince)!.capital}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {provinces.find((p) => p.id === hoveredProvince)!.description}
                </p>
                <Button size="sm" className="mt-2 w-full bg-[#A6D672] hover:bg-[#557B35] text-white">
                  ¡Explorar granja!
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
