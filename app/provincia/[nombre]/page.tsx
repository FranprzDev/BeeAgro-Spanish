"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useGameState } from "@/lib/game-state"
import Image from "next/image"
import { BeeChatbot } from "@/components/bee-chatbot"

type ChatMessage = {
  id: string
  type: "dialogue" | "milestone" | "feedback" | "system"
  text: string
  timestamp: number
  effects?: any
}

type Crop = {
  id: string
  name: string
  emoji: string
  description: string
  growthMonths: number // Agregado tiempo de cultivo en meses
  effects: {
    money: number
    productivity: number
    biodiversity: number
    beaHealth: number
  }
  monthlyCost: number // Costo mensual por hectárea
  goodFor: string[]
  beeReaction: "happy" | "sleeping"
}

type PlotWithCrop = {
  plotId: string
  crop: Crop
  plantedAt: number // timestamp
  elapsedGameMonths: number // Total game months elapsed since planting
  monthsRemaining: number
}

const CROPS: Crop[] = [
  {
    id: "sugarcane",
    name: "Caña de Azúcar",
    emoji: "🎋",
    description: "Cultivo tradicional de Tucumán, alta rentabilidad",
    growthMonths: 14, // 11-17 meses, promedio 14
    monthlyCost: 500,
    effects: { money: 15000, productivity: 25, biodiversity: 5, beaHealth: 10 },
    goodFor: ["tucuman"],
    beeReaction: "happy",
  },
  {
    id: "soy",
    name: "Soja",
    emoji: "🌱",
    description: "Rentable pero agota el suelo",
    growthMonths: 3.5, // 3-4 meses
    monthlyCost: 300,
    effects: { money: 12000, productivity: 20, biodiversity: -5, beaHealth: 5 },
    goodFor: ["tucuman", "mendoza", "corrientes"],
    beeReaction: "happy",
  },
  {
    id: "lemon",
    name: "Limones",
    emoji: "🍋",
    description: "El oro verde de Tucumán",
    growthMonths: 36, // 3 años injertado
    monthlyCost: 850,
    effects: { money: 13000, productivity: 20, biodiversity: 12, beaHealth: 18 },
    goodFor: ["tucuman"],
    beeReaction: "happy",
  },
  {
    id: "mandarin",
    name: "Mandarinas",
    emoji: "🍊",
    description: "Dulces y jugosas, perfectas para el clima",
    growthMonths: 36, // 3 años injertado
    monthlyCost: 800,
    effects: { money: 11000, productivity: 18, biodiversity: 14, beaHealth: 17 },
    goodFor: ["tucuman", "corrientes"],
    beeReaction: "happy",
  },
  {
    id: "pear",
    name: "Peras",
    emoji: "🍐",
    description: "Requiere clima frío, no ideal para Tucumán",
    growthMonths: 48, // 4 años
    monthlyCost: 700,
    effects: { money: 5000, productivity: 5, biodiversity: -10, beaHealth: -15 },
    goodFor: ["mendoza"],
    beeReaction: "sleeping",
  },
  {
    id: "dragonfruit",
    name: "Frutas del Dragón",
    emoji: "🐉",
    description: "Exótico pero difícil de cultivar aquí",
    growthMonths: 1, // 12-15 meses
    monthlyCost: 600,
    effects: { money: 6000, productivity: 8, biodiversity: -8, beaHealth: -12 },
    goodFor: [],
    beeReaction: "sleeping",
  },
]

