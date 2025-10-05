"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useBeaVoice } from "@/lib/use-bea-voice"
import { cn } from "@/lib/utils"

type Emotion = "neutral" | "happy" | "worried" | "sad"

interface DialogueBoxProps {
  text: string
  emotion?: Emotion
  onComplete?: () => void
  autoPlay?: boolean
}

export function DialogueBox({ text, emotion = "neutral", onComplete, autoPlay = false }: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const { speak, stop, isPlaying, isLoading } = useBeaVoice()

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("")
    setIsTyping(true)
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
        if (onComplete) onComplete()
      }
    }, 30) // Typing speed

    return () => clearInterval(interval)
  }, [text, onComplete])

  // Auto-play voice when typing completes
  useEffect(() => {
    if (!isTyping && autoPlay && !isPlaying) {
      speak(text, emotion)
    }
  }, [isTyping, autoPlay, text, emotion, speak, isPlaying])

  const handleVoiceToggle = () => {
    if (isPlaying) {
      stop()
    } else {
      speak(text, emotion)
    }
  }

  return (
    <Card
      className={cn(
        "p-6 relative border-2 transition-colors",
        emotion === "happy" && "border-success/50 bg-success/5",
        emotion === "worried" && "border-warning/50 bg-warning/5",
        emotion === "sad" && "border-destructive/50 bg-destructive/5",
        emotion === "neutral" && "border-primary/30",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-serif text-lg font-semibold text-primary">Bea</span>
            <span className="text-xs text-muted-foreground">
              {emotion === "happy" && "😊"}
              {emotion === "worried" && "😟"}
              {emotion === "sad" && "😢"}
            </span>
          </div>
          <p className="text-foreground leading-relaxed">
            {displayedText}
            {isTyping && <span className="inline-block w-1 h-4 ml-1 bg-primary animate-pulse" />}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleVoiceToggle}
          disabled={isLoading || isTyping}
          className="shrink-0"
        >
          {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>
    </Card>
  )
}
