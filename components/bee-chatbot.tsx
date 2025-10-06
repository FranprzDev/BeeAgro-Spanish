"use client"

import { useRef, useEffect } from "react"

type ChatMessage = {
  id: string
  type: "dialogue" | "milestone" | "feedback" | "system"
  text: string
  timestamp: number
  effects?: any
}

interface BeeChatbotProps {
  chatHistory: ChatMessage[]
  isMinimized: boolean
  onToggleMinimize: () => void
}

export function BeeChatbot({ chatHistory, isMinimized, onToggleMinimize }: BeeChatbotProps) {
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory.length])

  return (
    <div
      className={`bg-[#87ceeb] border-4 border-[#947355] rounded-xl p-4 shadow-lg flex flex-col transition-all ${
        isMinimized ? "h-20" : "max-h-[calc(100vh-2rem)] h-[700px]"
      }`}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-4xl">🐝</span>
          <h3 className="font-serif text-lg font-bold text-[#557b35]">API</h3>
        </div>
        <button
          onClick={onToggleMinimize}
          className="text-sm px-2 py-1 bg-white/50 hover:bg-white/80 rounded-lg text-[#557b35] font-medium transition-colors"
        >
          {isMinimized ? "Expand" : "Minimize"}
        </button>
      </div>

      {!isMinimized && (
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#947355 transparent",
          }}
        >
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg p-3 border-2 ${
                msg.type === "milestone"
                  ? "bg-warning/10 border-warning"
                  : msg.type === "feedback"
                    ? "bg-info/10 border-info"
                    : msg.type === "system"
                      ? "bg-success/10 border-success"
                      : "bg-card border-border"
              }`}
            >
              <p
                className={`text-sm leading-relaxed whitespace-pre-line ${
                  msg.type === "milestone"
                    ? "font-bold text-warning-foreground"
                    : msg.type === "feedback"
                      ? "text-info-foreground"
                      : msg.type === "system"
                        ? "font-semibold text-success-foreground"
                        : "text-foreground"
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}
    </div>
  )
}
