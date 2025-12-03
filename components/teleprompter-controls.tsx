"use client"

import { useState } from "react"
import { Play, Save, FolderOpen, Trash2, X } from "lucide-react"

interface TeleprompterControlsProps {
  text: string
  setText: (text: string) => void
  onStart: () => void
}

export default function TeleprompterControls({ text, setText, onStart }: TeleprompterControlsProps) {
  const [savedScripts, setSavedScripts] = useState<Array<{ id: string; name: string; content: string }>>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSave = () => {
    const name = prompt("Enter script name:")
    if (name) {
      setSavedScripts([
        ...savedScripts,
        {
          id: Date.now().toString(),
          name,
          content: text,
        },
      ])
    }
  }

  const handleLoad = (content: string) => {
    setText(content)
    setIsSidebarOpen(false)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedScripts(savedScripts.filter((script) => script.id !== id))
  }

  return (
    <div className="relative flex flex-col h-full max-w-4xl mx-auto w-full p-6 md:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Teleprompter</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Saved Scripts"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Save Script"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing your script here..."
          className="w-full h-full bg-transparent text-lg md:text-xl leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/50"
        />
        
        {/* Floating Start Button */}
        <div className="absolute bottom-0 right-0 p-4">
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Prompter
          </button>
        </div>
      </div>

      {/* Saved Scripts Sidebar (Drawer-like) */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex justify-end bg-background/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-background border-l border-border h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Saved Scripts</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {savedScripts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No saved scripts yet.</p>
                </div>
              ) : (
                savedScripts.map((script) => (
                  <div
                    key={script.id}
                    onClick={() => handleLoad(script.content)}
                    className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 cursor-pointer transition-all"
                  >
                    <span className="font-medium truncate flex-1">{script.name}</span>
                    <button
                      onClick={(e) => handleDelete(script.id, e)}
                      className="p-2 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
