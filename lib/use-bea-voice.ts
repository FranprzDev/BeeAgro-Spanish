"use client"

import { useState, useCallback, useRef } from "react"

type Emotion = "neutral" | "happy" | "worried" | "sad"

export function useBeaVoice() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string, emotion: Emotion = "neutral") => {
    try {
      setIsLoading(true)

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      console.log("[v0] Requesting TTS for:", text.substring(0, 50) + "...")

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, emotion }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        console.log("[v0] Audio started playing")
        setIsPlaying(true)
        setIsLoading(false)
      }

      audio.onended = () => {
        console.log("[v0] Audio finished playing")
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = (e) => {
        console.error("[v0] Audio playback error:", e)
        setIsPlaying(false)
        setIsLoading(false)
      }

      await audio.play()
    } catch (error) {
      console.error("[v0] Speak error:", error)
      setIsLoading(false)
      setIsPlaying(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsPlaying(false)
    }
  }, [])

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
  }
}
