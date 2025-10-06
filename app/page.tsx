"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useGameState } from "@/lib/game-state"
import Image from "next/image"
import { BeeChatbot } from "@/components/bee-chatbot"
import { WelcomeScreen } from "@/components/welcome-screen"
import type { MissionChoice } from "@/lib/missions"

type ChatMessage = {
  id: string
  type: "dialogue" | "milestone" | "feedback" | "system" | "mission"
  text: string
  timestamp: number
  effects?: any
}

export default function BeeAgroGame() {
  const [showIntro, setShowIntro] = useState(true)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [activeLayer, setActiveLayer] = useState<"ndvi" | "humidity" | "base">("base")
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null)

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isChatMinimized, setIsChatMinimized] = useState(false)

  const [showVariableInfo, setShowVariableInfo] = useState<
    "ndvi" | "humidity" | "precipitation" | "temperature" | null
  >(null)

  const [healthChange, setHealthChange] = useState<{ amount: number; id: string } | null>(null)

  const [hudMode, setHudMode] = useState<"plant" | "harvest" | "recommend">("recommend")

  const [timeSpeed, setTimeSpeed] = useState(1)
  const [showGameOver, setShowGameOver] = useState(false)

  const [missionIntroShown, setMissionIntroShown] = useState(false)
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completionData, setCompletionData] = useState<{
    title: string
    description: string
    learnings: string[]
    links: { label: string; url: string }[]
  } | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const addChatMessageRef = useRef<(msg: Omit<ChatMessage, "id" | "timestamp">) => void>()

  const {
    money,
    productivity,
    biodiversity,
    beaHealth,
    plots,
    environmental,
    currentMissionId,
    missions,
    currentDialogueIndex,
    addMoney,
    addProductivity,
    addBiodiversity,
    addBeaHealth,
    updatePlotNdvi,
    updatePlotHumidity,
    completeMission,
    nextDialogue,
    resetDialogue,
  } = useGameState()

  const currentMission = currentMissionId ? missions[currentMissionId] : null
  const currentDialogue = currentMission?.introDialogue[currentDialogueIndex]

  const beaHealthStatus = beaHealth > 70 ? "healthy" : beaHealth > 40 ? "warning" : "danger"

  useEffect(() => {
    if (selectedProvince && !missionIntroShown) {
      initializeChat()
      setMissionIntroShown(true)
    }
  }, [selectedProvince, missionIntroShown])

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
    if (!currentMission) return

    const welcomeMessage: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      type: "system",
      text: `Welcome to your land in ${selectedProvince?.charAt(0).toUpperCase()}${selectedProvince?.slice(1)}! I'm API, your bee guide connected to NASA satellites. 🐝`,
      timestamp: Date.now(),
    }
    setChatHistory([welcomeMessage])

    setTimeout(() => {
      currentMission.introDialogue.forEach((dialogue, index) => {
        setTimeout(() => {
          addChatMessage({
            type: "dialogue",
            text: dialogue.text,
          })

          if (index === currentMission.introDialogue.length - 1) {
            setTimeout(() => {
              setShowDecisionModal(true)
              addChatMessage({
                type: "mission",
                text: "💡 Review the options in the window that appeared and choose the best strategy based on NASA data.",
              })
            }, 2000)
          }
        }, index * 3000)
      })
    }, 1000)
  }, [selectedProvince, currentMission])

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

  const handleProvinceSelect = (provinceId: string) => {
    setSelectedProvince(provinceId)
    setShowIntro(false)
  }

  const handlePlotClick = useCallback(
    (plot: any) => {
      setSelectedPlot(plot.id)

      if (hudMode === "recommend") {
        addChatMessage({
          type: "dialogue",
          text: `${plot.name} has an NDVI of ${plot.ndvi.toFixed(2)} and ${plot.humidity}% moisture. ${
            plot.ndvi > 0.7
              ? "Excellent condition for crops! 🌟"
              : plot.ndvi > 0.5
                ? "Good condition, but could improve. 💡"
                : "Needs attention and soil improvement. ⚠️"
          }`,
        })
      }
    },
    [hudMode, addChatMessage],
  )

  const showHealthFeedback = useCallback((amount: number) => {
    const id = `health-${Date.now()}-${Math.random()}`
    setHealthChange({ amount, id })
    setTimeout(() => {
      setHealthChange(null)
    }, 2000)
  }, [])

  const handleMissionChoice = useCallback(
    (choice: MissionChoice) => {
      if (money < choice.cost) {
        addChatMessage({
          type: "dialogue",
          text: `You don't have enough money! You need $${choice.cost.toLocaleString()} for this option. 💰`,
        })
        return
      }

      setShowDecisionModal(false)

      // Apply effects
      if (choice.effects.money) addMoney(choice.effects.money)
      if (choice.effects.productivity) addProductivity(choice.effects.productivity)
      if (choice.effects.biodiversity) addBiodiversity(choice.effects.biodiversity)
      if (choice.effects.beaHealth) {
        addBeaHealth(choice.effects.beaHealth)
        showHealthFeedback(choice.effects.beaHealth)
      }
      if (choice.effects.plotNdvi) {
        updatePlotNdvi(choice.effects.plotNdvi.plotId, choice.effects.plotNdvi.change)
      }
      if (choice.effects.plotHumidity) {
        updatePlotHumidity(choice.effects.plotHumidity.plotId, choice.effects.plotHumidity.change)
      }

      addChatMessage({
        type: "milestone",
        text: `🎯 Decision made: ${choice.label}`,
      })

      // Show feedback
      if (choice.feedback) {
        setTimeout(() => {
          addChatMessage({
            type: "feedback",
            text: choice.feedback!.text,
          })
        }, 1000)
      }

      // Complete mission
      if (currentMissionId) {
        completeMission(currentMissionId)
      }
      resetDialogue()

      // Show completion dialogue
      if (currentMission?.completionDialogue) {
        setTimeout(() => {
          currentMission.completionDialogue.forEach((dialogue, index) => {
            setTimeout(() => {
              addChatMessage({
                type: "dialogue",
                text: dialogue.text,
              })
            }, index * 2000)
          })

          setTimeout(
            () => {
              setCompletionData({
                title: "Precision Agriculture with Satellite Data",
                description:
                  "You've learned to use NASA satellite data to make smart decisions about irrigation and planting. Precision agriculture combines space technology with traditional knowledge to optimize resources and improve harvests.",
                learnings: [
                  "NASA satellites measure soil moisture, temperature, and plant health (NDVI)",
                  "Drip irrigation is more efficient than traditional irrigation, saving up to 60% of water",
                  "Lemon trees need constant moisture but well-drained soil to grow healthy",
                  "Making data-driven decisions reduces risks and improves agricultural productivity",
                ],
                links: [
                  {
                    label: "NASA POWER - Agricultural Data",
                    url: "https://power.larc.nasa.gov/",
                  },
                  {
                    label: "Drip Irrigation - Complete Guide",
                    url: "https://en.wikipedia.org/wiki/Drip_irrigation",
                  },
                  {
                    label: "NDVI and Agriculture",
                    url: "https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index",
                  },
                ],
              })
              setShowCompletionModal(true)
            },
            currentMission.completionDialogue.length * 2000 + 1000,
          )
        }, 3000)
      }
    },
    [
      money,
      currentMissionId,
      currentMission,
      addMoney,
      addProductivity,
      addBiodiversity,
      addBeaHealth,
      updatePlotNdvi,
      updatePlotHumidity,
      completeMission,
      resetDialogue,
      addChatMessage,
      showHealthFeedback,
    ],
  )

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
            text: `You don't have enough money! You need $${cost} to use x${speed} speed. 💰`,
          })
          return
        }
        addMoney(-cost)
        addChatMessage({
          type: "system",
          text: `⚡ Speed increased to x${speed}. Cost: $${cost}`,
        })
      }
      setTimeSpeed(speed)
    },
    [money, addMoney, addChatMessage],
  )

  const beeImage = useMemo(() => {
    if (beaHealth > 60) return "/images/very-happy-bee.png"
    if (beaHealth > 50) return "/images/looking-up-bee.png"
    if (beaHealth > 30) return "/images/crying-bee.png"
    return "/images/dead-bee.png"
  }, [beaHealth])

  const beeAltText = useMemo(() => {
    if (beaHealth > 60) return "Happy bee"
    if (beaHealth > 50) return "Smiling bee"
    if (beaHealth > 30) return "Sad bee"
    return "Dead bee"
  }, [beaHealth])

  const variableInfo = {
    ndvi: {
      title: "NDVI - Vegetation Index",
      description:
        "NDVI (Normalized Difference Vegetation Index) measures vegetation health using NASA satellite data. Higher values (close to 1) indicate healthier and more vigorous vegetation.",
      tips: "💡 Tip: Plant in plots with high NDVI for better results. An NDVI greater than 0.6 is excellent for crops.",
      link: "https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index",
    },
    humidity: {
      title: "Soil Moisture",
      description:
        "Soil moisture measured by NASA satellites is crucial for plant growth. It measures the amount of water available in the soil for roots.",
      tips: "💡 Tip: Monitor moisture regularly. Most crops prefer moisture between 40-60%.",
      link: "https://en.wikipedia.org/wiki/Water_content",
    },
    precipitation: {
      title: "Precipitation",
      description:
        "NASA satellite precipitation data indicates the amount of rain that has fallen in the area. It's fundamental for maintaining soil moisture and crop growth.",
      tips: "💡 Tip: Plan your crops according to rainy seasons. Some crops need more water than others.",
      link: "https://en.wikipedia.org/wiki/Precipitation",
    },
    temperature: {
      title: "Temperature",
      description:
        "Temperature measured by NASA satellites directly affects crop growth and development. Each plant has an optimal temperature range.",
      tips: "💡 Tip: Choose crops adapted to your region's climate. Temperatures between 15-25°C are ideal for most crops.",
      link: "https://en.wikipedia.org/wiki/Temperature",
    },
  }

  if (showIntro) {
    return <WelcomeScreen onStart={handleProvinceSelect} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100">
      <div className="sticky top-0 z-50 bg-[#f8e985] border-b-4 border-[#947355] shadow-lg">
        <div className="max-w-full mx-auto p-4">
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
                <span className="font-serif text-sm font-bold text-[#557b35]">API's Satisfaction</span>
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

      <div className="p-4 overflow-hidden">
        <div className="h-[calc(100vh-160px)] flex flex-col gap-4 max-w-full mx-auto overflow-hidden">
          <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            <div className="col-span-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
              {/* NASA Variables */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-400 rounded-xl p-4 shadow-lg flex-shrink-0">
                <h3 className="font-serif text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🛰️</span>
                  <span>NASA Variables</span>
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowVariableInfo("temperature")}
                    className="w-full bg-white/70 hover:bg-white border-2 border-blue-300 rounded-lg p-3 transition-all text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Temperature</span>
                      <span className="text-xs text-blue-600">ℹ️</span>
                    </div>
                    <div className="text-lg font-bold text-blue-900 mt-1">
                      {environmental.temperature.min}°C - {environmental.temperature.max}°C
                    </div>
                  </button>

                  <button
                    onClick={() => setShowVariableInfo("precipitation")}
                    className="w-full bg-white/70 hover:bg-white border-2 border-blue-300 rounded-lg p-3 transition-all text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Precipitation</span>
                      <span className="text-xs text-blue-600">ℹ️</span>
                    </div>
                    <div className="text-lg font-bold text-blue-900 mt-1">{environmental.precipitation}mm</div>
                  </button>

                  <button
                    onClick={() => setShowVariableInfo("humidity")}
                    className="w-full bg-white/70 hover:bg-white border-2 border-blue-300 rounded-lg p-3 transition-all text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Soil Moisture</span>
                      <span className="text-xs text-blue-600">ℹ️</span>
                    </div>
                    <div className="text-lg font-bold text-blue-900 mt-1">{environmental.soilHumidity}%</div>
                  </button>

                  <div className="bg-white/70 border-2 border-blue-300 rounded-lg p-3">
                    <span className="text-sm font-medium text-blue-700">Season</span>
                    <div className="text-lg font-bold text-blue-900 mt-1 capitalize">{environmental.season}</div>
                  </div>
                </div>
              </div>

              {/* Farm Statistics */}
              <div className="bg-[#f8e985] border-4 border-[#947355] rounded-xl p-4 shadow-lg flex-shrink-0">
                <h3 className="font-serif text-lg font-bold text-[#557b35] mb-3">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#947355]">Funds</span>
                    <span className="text-xl font-bold text-[#557b35]">${money.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#947355]">Production</span>
                    <span className="text-xl font-bold text-[#557b35]">{productivity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#947355]">Biodiversity</span>
                    <span className="text-xl font-bold text-[#557b35]">{biodiversity}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-[#947355]">
                  <h4 className="text-sm font-bold text-[#557b35] mb-2">Time Speed</h4>
                  <div className="grid grid-cols-3 gap-2">
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
                  <p className="text-xs text-[#947355] mt-1 text-center">x5: $4k, x10: $10k</p>
                </div>
              </div>
            </div>

            <div className="col-span-5 flex flex-col gap-3 min-h-0 overflow-hidden">
              {/* Plot grid */}
              <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                {plots.slice(0, 4).map((plot, idx) => {
                  return (
                    <button
                      key={plot.id}
                      onClick={() => handlePlotClick(plot)}
                      className={`border-4 rounded-xl p-4 transition-all shadow-lg flex flex-col items-center justify-center relative ${
                        selectedPlot === plot.id
                          ? "border-[#557b35] bg-[#b3e495] scale-105"
                          : "border-[#947355] bg-[#f8e985] hover:bg-[#f8e985]/80"
                      }`}
                    >
                      <div className="text-5xl mb-2">{idx < 2 ? "🌱" : "🌾"}</div>
                      <p className="font-serif text-base font-bold text-[#557b35]">{plot.name}</p>
                      <p className="text-sm text-[#947355] mt-1">NDVI: {plot.ndvi.toFixed(2)}</p>
                      <p className="text-xs text-[#947355]">Humedad: {plot.humidity}%</p>
                    </button>
                  )
                })}
              </div>

              {/* Tools HUD */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-[#947355] rounded-xl p-3 shadow-lg flex-shrink-0">
                <h3 className="font-serif text-base font-bold text-[#557b35] mb-2 text-center">Tools</h3>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setHudMode("plant")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-3 transition-all ${
                      hudMode === "plant"
                        ? "bg-green-500 border-green-700 scale-105 shadow-lg"
                        : "bg-white/70 border-[#947355] hover:bg-white/90"
                    }`}
                    title="Plant"
                  >
                    <div className="text-2xl mb-1">🌱</div>
                    <span className={`text-xs font-bold ${hudMode === "plant" ? "text-white" : "text-[#557b35]"}`}>
                      Plant
                    </span>
                  </button>

                  <button
                    onClick={() => setHudMode("harvest")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-3 transition-all ${
                      hudMode === "harvest"
                        ? "bg-orange-500 border-orange-700 scale-105 shadow-lg"
                        : "bg-white/70 border-[#947355] hover:bg-white/90"
                    }`}
                    title="Harvest"
                  >
                    <div className="relative w-6 h-6 mb-1">
                      <Image src="/images/hoe-icon.png" alt="Hoe" fill className="object-contain" />
                    </div>
                    <span className={`text-xs font-bold ${hudMode === "harvest" ? "text-white" : "text-[#557b35]"}`}>
                      Harvest
                    </span>
                  </button>

                  <button
                    onClick={() => setHudMode("recommend")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-3 transition-all ${
                      hudMode === "recommend"
                        ? "bg-blue-500 border-blue-700 scale-105 shadow-lg"
                        : "bg-white/70 border-[#947355] hover:bg-white/90"
                    }`}
                    title="Api's Recommendations"
                  >
                    <div className="text-2xl mb-1">💡</div>
                    <span className={`text-xs font-bold ${hudMode === "recommend" ? "text-white" : "text-[#557b35]"}`}>
                      Tips
                    </span>
                  </button>

                  <button
                    className="flex flex-col items-center justify-center p-2 rounded-xl border-3 bg-purple-100 border-purple-400 hover:bg-purple-200 transition-all group relative"
                    title={`Mission: ${currentMission?.title || "None"}`}
                  >
                    <div className="text-xl mb-1">
                      {currentMission?.completed ? "✅" : showDecisionModal ? "⚠️" : "🎯"}
                    </div>
                    <span className="text-xs font-bold text-purple-700 capitalize">
                      {selectedProvince || "Mission"}
                    </span>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {currentMission?.completed
                        ? "✓ Mission Completed"
                        : showDecisionModal
                          ? "⚠️ Choose an option"
                          : currentMission?.title || "No mission"}
                    </div>
                  </button>
                </div>
                <p className="text-xs text-center text-[#947355] mt-2 leading-tight">
                  {hudMode === "plant" && "Select a plot to plant"}
                  {hudMode === "harvest" && "Select a plot to harvest"}
                  {hudMode === "recommend" && "API will give you recommendations"}
                </p>
              </div>
            </div>

            <div className="col-span-4 flex flex-col min-h-0 overflow-hidden">
              <BeeChatbot
                chatHistory={chatHistory}
                isMinimized={isChatMinimized}
                onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
              />
            </div>
          </div>
        </div>
      </div>

      {showDecisionModal && currentMission?.choices && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-6 max-w-3xl w-full shadow-2xl border-4 border-[#557b35] my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-[#557b35]">🍋 Planting Decision</h2>
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image src={beeImage || "/placeholder.svg"} alt={beeAltText} fill className="object-contain" />
              </div>
            </div>

            <p className="text-[#947355] mb-4 text-center">
              Analyze NASA data and choose the best strategy for your crop
            </p>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-xl">🛰️</span>
                <span>NASA Environmental Data</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Temperature:</span>
                  <span className="font-bold text-blue-900">
                    {environmental.temperature.min}°C - {environmental.temperature.max}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Precipitation:</span>
                  <span className="font-bold text-blue-900">{environmental.precipitation}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Soil Moisture:</span>
                  <span className="font-bold text-blue-900">{environmental.soilHumidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Season:</span>
                  <span className="font-bold text-blue-900 capitalize">{environmental.season}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {currentMission.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleMissionChoice(choice)}
                  disabled={money < choice.cost}
                  className={`w-full text-left p-4 rounded-xl border-3 transition-all ${
                    money < choice.cost
                      ? "border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed"
                      : "border-[#947355] bg-[#f8e985] hover:bg-[#f8e985]/90 hover:scale-[1.02] shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#557b35] text-lg">{choice.label}</span>
                    <span className="text-base font-bold text-purple-600 ml-2 flex-shrink-0">
                      ${choice.cost.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#947355] leading-relaxed">{choice.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-[#947355]">💰 Your current budget: ${money.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && completionData && (
        <div
          onClick={() => setShowCompletionModal(false)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border-4 border-[#557b35] relative max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32">
              <Image src="/images/very-happy-bee.png" alt="Happy bee" fill className="object-contain" />
            </div>

            <div className="mt-8">
              <h2 className="font-serif text-3xl font-bold text-[#557b35] mb-2 text-center">
                Congratulations, you learned about...!
              </h2>
              <h3 className="font-serif text-xl font-bold text-[#947355] mb-4 text-center">{completionData.title}</h3>

              <p className="text-[#557b35] mb-6 leading-relaxed text-center">{completionData.description}</p>

              <div className="bg-white/70 border-2 border-[#947355] rounded-xl p-4 mb-6">
                <h4 className="font-bold text-[#557b35] mb-3 flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <span>Key Points:</span>
                </h4>
                <ul className="space-y-2">
                  {completionData.learnings.map((learning, idx) => (
                    <li key={idx} className="text-sm text-[#557b35] flex gap-2">
                      <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🔗</span>
                  <span>Learn More:</span>
                </h4>
                <div className="space-y-2">
                  {completionData.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      → {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full px-6 py-3 bg-[#557b35] hover:bg-[#3d5727] text-white rounded-xl font-semibold transition-colors text-lg shadow-lg"
              >
                Keep Learning!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variable Info Modal */}
      {showVariableInfo && (
        <div
          onClick={() => setShowVariableInfo(null)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border-4 border-[#557b35]"
          >
            <h3 className="font-serif text-2xl font-bold text-[#557b35] mb-3">
              {variableInfo[showVariableInfo].title}
            </h3>
            <p className="text-[#947355] mb-4 leading-relaxed">{variableInfo[showVariableInfo].description}</p>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">{variableInfo[showVariableInfo].tips}</p>
            </div>
            <a
              href={variableInfo[showVariableInfo].link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline block mb-4"
            >
              → Read more on Wikipedia
            </a>
            <button
              onClick={() => setShowVariableInfo(null)}
              className="w-full px-4 py-2 bg-[#557b35] hover:bg-[#3d5727] text-white rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-red-600 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image src="/images/dead-bee.png" alt="Sad bee" fill className="object-contain" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-red-600 mb-4">Game Over</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              API is very sad. Your farm's health reached 0%. Remember that every decision affects the ecosystem. Try
              again and use NASA data to make better decisions!
            </p>
            <button
              onClick={handleRestartGame}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors text-lg shadow-lg"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