export default function ProvinciaGame() {
  const params = useParams()
  const searchParams = useSearchParams()
  const provincia = params.nombre as string
  const useAudio = searchParams.get("useAudioInPresentation") === "true"

  const [activeLayer, setActiveLayer] = useState<"ndvi" | "humidity" | "base">("base")
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null)
  const [showChoices, setShowChoices] = useState(false)

  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [beeReaction, setBeeReaction] = useState<"happy" | "sleeping" | null>(null)

  const [plantedCrops, setPlantedCrops] = useState<PlotWithCrop[]>([])
  const [timeSpeed, setTimeSpeed] = useState(1)
  const [gameTime, setGameTime] = useState(0)
  const [showGameOver, setShowGameOver] = useState(false)

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isChatMinimized, setIsChatMinimized] = useState(false)

  const [showVariableInfo, setShowVariableInfo] = useState<
    "ndvi" | "humidity" | "precipitation" | "temperature" | null
  >(null)

  const [healthChange, setHealthChange] = useState<{ amount: number; id: string } | null>(null)

  const [hudMode, setHudMode] = useState<"plant" | "harvest" | "recommend">("recommend")

  const chatEndRef = useRef<HTMLDivElement>(null)
  const plantedCropsRef = useRef<PlotWithCrop[]>([])
  const lastCostDeductionRef = useRef(0)
  const addMoneyRef = useRef<(amount: number) => void>()
  const addChatMessageRef = useRef<(msg: Omit<ChatMessage, "id" | "timestamp">) => void>()

  const {
    money,
    productivity,
    biodiversity,
    alerts,
    beaHealth,
    plots,
    currentMissionId,
    missions,
    currentDialogueIndex,
    addMoney,
    addProductivity,
    addBiodiversity,
    addBeaHealth,
    updatePlotNdvi,
    completeMission,
    nextDialogue,
    resetDialogue,
    startMission,
  } = useGameState()

  const currentMission = currentMissionId ? missions[currentMissionId] : null
  const currentDialogue = currentMission?.introDialogue[currentDialogueIndex]

  useEffect(() => {
    plantedCropsRef.current = plantedCrops
  }, [plantedCrops])

  useEffect(() => {
    addMoneyRef.current = addMoney
  }, [addMoney])

  useEffect(() => {
    localStorage.removeItem(`chat-${provincia}`)
    initializeChat()
  }, [provincia])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      if (now - lastCostDeductionRef.current >= 60000 / timeSpeed) {
        const totalMonthlyCost = plantedCropsRef.current.reduce((sum, pc) => sum + pc.crop.monthlyCost, 0)
        if (totalMonthlyCost > 0) {
          addMoneyRef.current(-totalMonthlyCost)
        }
        lastCostDeductionRef.current = now
      }

      setPlantedCrops((prev) => {
        const updated = prev.map((pc) => {
          // Calculate how many game months have passed since last update (1 second = timeSpeed months)
          const gameMonthsPerSecond = timeSpeed / 60
          const newElapsedGameMonths = pc.elapsedGameMonths + gameMonthsPerSecond
          const remaining = Math.max(0, pc.crop.growthMonths - newElapsedGameMonths)

          return {
            ...pc,
            elapsedGameMonths: newElapsedGameMonths,
            monthsRemaining: remaining,
          }
        })

        const hasChanges = updated.some((u, i) => Math.abs(u.monthsRemaining - prev[i].monthsRemaining) > 0.01)
        return hasChanges ? updated : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeSpeed, plots])

  useEffect(() => {
    if (beaHealth <= 0 && !showGameOver) {
      setShowGameOver(true)
    }
  }, [beaHealth, showGameOver])

  useEffect(() => {
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    return () => clearTimeout(timer)
  }, [chatHistory.length])

  const initializeChat = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      type: "system",
      text: `¡Bienvenido a tu tierra en ${provincia.charAt(0).toUpperCase() + provincia.slice(1)}! Soy API, tu abeja guía. 🐝\n\nPrimera misión: Vamos a decidir qué plantar en cada lote. Observa los valores de NDVI (salud de la vegetación) y elige el lote con mayor NDVI para comenzar. ¡Toca uno de los lotes para ver las opciones de cultivo!`,
      timestamp: Date.now(),
    }
    setChatHistory([welcomeMessage])
  }, [provincia])

  const addChatMessage = useCallback((message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }

    setChatHistory((prev) => {
      const isDuplicate = prev.some(
        (msg) => msg.text === newMessage.text && msg.type === newMessage.type && Date.now() - msg.timestamp < 2000,
      )
      if (isDuplicate) return prev
      return [...prev, newMessage]
    })
  }, [])

  useEffect(() => {
    addChatMessageRef.current = addChatMessage
  }, [addChatMessage])

  const beaHealthStatus = beaHealth > 70 ? "healthy" : beaHealth > 40 ? "warning" : "danger"

  const bestPlot = useMemo(() => {
    return plots.reduce((best, current) => (current.ndvi > best.ndvi ? current : best), plots[0])
  }, [plots])

  const handlePlotClick = useCallback(
    (plot: any) => {
      const plantedCrop = plantedCropsRef.current.find((pc) => pc.plotId === plot.id && pc.monthsRemaining > 0)
      const isReadyToHarvest = plantedCropsRef.current.find((pc) => pc.plotId === plot.id && pc.monthsRemaining === 0)

      if (hudMode === "harvest") {
        if (isReadyToHarvest) {
          handleHarvest(plot.id)
        } else if (plantedCrop) {
          addChatMessage({
            type: "dialogue",
            text: `Este cultivo aún no está listo para cosechar. Faltan ${plantedCrop.monthsRemaining.toFixed(1)} meses. 🌱`,
          })
        } else {
          addChatMessage({
            type: "dialogue",
            text: `No hay nada para cosechar en ${plot.name}. Primero debes plantar algo. 🌾`,
          })
        }
        return
      }

      if (hudMode === "plant") {
        if (plantedCrop) {
          addChatMessage({
            type: "dialogue",
            text: `Este lote ya tiene un cultivo creciendo. ¡Espera a que esté listo para cosechar! 🌱`,
          })
          return
        }
        setSelectedPlot(plot.id)
        setShowCropModal(true)
        return
      }

      // hudMode === "recommend" - Original behavior
      if (plantedCrop) {
        addChatMessage({
          type: "dialogue",
          text: `Este lote ya tiene ${plantedCrop.crop.name} creciendo. Faltan ${plantedCrop.monthsRemaining.toFixed(1)} meses para cosechar. 🌱`,
        })
        return
      }

      setSelectedPlot(plot.id)

      if (plot.id === bestPlot.id) {
        addChatMessage({
          type: "dialogue",
          text: `¡Excelente elección! ${plot.name} tiene el NDVI más alto (${plot.ndvi.toFixed(2)}), lo que significa que la tierra está saludable y lista para un buen cultivo. 🌟\n\nTe recomiendo usar el botón de semilla 🌱 del HUD para plantar aquí.`,
        })
      } else {
        addChatMessage({
          type: "dialogue",
          text: `Hmm, ${plot.name} tiene un NDVI de ${plot.ndvi.toFixed(2)}. Te recomendaría ${bestPlot.name} que tiene ${bestPlot.ndvi.toFixed(2)}, ¡tiene mejor salud del suelo! 💡\n\nSi quieres plantar aquí de todas formas, usa el botón de semilla 🌱 del HUD.`,
        })
      }
    },
    [bestPlot, addChatMessage, hudMode],
  )

  const handleCropSelect = useCallback((crop: Crop) => {
    setSelectedCrop(crop)
    setBeeReaction(crop.beeReaction)
    setShowConfirmation(true)
  }, [])

  const showHealthFeedback = useCallback((amount: number) => {
    const id = `health-${Date.now()}-${Math.random()}`
    setHealthChange({ amount, id })
    setTimeout(() => {
      setHealthChange(null)
    }, 2000)
  }, [])

  const handleConfirmCrop = useCallback(() => {
    if (!selectedPlot || !selectedCrop) return

    const now = Date.now()

    setPlantedCrops((prev) => [
      ...prev,
      {
        plotId: selectedPlot,
        crop: selectedCrop,
        plantedAt: now,
        elapsedGameMonths: 0,
        monthsRemaining: selectedCrop.growthMonths,
      },
    ])

    if (selectedCrop.effects.money) addMoney(selectedCrop.effects.money)
    if (selectedCrop.effects.productivity) addProductivity(selectedCrop.effects.productivity)
    if (selectedCrop.effects.biodiversity) addBiodiversity(selectedCrop.effects.biodiversity)
    if (selectedCrop.effects.beaHealth) {
      addBeaHealth(selectedCrop.effects.beaHealth)
      showHealthFeedback(selectedCrop.effects.beaHealth)
    }

    addChatMessage({
      type: "milestone",
      text: `🎯 Decisión tomada: Plantar ${selectedCrop.name} en ${plots.find((p) => p.id === selectedPlot)?.name}`,
      effects: selectedCrop.effects,
    })

    const reactionText =
      selectedCrop.beeReaction === "happy"
        ? `¡Excelente elección! ${selectedCrop.name} es perfecto para ${provincia}. ${selectedCrop.description} 🎉\n\nTiempo de cultivo: ${selectedCrop.growthMonths} meses (${selectedCrop.growthMonths} minutos reales)\n\nCuando esté listo, usa el botón de azada 🔨 del HUD para cosechar.`
        : `Mmm... ${selectedCrop.name} no es ideal para ${provincia}. ${selectedCrop.description} Pero bueno, ¡aprendamos de la experiencia! 😴\n\nTiempo de cultivo: ${selectedCrop.growthMonths} meses (${selectedCrop.growthMonths} minutos reales)`

    setTimeout(() => {
      addChatMessage({
        type: "feedback",
        text: reactionText,
        effects: selectedCrop.effects,
      })
    }, 500)

    setShowCropModal(false)
    setShowConfirmation(false)
    setSelectedCrop(null)
    setBeeReaction(null)
    setSelectedPlot(null)
  }, [
    selectedPlot,
    selectedCrop,
    plots,
    provincia,
    addMoney,
    addProductivity,
    addBiodiversity,
    addBeaHealth,
    addChatMessage,
    showHealthFeedback,
  ])

  const handleCancelCrop = useCallback(() => {
    setShowConfirmation(false)
    setSelectedCrop(null)
    setBeeReaction(null)
  }, [])

  const handleModalBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowCropModal(false)
      setShowConfirmation(false)
      setSelectedCrop(null)
      setBeeReaction(null)
    }
  }, [])

  const handleRestartGame = useCallback(() => {
    window.location.reload()
  }, [])

  const handleTimeSpeedChange = useCallback(
    (speed: number) => {
      if (speed > 4) {
        const cost = speed === 5 ? 4000 : 10000
        if (money < cost) {
          addChatMessage({
            type: "dialogue",
            text: `¡No tienes suficiente dinero! Necesitas $${cost} para usar velocidad x${speed}. 💰`,
          })
          return
        }
        addMoney(-cost)
        addChatMessage({
          type: "system",
          text: `⚡ Velocidad aumentada a x${speed}. Costo: $${cost}`,
        })
      }
      setTimeSpeed(speed)
    },
    [money, addMoney, addChatMessage],
  )

  const handleHarvest = useCallback(
    (plotId: string) => {
      const plantedCrop = plantedCrops.find((pc) => pc.plotId === plotId && pc.monthsRemaining === 0)
      if (!plantedCrop) return

      const plotName = plots.find((p) => p.id === plotId)?.name || plotId

      if (plantedCrop.crop.effects.money) addMoney(plantedCrop.crop.effects.money)
      if (plantedCrop.crop.effects.productivity) addProductivity(plantedCrop.crop.effects.productivity)
      if (plantedCrop.crop.effects.biodiversity) addBiodiversity(plantedCrop.crop.effects.biodiversity)
      if (plantedCrop.crop.effects.beaHealth) {
        addBeaHealth(plantedCrop.crop.effects.beaHealth)
        showHealthFeedback(plantedCrop.crop.effects.beaHealth)
      }

      addChatMessage({
        type: "milestone",
        text: `🎉 ¡Cosechaste ${plantedCrop.crop.name} en ${plotName}!`,
        effects: plantedCrop.crop.effects,
      })

      setPlantedCrops((prev) => prev.filter((pc) => pc.plotId !== plotId))
    },
    [plantedCrops, plots, addMoney, addProductivity, addBiodiversity, addBeaHealth, addChatMessage, showHealthFeedback],
  )

  const beeImage = useMemo(() => {
    if (beaHealth > 60) return "/images/very-happy-bee.png"
    if (beaHealth > 50) return "/images/looking-up-bee.png"
    if (beaHealth > 30) return "/images/crying-bee.png"
    return "/images/dead-bee.png"
  }, [beaHealth])

  const beeAltText = useMemo(() => {
    if (beaHealth > 60) return "Abeja muy feliz"
    if (beaHealth > 50) return "Abeja feliz"
    if (beaHealth > 30) return "Abeja triste"
    return "Abeja muerta"
  }, [beaHealth])

  const variableInfo = {
    ndvi: {
      title: "NDVI - Índice de Vegetación",
      description:
        "El NDVI (Normalized Difference Vegetation Index) mide la salud de la vegetación. Valores más altos (cercanos a 1) indican vegetación más saludable y vigorosa, mientras que valores bajos indican suelo desnudo o vegetación estresada.",
      tips: "💡 Consejo: Planta en lotes con NDVI alto para mejores resultados. Un NDVI mayor a 0.6 es excelente para cultivos.",
      link: "https://es.wikipedia.org/wiki/%C3%8Dndice_de_vegetaci%C3%B3n_de_diferencia_normalizada",
    },
    humidity: {
      title: "Humedad del Suelo",
      description:
        "La humedad del suelo es crucial para el crecimiento de las plantas. Mide la cantidad de agua disponible en el suelo para las raíces. Demasiada o muy poca humedad puede afectar negativamente los cultivos.",
      tips: "💡 Consejo: Monitorea la humedad regularmente. La mayoría de los cultivos prefieren humedad entre 40-60%.",
      link: "https://es.wikipedia.org/wiki/Humedad_del_suelo",
    },
    precipitation: {
      title: "Precipitación",
      description:
        "La precipitación indica la cantidad de lluvia que ha caído en el área. Es fundamental para mantener la humedad del suelo y el crecimiento de los cultivos. La falta de lluvia puede requerir riego adicional.",
      tips: "💡 Consejo: Planifica tus cultivos según las estaciones de lluvia. Algunos cultivos necesitan más agua que otros.",
      link: "https://es.wikipedia.org/wiki/Precipitaci%C3%B3n_(meteorolog%C3%ADa)",
    },
    temperature: {
      title: "Temperatura Promedio",
      description:
        "La temperatura promedio afecta directamente el crecimiento y desarrollo de los cultivos. Cada planta tiene un rango óptimo de temperatura. Temperaturas extremas pueden causar estrés en las plantas y reducir la productividad.",
      tips: "💡 Consejo: Elige cultivos adaptados al clima de tu región. Las temperaturas entre 15-25°C son ideales para la mayoría de cultivos.",
      link: "https://es.wikipedia.org/wiki/Temperatura",
    },
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100">
      <div className="sticky top-0 z-50 bg-[#f8e985] border-b-4 border-[#947355] shadow-lg">
        <div className="max-w-[1600px] mx-auto p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image src={beeImage || "/placeholder.svg"} alt={beeAltText} fill className="object-contain" />
              {healthChange && (
                <div
                  key={healthChange.id}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 animate-float-up pointer-events-none"
                  style={{
                    animation: "floatUp 2s ease-out forwards",
                  }}
                >
                  <span
                    className={`text-2xl font-bold drop-shadow-lg ${
                      healthChange.amount > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {healthChange.amount > 0 ? "+" : ""}
                    {healthChange.amount}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="font-serif text-sm font-bold text-[#557b35]">Satisfacción de API</span>
                <span className="text-sm font-bold text-[#557b35]">{beaHealth}%</span>
              </div>
              <div className="h-6 bg-white/50 rounded-full overflow-hidden border-2 border-[#947355]">
                <div
                  className={`h-full transition-all duration-500 ${
                    beaHealth > 60
                      ? "bg-green-500"
                      : beaHealth > 50
                        ? "bg-lime-500"
                        : beaHealth > 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${Math.max(0, beaHealth)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="h-[calc(100vh-160px)] flex flex-col gap-4 max-w-[1600px] mx-auto">
          {/* Main Grid: 3 columnas */}
          <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
            <div className="col-span-3 flex flex-col gap-4">
              {/* Variables */}
              <div className="bg-[#a6d672] border-4 border-[#947355] rounded-xl p-4 shadow-lg flex-shrink-0">
                <h3 className="font-serif text-lg font-bold text-[#557b35] mb-3">Variables</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowVariableInfo("ndvi")}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors bg-white/50 text-[#557b35] hover:bg-white/80 flex items-center justify-between"
                  >
                    <span>NDVI</span>
                    <span className="text-xs">ℹ️</span>
                  </button>
                  <button
                    onClick={() => setShowVariableInfo("humidity")}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors bg-white/50 text-[#557b35] hover:bg-white/80 flex items-center justify-between"
                  >
                    <span>Humedad</span>
                    <span className="text-xs">ℹ️</span>
                  </button>
                  <button
                    onClick={() => setShowVariableInfo("precipitation")}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors bg-white/50 text-[#557b35] hover:bg-white/80 flex items-center justify-between"
                  >
                    <span>Precipitación</span>
                    <span className="text-xs">ℹ️</span>
                  </button>
                  <button
                    onClick={() => setShowVariableInfo("temperature")}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors bg-white/50 text-[#557b35] hover:bg-white/80 flex items-center justify-between"
                  >
                    <span>Temperatura Promedio</span>
                    <span className="text-xs">ℹ️</span>
                  </button>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="bg-[#f8e985] border-4 border-[#947355] rounded-xl p-4 shadow-lg flex-shrink-0">
                <h3 className="font-serif text-lg font-bold text-[#557b35] mb-3">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#947355]">Fondos:</span>
                    <span className="text-lg font-bold text-[#557b35]">${money.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#947355]">Producción:</span>
                    <span className="text-lg font-bold text-[#557b35]">{productivity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#947355]">Biodiversidad:</span>
                    <span className="text-lg font-bold text-[#557b35]">{biodiversity}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-[#947355]">
                  <h4 className="text-sm font-bold text-[#557b35] mb-2">Velocidad de Tiempo</h4>
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    {[1, 2, 3, 4].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleTimeSpeedChange(speed)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                          timeSpeed === speed
                            ? "bg-[#557b35] text-white"
                            : "bg-white/50 text-[#557b35] hover:bg-white/80"
                        }`}
                      >
                        x{speed}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {[5, 10].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleTimeSpeedChange(speed)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                          timeSpeed === speed
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                        }`}
                      >
                        x{speed} 💰
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-[#947355] mt-1 text-center">x5 y x10 cuestan $4000 y $10000</p>
                </div>
              </div>
            </div>

            <div className="col-span-6 flex flex-col gap-3 min-h-0">
              <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                {plots.slice(0, 4).map((plot, idx) => {
                  const isBestPlot = plot.id === bestPlot.id
                  const plantedCrop = plantedCrops.find((pc) => pc.plotId === plot.id && pc.monthsRemaining >= 0)
                  const isReadyToHarvest = plantedCrop && plantedCrop.monthsRemaining === 0

                  return (
                    <button
                      key={plot.id}
                      onClick={() => handlePlotClick(plot)}
                      className={`border-4 rounded-xl p-4 transition-all shadow-lg flex flex-col items-center justify-center relative ${
                        isReadyToHarvest
                          ? "border-yellow-500 bg-yellow-100 animate-pulse"
                          : selectedPlot === plot.id
                            ? "border-[#557b35] bg-[#b3e495] scale-105"
                            : plantedCrop
                              ? "border-green-600 bg-green-100"
                              : "border-[#947355] bg-[#f8e985] hover:bg-[#f8e985]/80"
                      }`}
                    >
                      {!plantedCrop && hudMode === "plant" && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          🌱 Plantar
                        </div>
                      )}
                      {isReadyToHarvest && hudMode === "harvest" && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                          🔨 ¡Cosechar!
                        </div>
                      )}
                      {isBestPlot && !plantedCrop && hudMode === "recommend" && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          ⭐ Mejor
                        </div>
                      )}

                      {plantedCrop ? (
                        <>
                          <div className="text-5xl mb-2">{plantedCrop.crop.emoji}</div>
                          <p className="font-serif text-base font-bold text-[#557b35]">{plantedCrop.crop.name}</p>
                          <p className="text-sm text-[#947355] mt-1">
                            {isReadyToHarvest ? (
                              <span className="text-yellow-600 font-bold">✅ ¡Listo!</span>
                            ) : (
                              `⏳ ${plantedCrop.monthsRemaining.toFixed(1)} meses`
                            )}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-5xl mb-2">{idx < 2 ? "🌱" : "🌾"}</div>
                          <p className="font-serif text-base font-bold text-[#557b35]">{plot.name}</p>
                          <p className="text-sm text-[#947355] mt-1">NDVI: {plot.ndvi.toFixed(2)}</p>
                        </>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-[#947355] rounded-xl p-3 shadow-lg flex-shrink-0">
                <h3 className="font-serif text-base font-bold text-[#557b35] mb-2 text-center">Herramientas</h3>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setHudMode("plant")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-3 transition-all ${
                      hudMode === "plant"
                        ? "bg-green-500 border-green-700 scale-105 shadow-lg"
                        : "bg-white/70 border-[#947355] hover:bg-white/90"
                    }`}
                    title="Plantar"
                  >
                    <div className="text-2xl mb-1">🌱</div>
                    <span className={`text-xs font-bold ${hudMode === "plant" ? "text-white" : "text-[#557b35]"}`}>
                      Plantar
                    </span>
                  </button>

                  <button
                    onClick={() => setHudMode("harvest")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-3 transition-all ${
                      hudMode === "harvest"
                        ? "bg-orange-500 border-orange-700 scale-105 shadow-lg"
                        : "bg-white/70 border-[#947355] hover:bg-white/90"
                    }`}
                    title="Cosechar"
                  >
                    <div className="relative w-6 h-6 mb-1">
                      <Image src="/images/hoe-icon.png" alt="Azada" fill className="object-contain" />
                    </div>
                    <span className={`text-xs font-bold ${hudMode === "harvest" ? "text-white" : "text-[#557b35]"}`}>
                      Cosechar
                    </span>
                  </button>

                  <button
                    onClick={() => setHudMode("recommend")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-3 transition-all ${
                      hudMode === "recommend"
                        ? "bg-blue-500 border-blue-700 scale-105 shadow-lg"
                        : "bg-white/70 border-[#947355] hover:bg-white/90"
                    }`}
                    title="Recomendaciones de Api"
                  >
                    <div className="text-2xl mb-1">💡</div>
                    <span className={`text-xs font-bold ${hudMode === "recommend" ? "text-white" : "text-[#557b35]"}`}>
                      Consejos
                    </span>
                  </button>

                  <button
                    className="flex flex-col items-center justify-center p-2 rounded-xl border-3 bg-purple-100 border-purple-400 hover:bg-purple-200 transition-all group relative"
                    title={`Campo en ${provincia.charAt(0).toUpperCase() + provincia.slice(1)}`}
                  >
                    <div className="text-xl mb-1">📍</div>
                    <span className="text-xs font-bold text-purple-700 capitalize">{provincia}</span>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Tierra de tu Abuelo
                    </div>
                  </button>
                </div>
                <p className="text-xs text-center text-[#947355] mt-2 leading-tight">
                  {hudMode === "plant" && "Selecciona un lote para plantar"}
                  {hudMode === "harvest" && "Selecciona un lote para cosechar"}
                  {hudMode === "recommend" && "Api te dará recomendaciones"}
                </p>
              </div>
            </div>

            <div className="col-span-3 flex flex-col min-h-0">
              <BeeChatbot
                chatHistory={chatHistory}
                isMinimized={isChatMinimized}
                onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
              />
            </div>
          </div>
        </div>
      </div>

      {showVariableInfo && (
        <div
          onClick={() => setShowVariableInfo(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="relative">
            {/* Abeja muy feliz detrás del modal */}
            <div className="absolute -top-30 left-1/3 w-40 h-40 opacity-40 z-0 pointer-events-none">
              <Image src="/images/very-happy-bee.png" alt="Abeja muy feliz" fill className="object-contain" />
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-[#947355]"
            >
              <h2 className="font-serif text-2xl font-bold text-[#557b35] mb-4">
                {variableInfo[showVariableInfo].title}
              </h2>
              <p className="text-[#947355] mb-4 leading-relaxed">{variableInfo[showVariableInfo].description}</p>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">{variableInfo[showVariableInfo].tips}</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={variableInfo[showVariableInfo].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors text-center"
                >
                  Saber más
                </a>
                <button
                  onClick={() => setShowVariableInfo(null)}
                  className="flex-1 px-6 py-3 bg-[#a6d672] hover:bg-[#557b35] text-[#557b35] hover:text-white rounded-xl font-semibold transition-colors"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCropModal && !showConfirmation && (
        <div
          onClick={handleModalBackdropClick}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-[#947355]">
            <div className="text-center mb-6">
              <h2 className="font-serif text-3xl font-bold text-[#557b35] mb-2">¿Qué quieres plantar?</h2>
              <p className="text-[#557b35]">Elige el cultivo para {plots.find((p) => p.id === selectedPlot)?.name}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {CROPS.map((crop) => {
                const isGoodChoice = crop.goodFor.includes(provincia)
                return (
                  <button
                    key={crop.id}
                    onClick={() => handleCropSelect(crop)}
                    className={`p-4 rounded-xl border-4 transition-all hover:scale-105 ${
                      isGoodChoice
                        ? "border-green-500 bg-green-50 hover:bg-green-100"
                        : "border-orange-500 bg-orange-50 hover:bg-orange-100"
                    }`}
                  >
                    <div className="text-5xl mb-2">{crop.emoji}</div>
                    <h3 className="font-bold text-[#557b35] mb-1">{crop.name}</h3>
                    <p className="text-xs text-[#947355] mb-2">{crop.description}</p>
                    <p className="text-xs font-bold text-purple-600 mb-2">⏱️ {crop.growthMonths} meses</p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>💰</span>
                        <span className={crop.effects.money > 0 ? "text-green-600" : "text-red-600"}>
                          ${crop.effects.money}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>📈</span>
                        <span className={crop.effects.productivity > 0 ? "text-green-600" : "text-red-600"}>
                          {crop.effects.productivity > 0 ? "+" : ""}
                          {crop.effects.productivity}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>🐝</span>
                        <span className={crop.effects.beaHealth > 0 ? "text-green-600" : "text-red-600"}>
                          {crop.effects.beaHealth > 0 ? "+" : ""}
                          {crop.effects.beaHealth}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setShowCropModal(false)}
              className="w-full px-6 py-3 bg-[#947355] hover:bg-[#7a5d44] text-white rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showConfirmation && selectedCrop && (
        <div
          onClick={handleModalBackdropClick}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-[#947355]">
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={beeReaction === "happy" ? "/images/looking-up-bee.png" : "/images/sleeping-bee.png"}
                  alt={beeReaction === "happy" ? "Abeja feliz" : "Abeja dormida"}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#557b35] mb-2">¿Estás seguro?</h2>
              <p className="text-[#557b35] mb-4">
                Vas a plantar <span className="font-bold">{selectedCrop.name}</span> en{" "}
                {plots.find((p) => p.id === selectedPlot)?.name}
              </p>
              <p className="text-sm text-purple-600 font-bold">
                Tiempo de cultivo: {selectedCrop.growthMonths} meses ({selectedCrop.growthMonths} minutos reales)
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmCrop}
                className="w-full px-6 py-3 bg-[#a6d672] hover:bg-[#557b35] text-[#557b35] hover:text-white rounded-xl font-semibold transition-colors"
              >
                Sí, plantar
              </button>
              <button
                onClick={handleCancelCrop}
                className="w-full px-6 py-3 bg-[#947355] hover:bg-[#7a5d44] text-white rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showGameOver && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-red-600 text-center">
            <div className="relative w-40 h-40 mx-auto mb-6">
              <Image src="/images/dead-bee.png" alt="Abeja muerta" fill className="object-contain" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-red-600 mb-4">¡Oh no!</h2>
            <p className="text-[#557b35] text-lg mb-6 leading-relaxed">
              API está muy enojado con vos, tuvo que mudarse lejos de tu campo, porque no ayudaste a mantener la
              biodiversidad de tu ecosistema.
            </p>
            <button
              onClick={handleRestartGame}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors text-lg"
            >
              Reiniciar Juego
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
