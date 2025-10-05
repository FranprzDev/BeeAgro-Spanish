"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface Province {
  id: string
  name: string
  position: { x: number; y: number }
  description: string
}

const provinces: Province[] = [
  {
    id: "tucuman",
    name: "Tucumán",
    position: { x: 48, y: 28 },
    description: "Cultivos de caña de azúcar y cítricos",
  },
  {
    id: "mendoza",
    name: "Mendoza",
    position: { x: 35, y: 55 },
    description: "Viñedos y agricultura de regadío",
  },
  {
    id: "corrientes",
    name: "Corrientes",
    position: { x: 65, y: 38 },
    description: "Cultivos de arroz y ganadería",
  },
]

interface ArgentinaMapIntroProps {
  onProvinceSelect: (provinceId: string) => void
}

export function ArgentinaMapIntro({ onProvinceSelect }: ArgentinaMapIntroProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4">
      <Card className="max-w-6xl w-full p-8 lg:p-12 border-2 border-primary/20 shadow-lg">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Api and text */}
          <div className="space-y-6">
            <h1
              className="font-serif text-5xl lg:text-6xl font-bold text-primary mb-8"
              style={{ fontFamily: "cursive" }}
            >
              BeeAgro
            </h1>

            <div className="flex flex-col items-center lg:items-start space-y-6">
              <Image src="/images/api-bee.png" alt="Api la abeja" width={280} height={280} className="object-contain" />

              <div className="text-center lg:text-left space-y-2">
                <p className="text-2xl lg:text-3xl font-handwriting leading-relaxed" style={{ fontFamily: "cursive" }}>
                  Soy Api, la abeja
                </p>
                <p className="text-2xl lg:text-3xl font-handwriting leading-relaxed" style={{ fontFamily: "cursive" }}>
                  que guiará a conocer
                </p>
                <p className="text-2xl lg:text-3xl font-handwriting leading-relaxed" style={{ fontFamily: "cursive" }}>
                  las tecnologías de cultivos
                </p>
                <p className="text-2xl lg:text-3xl font-handwriting leading-relaxed" style={{ fontFamily: "cursive" }}>
                  sustentables
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Argentina map */}
          <div className="relative">
            <div className="relative w-full aspect-[3/4]">
              {/* Argentina map SVG */}
              <svg viewBox="0 0 100 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Argentina outline - simplified */}
                <path
                  d="M 50 10 L 55 12 L 60 15 L 65 20 L 68 25 L 70 30 L 72 35 L 73 40 L 72 45 L 70 50 L 68 55 L 65 60 L 63 65 L 60 70 L 58 75 L 56 80 L 54 85 L 52 90 L 50 95 L 48 100 L 46 105 L 44 110 L 42 115 L 40 120 L 38 125 L 36 130 L 35 135 L 40 135 L 42 130 L 44 125 L 46 120 L 48 115 L 50 110 L 52 105 L 54 100 L 56 95 L 58 90 L 60 85 L 62 80 L 64 75 L 66 70 L 68 65 L 70 60 L 72 55 L 74 50 L 76 45 L 78 40 L 80 35 L 78 30 L 76 25 L 74 20 L 70 15 L 65 12 L 60 10 Z"
                  fill="none"
                  stroke="#8B7355"
                  strokeWidth="1.5"
                />

                {/* More detailed Argentina outline */}
                <path
                  d="M 45 8 Q 50 6 55 8 Q 62 10 68 15 Q 72 20 75 28 Q 77 35 78 42 Q 78 48 76 54 Q 74 60 70 66 Q 68 72 65 78 Q 62 84 58 90 Q 56 96 54 102 Q 52 108 50 114 Q 48 120 46 126 Q 44 132 42 138 L 38 138 Q 36 132 38 126 Q 40 120 42 114 Q 44 108 46 102 Q 48 96 50 90 Q 52 84 54 78 Q 56 72 58 66 Q 60 60 62 54 Q 64 48 64 42 Q 64 35 62 28 Q 58 20 52 15 Q 48 10 45 8 Z"
                  fill="#FFFFFF"
                  stroke="#6B5D4F"
                  strokeWidth="1"
                />
              </svg>

              {/* Hoe icons on provinces */}
              {provinces.map((province) => (
                <button
                  key={province.id}
                  className="absolute group transition-transform hover:scale-110 active:scale-95"
                  style={{
                    left: `${province.position.x}%`,
                    top: `${province.position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => onProvinceSelect(province.id)}
                  onMouseEnter={() => setHoveredProvince(province.id)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  aria-label={`Seleccionar ${province.name}`}
                >
                  <div className="relative">
                    <Image
                      src="/images/hoe-icon.png"
                      alt={`Azada en ${province.name}`}
                      width={48}
                      height={48}
                      className="drop-shadow-lg group-hover:drop-shadow-xl transition-all"
                    />

                    {/* Tooltip */}
                    {hoveredProvince === province.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
                        <div className="font-semibold">{province.name}</div>
                        <div className="text-xs opacity-90">{province.description}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Haz clic en una azada para explorar esa región
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
