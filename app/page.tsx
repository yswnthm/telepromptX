"use client"

import { useState } from "react"
import TeleprompterDisplay from "@/components/teleprompter-display"
import TeleprompterControls from "@/components/teleprompter-controls"

export default function Home() {
  const [text, setText] = useState(
    "Welcome to the teleprompter. Enter your text in the control panel below to get started.",
  )
  const [isDisplaying, setIsDisplaying] = useState(false)

  return (
    <main className="h-screen bg-black text-white flex flex-col">
      {isDisplaying ? (
        <TeleprompterDisplay text={text} onExit={() => setIsDisplaying(false)} />
      ) : (
        <div className="flex flex-col h-full">
          <TeleprompterControls text={text} setText={setText} onStart={() => setIsDisplaying(true)} />
        </div>
      )}
    </main>
  )
}
