import { type NextRequest, NextResponse } from "next/server"

const ELEVENLABS_API_KEY = "sk_5ab57ed1cfe605209b062bf46096a869fc68147790d39e52"
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

// Try multiple voice IDs in case one doesn't work with this API key
const VOICE_IDS = [
  "21m00Tcm4TlvDq8ikWAM", // Rachel
  "EXAVITQu4vr4xnSDxMaL", // Bella
  "pNInz6obpgDQGcFmaJgB", // Adam (as fallback)
]

// Bea's voice configuration based on the voice profile
const BEA_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.6,
  use_speaker_boost: true,
}

export async function POST(request: NextRequest) {
  try {
    const { text, emotion = "neutral" } = await request.json()

    console.log("[v0] TTS Route called - NEW VERSION with multiple voice fallbacks")
    console.log("[v0] Text length:", text?.length, "Emotion:", emotion)

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Adjust voice settings based on emotion
    const voiceSettings = { ...BEA_VOICE_SETTINGS }

    switch (emotion) {
      case "happy":
        voiceSettings.stability = 0.4
        voiceSettings.style = 0.7
        break
      case "worried":
        voiceSettings.stability = 0.6
        voiceSettings.style = 0.5
        break
      case "sad":
        voiceSettings.stability = 0.7
        voiceSettings.style = 0.4
        break
    }

    let audioBuffer: ArrayBuffer | null = null
    let lastError = ""

    for (const voiceId of VOICE_IDS) {
      try {
        console.log("[v0] Trying voice ID:", voiceId)

        const ttsResponse = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: voiceSettings,
          }),
        })

        if (ttsResponse.ok) {
          audioBuffer = await ttsResponse.arrayBuffer()
          console.log("[v0] Success with voice ID:", voiceId)
          break
        } else {
          const errorText = await ttsResponse.text()
          lastError = `Voice ${voiceId}: ${ttsResponse.status} - ${errorText}`
          console.log("[v0] Failed with voice ID:", voiceId, "Error:", errorText)
        }
      } catch (err) {
        lastError = `Voice ${voiceId}: ${err}`
        console.log("[v0] Exception with voice ID:", voiceId, "Error:", err)
      }
    }

    if (!audioBuffer) {
      console.error("[v0] All voice IDs failed. Last error:", lastError)
      return NextResponse.json(
        { error: "Failed to generate speech with any available voice", details: lastError },
        { status: 500 },
      )
    }

    // Return audio as response
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("[v0] TTS Error:", error)
    return NextResponse.json({ error: "Failed to generate speech", details: String(error) }, { status: 500 })
  }
}
