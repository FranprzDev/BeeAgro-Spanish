"use client"

import { create } from "zustand"
import { type MissionId, MISSIONS, type Mission } from "./missions"

export interface PlotData {
  id: string
  name: string
  ndvi: number
  humidity: number
  x: number
  y: number
  width: number
  height: number
}

export type Season = "spring" | "summer" | "fall" | "winter"

export interface EnvironmentalData {
  temperature: {
    min: number // Celsius
    max: number // Celsius
  }
  precipitation: number // mm last month
  soilHumidity: number // percentage
  season: Season
  month: string // e.g., "September-October"
}

export interface GameState {
  // Farm stats
  money: number
  productivity: number
  biodiversity: number
  alerts: number

  // Bea health
  beaHealth: number // 0-100

  // Plots
  plots: PlotData[]

  environmental: EnvironmentalData

  // Missions
  currentMissionId: MissionId | null
  missions: Record<MissionId, Mission>
  currentDialogueIndex: number

  // Actions
  setMoney: (amount: number) => void
  addMoney: (amount: number) => void
  setProductivity: (amount: number) => void
  addProductivity: (amount: number) => void
  setBiodiversity: (amount: number) => void
  addBiodiversity: (amount: number) => void
  setBeaHealth: (amount: number) => void
  addBeaHealth: (amount: number) => void
  updatePlotNdvi: (plotId: string, change: number) => void
  updatePlotHumidity: (plotId: string, change: number) => void

  updateEnvironmental: (data: Partial<EnvironmentalData>) => void

  // Mission actions
  startMission: (missionId: MissionId) => void
  completeMission: (missionId: MissionId) => void
  nextDialogue: () => void
  resetDialogue: () => void
}

const INITIAL_PLOTS: PlotData[] = [
  { id: "plot-1", name: "Lote Norte", ndvi: 0.45, humidity: 35, x: 10, y: 20, width: 35, height: 30 },
  { id: "plot-2", name: "Lote Sur", ndvi: 0.72, humidity: 65, x: 50, y: 25, width: 40, height: 35 },
  { id: "plot-3", name: "Lote Este", ndvi: 0.28, humidity: 25, x: 15, y: 55, width: 30, height: 25 },
  { id: "plot-4", name: "Lote Oeste", ndvi: 0.85, humidity: 70, x: 55, y: 65, width: 35, height: 25 },
]

const INITIAL_ENVIRONMENTAL: EnvironmentalData = {
  temperature: {
    min: 12,
    max: 22,
  },
  precipitation: 50, // mm last month
  soilHumidity: 35, // percentage
  season: "spring",
  month: "Septiembre-Octubre",
}

export const useGameState = create<GameState>((set) => ({
  // Initial state
  money: 50000,
  productivity: 65,
  biodiversity: 45,
  alerts: 2,
  beaHealth: 100,
  plots: INITIAL_PLOTS,
  environmental: INITIAL_ENVIRONMENTAL, // Added environmental data
  currentMissionId: "mission-1",
  missions: MISSIONS,
  currentDialogueIndex: 0,

  // Actions
  setMoney: (amount) => set({ money: Math.max(0, amount) }),
  addMoney: (amount) => set((state) => ({ money: Math.max(0, state.money + amount) })),

  setProductivity: (amount) => set({ productivity: Math.max(0, Math.min(100, amount)) }),
  addProductivity: (amount) =>
    set((state) => ({ productivity: Math.max(0, Math.min(100, state.productivity + amount)) })),

  setBiodiversity: (amount) => set({ biodiversity: Math.max(0, Math.min(100, amount)) }),
  addBiodiversity: (amount) =>
    set((state) => ({ biodiversity: Math.max(0, Math.min(100, state.biodiversity + amount)) })),

  setBeaHealth: (amount) => set({ beaHealth: Math.max(0, Math.min(100, amount)) }),
  addBeaHealth: (amount) => set((state) => ({ beaHealth: Math.max(0, Math.min(100, state.beaHealth + amount)) })),

  updatePlotNdvi: (plotId, change) =>
    set((state) => ({
      plots: state.plots.map((plot) =>
        plot.id === plotId ? { ...plot, ndvi: Math.max(0, Math.min(1, plot.ndvi + change)) } : plot,
      ),
    })),

  updatePlotHumidity: (plotId, change) =>
    set((state) => ({
      plots: state.plots.map((plot) =>
        plot.id === plotId ? { ...plot, humidity: Math.max(0, Math.min(100, plot.humidity + change)) } : plot,
      ),
    })),

  updateEnvironmental: (data) =>
    set((state) => ({
      environmental: {
        ...state.environmental,
        ...data,
      },
    })),

  startMission: (missionId) =>
    set({
      currentMissionId: missionId,
      currentDialogueIndex: 0,
    }),

  completeMission: (missionId) =>
    set((state) => ({
      missions: {
        ...state.missions,
        [missionId]: {
          ...state.missions[missionId],
          completed: true,
        },
      },
    })),

  nextDialogue: () => set((state) => ({ currentDialogueIndex: state.currentDialogueIndex + 1 })),

  resetDialogue: () => set({ currentDialogueIndex: 0 }),
}))
