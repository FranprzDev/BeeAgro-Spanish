"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArgentinaMapOpenStreetMap } from "./argentina-map-openstreetmap"
import {
  Sparkles,
  Leaf,
  Sun,
  Droplets,
  MapPin,
  Sprout,
  Tractor,
  Satellite,
  TreePine,
  Shovel,
  Thermometer,
  Eye,
} from "lucide-react"
import { Footer } from "@/components/footer"

interface WelcomeScreenProps {
  onStart: (provinceId: string) => void
}

const roadmapSteps = [
  {
    id: 1,
    title: "Inherit the Farm",
    description:
      "Your grandfather leaves you his farm in Tucumán. It's the beginning of your responsibility as guardian of the land.",
    icon: Tractor,
  },
  {
    id: 2,
    title: "Choose the Crop",
    description: "You decide to plant lemons. A decision that will shape the future of your farm and your learning.",
    icon: Leaf,
  },
  {
    id: 3,
    title: "Prepare the Soil",
    description: "Analyze the soil, its texture, fertility, and drainage. The foundation of every successful crop.",
    icon: Shovel,
  },
  {
    id: 4,
    title: "Plant the Lemon Trees",
    description: "Spring in Tucumán. You must decide when and how to plant. Irrigation will be key to establishment.",
    icon: Sprout,
  },
  {
    id: 5,
    title: "First Summer",
    description:
      "The heat arrives. Monitor NDVI, soil moisture, and temperature. Your decisions will determine plant vigor.",
    icon: Thermometer,
  },
  {
    id: 6,
    title: "Water Management",
    description: "Learn to use drip irrigation, cover crops, and read satellite data to optimize water use.",
    icon: Droplets,
  },
  {
    id: 7,
    title: "Satellite Monitoring",
    description: "Master the use of NDVI and satellite data to make decisions based on real information.",
    icon: Satellite,
  },
  {
    id: 8,
    title: "Regenerative Agriculture",
    description: "Implement practices that improve the ecosystem: organic matter, soil microbiology, biodiversity.",
    icon: TreePine,
  },
]

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [showMap, setShowMap] = useState(false)

  if (showMap) {
    return (
      <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
        {/* Animated clouds */}
        <div className="absolute top-10 left-10 w-32 h-16 bg-white/40 rounded-full blur-xl animate-float" />
        <div
          className="absolute top-20 right-20 w-40 h-20 bg-white/30 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-40 left-1/3 w-36 h-18 bg-white/35 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-6xl font-bold text-[#557B35] mb-4" style={{ fontFamily: "cursive" }}>
              BeeAgro
            </h1>
            <p className="text-2xl text-[#947355] font-medium mb-2">Choose your province to begin</p>
          </div>

          <div className="max-w-4xl mx-auto mb-6"></div>

          <ArgentinaMapOpenStreetMap onProvinceSelect={onStart} />

          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setShowMap(false)}
              className="border-2 border-[#557B35] text-[#557B35] hover:bg-[#A6D672] hover:text-white"
            >
              Back
            </Button>
          </div>
        </div>

        {/* Grass at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-grass-gradient" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-y-auto">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white/40 rounded-full blur-xl animate-float" />
      <div
        className="absolute top-20 right-20 w-40 h-20 bg-white/30 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-40 left-1/3 w-36 h-18 bg-white/35 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      {/* Sun */}
      <div className="absolute top-8 right-8">
        <Sun className="w-24 h-24 text-[#F8E985] animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-8xl font-bold text-[#557B35] mb-4 drop-shadow-lg" style={{ fontFamily: "cursive" }}>
              BeeAgro
            </h1>
            <div className="flex items-center justify-center gap-2 text-2xl text-[#947355] font-medium">
              <Leaf className="w-8 h-8 text-[#A6D672]" />
              <span className="text-[#947355]">Cultivating Data, Harvesting Knowledge</span>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Api character and text */}
            <div className="text-center md:text-left space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative w-64 h-64 mx-auto md:mx-0 animate-bounce-gentle">
                <Image src="/images/api-bee.png" alt="Api the bee" fill className="object-contain drop-shadow-2xl" />
                <div className="absolute -top-4 -right-4">
                  <Sparkles className="w-12 h-12 text-[#F8E985] animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-[#557B35]" style={{ fontFamily: "cursive" }}>
                  Hello! I'm Api
                </h2>
                <p className="text-xl text-[#947355] leading-relaxed">
                  The bee that will guide you to learn about sustainable farming technologies
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <Leaf className="w-5 h-5 text-[#A6D672]" />
                    <span className="text-sm font-medium text-[#557B35]">Regenerative Agriculture</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <Droplets className="w-5 h-5 text-[#B8E0F9]" />
                    <span className="text-sm font-medium text-[#557B35]">Satellite Data</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setShowMap(true)}
                className="bg-[#A6D672] hover:bg-[#557B35] text-white text-2xl px-12 py-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 animate-pulse-glow"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Start Adventure!
              </Button>
            </div>

            {/* Right side - Feature cards */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#A6D672] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#A6D672] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#557B35] mb-2">Learn by Farming</h3>
                    <p className="text-[#947355]">
                      Discover sustainable agricultural practices while managing your own virtual farm
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#F8E985] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F8E985] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-[#557B35]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#557B35] mb-2">Real Data</h3>
                    <p className="text-[#947355]">
                      Use real satellite information (NDVI, moisture) to make smart decisions
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#B8E0F9] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#B8E0F9] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sun className="w-8 h-8 text-[#F8E985]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#557B35] mb-2">Real Impact</h3>
                    <p className="text-[#947355]">
                      Every decision affects ecosystem health and your farm's productivity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-48 bg-gradient-to-b from-[#87CEEB] via-[#7AB55C] to-[#5c4a3a]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6B8E23]/40 to-[#4a3a2a]/60" />
        <div className="absolute inset-0 opacity-40">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 w-1 bg-[#4a5d23]"
              style={{
                left: `${i * 2.5}%`,
                height: `${Math.random() * 70 + 50}px`,
                animation: `float ${Math.random() * 2 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-8 animate-bounce">
          <div className="text-[#fff] text-sm font-medium mb-2">Discover your path beneath the earth</div>
          <div className="w-8 h-8 border-2 border-[#fff] rounded-full flex items-center justify-center mx-auto bg-[#8b7355]/30">
            <div className="w-2 h-2 bg-[#fff] rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-b from-[#5c4a3a] via-[#4a3a2a] to-[#1a0f0a] min-h-screen py-20">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 15% 25%, #2d1f14 2px, transparent 2px),
                             radial-gradient(circle at 45% 55%, #3d2817 1px, transparent 1px),
                             radial-gradient(circle at 75% 35%, #2d1f14 3px, transparent 3px),
                             radial-gradient(circle at 25% 75%, #3d2817 1px, transparent 1px),
                             radial-gradient(circle at 85% 65%, #2d1f14 2px, transparent 2px),
                             radial-gradient(circle at 55% 85%, #3d2817 1px, transparent 1px)`,
              backgroundSize: "150px 150px, 100px 100px, 200px 200px, 120px 120px, 180px 180px, 90px 90px",
            }}
          />
        </div>

        {/* Depth layers - darker as you go down */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d1f14]/30 to-[#1a0f0a]/60" />

        {/* Underground roots and organic matter */}
        <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden opacity-30">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bg-[#5c4a3a]"
              style={{
                left: `${8 + i * 8}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 120 + 60}px`,
                transform: `rotate(${Math.random() * 40 - 20}deg)`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#a68a6a] mb-4" style={{ fontFamily: "cursive" }}>
              Your Learning Path
            </h2>
            <p className="text-xl text-[#8b7355]">
              The deeper you go, the more you learn about sustainable agriculture
            </p>
          </div>

          {/* Roadmap path */}
          <div className="relative">
            {/* Connecting path line - gets darker as it goes down */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
              style={{
                background: "linear-gradient(to bottom, #5c4a3a, #3d2817, #2d1f14)",
              }}
            />

            {roadmapSteps.map((step, index) => {
              const isLeft = index % 2 === 0
              const Icon = step.icon
              const depthProgress = index / (roadmapSteps.length - 1)
              const stoneColor = `hsl(30, ${25 - depthProgress * 15}%, ${45 - depthProgress * 20}%)`
              const cardBg = `hsl(30, ${20 - depthProgress * 10}%, ${55 - depthProgress * 25}%)`
              const textColor = `hsl(30, ${15 - depthProgress * 5}%, ${85 - depthProgress * 30}%)`

              return (
                <div
                  key={step.id}
                  className="relative mb-24 last:mb-0"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {/* Stone/Circle node */}
                  <div className={`flex items-center gap-8 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Content card */}
                    <div className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}>
                      <div
                        className="rounded-2xl p-6 shadow-2xl border-2 transform transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: cardBg,
                          borderColor: stoneColor,
                        }}
                      >
                        <div className={`flex items-center gap-4 ${isLeft ? "flex-row-reverse" : "flex-row"}`}>
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2"
                            style={{
                              backgroundColor: stoneColor,
                              borderColor: `hsl(30, ${20 - depthProgress * 10}%, ${35 - depthProgress * 15}%)`,
                            }}
                          >
                            <Icon className="w-8 h-8 text-[#d4c4b0]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
                              {step.title}
                            </h3>
                            <p
                              className="leading-relaxed"
                              style={{ color: `hsl(30, 10%, ${90 - depthProgress * 5}%)` }}
                            >
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center stone node - realistic stone appearance */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 relative z-10 transform transition-all duration-300 hover:scale-110"
                        style={{
                          background: `radial-gradient(circle at 35% 35%, ${stoneColor}, hsl(30, ${20 - depthProgress * 10}%, ${30 - depthProgress * 15}%))`,
                          borderColor: `hsl(30, ${15 - depthProgress * 8}%, ${25 - depthProgress * 12}%)`,
                        }}
                      >
                        <span className="text-3xl font-bold text-[#d4c4b0] drop-shadow-lg">{step.id}</span>
                      </div>
                      {/* Stone texture overlay */}
                      <div
                        className="absolute inset-0 rounded-full opacity-15 pointer-events-none"
                        style={{
                          backgroundImage: `radial-gradient(circle at 40% 40%, #fff 1px, transparent 1px),
                                         radial-gradient(circle at 60% 70%, #000 1px, transparent 1px)`,
                          backgroundSize: "12px 12px, 8px 8px",
                        }}
                      />
                    </div>

                    {/* Spacer for alignment */}
                    <div className="flex-1" />
                  </div>

                  {/* Small stones and particles around the path */}
                  {index < roadmapSteps.length - 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-12 flex gap-2 opacity-40">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: stoneColor,
                            transform: `translateX(${(i - 1) * 15}px)`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Call to action at the end - deep underground */}
          <div className="text-center mt-20 animate-fade-in">
            <div
              className="rounded-3xl p-8 shadow-2xl border-4 max-w-2xl mx-auto"
              style={{
                background: "linear-gradient(135deg, #5c4a3a, #4a3a2a)",
                borderColor: "#3d2817",
              }}
            >
              <Eye className="w-20 h-20 text-[#a68a6a] mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-[#d4c4b0] mb-4" style={{ fontFamily: "cursive" }}>
                Ready to start your journey?
              </h3>
              <p className="text-lg text-[#a68a6a] mb-6">
                You've seen the complete path. Now choose your province and start learning from the roots.
              </p>
              <Button
                size="lg"
                onClick={() => setShowMap(true)}
                className="bg-[#6B5335] hover:bg-[#5c4a3a] text-[#d4c4b0] text-xl px-10 py-6 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 border-2 border-[#8b7355]"
              >
                <MapPin className="w-6 h-6 mr-2" />
                Choose Province
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
