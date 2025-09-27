"use client"

import { Home, Search, Library, Heart, Music, User, Upload, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { CreatePlaylistDialog } from "@/components/create-playlist-dialog"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [groupMode, setGroupMode] = useState(false)

  const playlists = [
    { name: "Liked Songs", id: "liked" },
    { name: "My Playlist #1", id: "1" },
    { name: "Discover Weekly", id: "discover" },
    { name: "Release Radar", id: "radar" },
    { name: "Chill Vibes", id: "chill" },
    { name: "Workout Mix", id: "workout" },
    { name: "Road Trip", id: "roadtrip" },
    { name: "Focus Flow", id: "focus" },
  ]

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">SoundWave</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent rounded-full w-9 h-9"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent rounded-full w-9 h-9"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-sidebar-foreground">Group Mode</span>
          <Switch checked={groupMode} onCheckedChange={setGroupMode} className="data-[state=checked]:bg-primary" />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-3">
        <div className="space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Home className="h-5 w-5" />
              Home
            </Button>
          </Link>
          <Link href="/search">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/search" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Search className="h-5 w-5" />
              Search
            </Button>
          </Link>
          <Link href="/browse">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/browse" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Library className="h-5 w-5" />
              Browse
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="mx-4 bg-sidebar-border" />

      <div className="px-4 py-3">
        <div className="space-y-2">
          <Link href="/upload">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/upload" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Upload className="h-5 w-5" />
              Upload Song
            </Button>
          </Link>
          <Link href="/my-songs">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/my-songs" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Music className="h-5 w-5" />
              Your Songs
            </Button>
          </Link>
          <CreatePlaylistDialog />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11"
          >
            <Heart className="h-5 w-5" />
            Liked Songs
          </Button>
        </div>
      </div>

      <Separator className="mx-4 bg-sidebar-border" />

      {/* Playlists */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 py-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Your Playlists</h3>
          {playlists.map((playlist, index) => (
            <Link key={index} href={`/playlist/${playlist.id}`}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm rounded-xl h-10 ${
                  pathname === `/playlist/${playlist.id}` ? "bg-sidebar-accent text-primary" : ""
                }`}
              >
                {playlist.name}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
