"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, X, Settings2, Type, ArrowUp, ArrowDown } from "lucide-react"

interface TeleprompterDisplayProps {
  text: string
  onExit: () => void
}

export default function TeleprompterDisplay({ text, onExit }: TeleprompterDisplayProps) {
  const [mode, setMode] = useState<"scroll" | "typewriter">("scroll")
  const [speed, setSpeed] = useState(30)
  const [fontSize, setFontSize] = useState(64)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [charIndex, setCharIndex] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isMirrored, setIsMirrored] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const typewriterIntervalRef = useRef<NodeJS.Timeout>()
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false)
      }, 2000)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [isPlaying])

  // Handle scroll mode
  useEffect(() => {
    if (mode !== "scroll") return
    if (!isPlaying) return

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        if (scrollContainerRef.current) {
          const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight
          // Stop if we reached the end
          if (prev >= maxScroll && maxScroll > 0) {
            setIsPlaying(false)
            return prev
          }
          return prev + speed / 10
        }
        return prev
      })
    }, 20)

    return () => clearInterval(interval)
  }, [mode, isPlaying, speed])

  // Apply scroll position
  useEffect(() => {
    if (scrollContainerRef.current && mode === "scroll") {
      scrollContainerRef.current.scrollTop = scrollPosition
    }
  }, [scrollPosition, mode])

  // Handle typewriter mode
  useEffect(() => {
    if (mode !== "typewriter") return
    if (!isPlaying) return

    const delay = Math.max(10, 200 - speed * 2)

    typewriterIntervalRef.current = setInterval(() => {
      setCharIndex((prev) => {
        if (prev < text.length) {
          setDisplayedText(text.substring(0, prev + 1))
          return prev + 1
        } else {
          setIsPlaying(false)
          return prev
        }
      })
    }, delay)

    return () => clearInterval(typewriterIntervalRef.current)
  }, [mode, isPlaying, speed, text])

  const handleModeChange = (newMode: "scroll" | "typewriter") => {
    setMode(newMode)
    setScrollPosition(0)
    setCharIndex(0)
    setDisplayedText("")
    setIsPlaying(false)
  }

  const handleReset = () => {
    setScrollPosition(0)
    setCharIndex(0)
    setDisplayedText("")
    setIsPlaying(false)
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-black text-white overflow-hidden">
      {/* Main Display */}
      <div
        className={`flex-1 w-full h-full relative ${isMirrored ? "scale-x-[-1]" : ""}`}
      >
        {mode === "scroll" ? (
          <div
            ref={scrollContainerRef}
            className="w-full h-full overflow-hidden px-[10%] no-scrollbar"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.4
            }}
          >
            {/* Padding to allow text to start from middle and end in middle */}
            <div className="h-[45vh]" />
            <div className="font-bold tracking-tight text-center pb-[50vh] transition-all duration-300 ease-linear">
              {text}
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center px-[10%] text-center font-bold tracking-tight whitespace-pre-wrap break-words"
            style={{ fontSize: `${fontSize}px` }}
          >
            {displayedText}
            <span className="animate-pulse ml-1 text-primary">|</span>
          </div>
        )}

        {/* Reading Guide (Center Line) for Scroll Mode */}
        {mode === "scroll" && (
          <div className="absolute top-1/2 left-0 w-full flex items-center justify-between pointer-events-none opacity-20">
            <div className="h-px bg-white w-8" />
            <div className="h-px bg-white w-8" />
          </div>
        )}
      </div>

      {/* Floating Control Bar */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${showControls ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
      >
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl flex items-center gap-4 px-6">

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>

          <div className="w-px h-8 bg-white/10" />

          {/* Speed Control */}
          <div className="flex flex-col gap-1 w-32 group">
            <div className="flex justify-between text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
              <span>Speed</span>
              <span>{speed}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Font Size Control */}
          <div className="flex flex-col gap-1 w-32 group">
            <div className="flex justify-between text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
              <span>Size</span>
              <span>{fontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="128"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isMirrored ? "text-white bg-white/10" : "text-zinc-400 hover:text-white"}`}
              title="Mirror Text"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleModeChange(mode === "scroll" ? "typewriter" : "scroll")}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title={mode === "scroll" ? "Switch to Typewriter" : "Switch to Scroll"}
            >
              {mode === "scroll" ? <Type className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            </button>
            <button
              onClick={onExit}
              className="p-2 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors"
              title="Exit"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
