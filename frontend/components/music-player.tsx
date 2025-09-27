"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState([30])
  const [volume, setVolume] = useState([75])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Currently Playing */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 bg-muted rounded-md flex items-center justify-center">
            <img src="/abstract-album-cover.png" alt="Album cover" className="w-full h-full object-cover rounded-md" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Shattered Reality</p>
            <p className="text-xs text-muted-foreground truncate">Supersonic</p>
          </div>
          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-8 h-8"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground">0:15</span>
            <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="flex-1" />
            <span className="text-xs text-muted-foreground">3:42</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-24" />
        </div>
      </div>
    </div>
  )
}
