"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Heart, MoreHorizontal, Clock, Download, Share } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PlaylistPageProps {
  params: {
    id: string
  }
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set([1, 3, 5]))

  // Mock playlist data
  const playlist = {
    id: params.id,
    name: "My Playlist #1",
    description: "A collection of my favorite tracks",
    cover: "/placeholder.svg?key=playlist1",
    owner: "You",
    followers: 1247,
    totalDuration: "2 hr 34 min",
    songs: [
      {
        id: 1,
        title: "Shattered Reality",
        artist: "Supersonic",
        album: "Digital Dreams",
        duration: "3:42",
        cover: "/album-cover-shattered-reality.jpg",
      },
      {
        id: 2,
        title: "Ocean Waves",
        artist: "Calm Sounds",
        album: "Nature's Symphony",
        duration: "4:15",
        cover: "/album-cover-ocean-waves.png",
      },
      {
        id: 3,
        title: "City Lights",
        artist: "Urban Beat",
        album: "Metropolitan",
        duration: "3:28",
        cover: "/album-cover-city-lights.jpg",
      },
      {
        id: 4,
        title: "Mountain High",
        artist: "Folk Tales",
        album: "Wilderness",
        duration: "5:02",
        cover: "/album-cover-mountain-high.png",
      },
      {
        id: 5,
        title: "Electric Pulse",
        artist: "Neon Waves",
        album: "Synthwave",
        duration: "3:55",
        cover: "/album-cover-electric-pulse.jpg",
      },
      {
        id: 6,
        title: "Midnight Dreams",
        artist: "Luna Eclipse",
        album: "Nocturnal",
        duration: "4:33",
        cover: "/midnight-dreams-album-cover.png",
      },
      {
        id: 7,
        title: "Bass Drop",
        artist: "Digital Storm",
        album: "Electronic Fury",
        duration: "3:18",
        cover: "/album-cover-bass-drop.jpg",
      },
      {
        id: 8,
        title: "Jazz Nights",
        artist: "Smooth Collective",
        album: "After Hours",
        duration: "6:12",
        cover: "/album-cover-jazz-nights.jpg",
      },
    ],
  }

  const toggleLike = (songId: number) => {
    const newLikedSongs = new Set(likedSongs)
    if (newLikedSongs.has(songId)) {
      newLikedSongs.delete(songId)
    } else {
      newLikedSongs.add(songId)
    }
    setLikedSongs(newLikedSongs)
  }

  return (
    <div className="p-6">
      {/* Playlist Header */}
      <div className="flex items-end gap-6 mb-8">
        <img
          src={playlist.cover || "/placeholder.svg"}
          alt={playlist.name}
          className="w-60 h-60 rounded-lg object-cover shadow-2xl"
        />
        <div className="flex-1">
          <Badge variant="secondary" className="mb-2">
            Playlist
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-4">{playlist.name}</h1>
          <p className="text-muted-foreground mb-4">{playlist.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{playlist.owner}</span>
            <span>•</span>
            <span>{playlist.followers.toLocaleString()} followers</span>
            <span>•</span>
            <span>
              {playlist.songs.length} songs, {playlist.totalDuration}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-14 h-14"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
          <Heart className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
          <Download className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
          <Share className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Songs List */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Album</div>
          <div className="col-span-2">Date added</div>
          <div className="col-span-1 flex justify-end">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        {/* Song Rows */}
        {playlist.songs.map((song, index) => (
          <div
            key={song.id}
            className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-accent/50 group cursor-pointer"
          >
            <div className="col-span-1 flex items-center">
              <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
              <Button size="sm" variant="ghost" className="hidden group-hover:flex w-8 h-8 p-0">
                <Play className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-5 flex items-center gap-3">
              <img src={song.cover || "/placeholder.svg"} alt={song.title} className="w-10 h-10 rounded object-cover" />
              <div>
                <p className="font-medium text-foreground">{song.title}</p>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
            </div>
            <div className="col-span-3 flex items-center">
              <p className="text-sm text-muted-foreground">{song.album}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-muted-foreground">3 days ago</p>
            </div>
            <div className="col-span-1 flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 w-8 h-8 p-0"
                onClick={() => toggleLike(song.id)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    likedSongs.has(song.id) ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                />
              </Button>
              <span className="text-sm text-muted-foreground">{song.duration}</span>
              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 w-8 h-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
