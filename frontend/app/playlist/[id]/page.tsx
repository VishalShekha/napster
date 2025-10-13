"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play, Pause, Heart, MoreHorizontal, Clock, Download, Share } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow, parseISO } from 'date-fns'

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in your .env file")
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL


interface Song {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  cover?: string
  dateAdded: string
}

interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  owner: string
  followers: number
  totalDuration: string
  songs: Song[]
}

export default function PlaylistPage() {
  const { id } = useParams() as { id: string }
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch playlist data from backend
  useEffect(() => {
    async function fetchPlaylist() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE}/playlists/${id}`)
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        setPlaylist(data)
      } catch (err: any) {
        setError(err.message || "Failed to load playlist")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchPlaylist()
  }, [id])

  const toggleLike = (songId: number) => {
    const newLikedSongs = new Set(likedSongs)
    if (newLikedSongs.has(songId)) {
      newLikedSongs.delete(songId)
    } else {
      newLikedSongs.add(songId)
    }
    setLikedSongs(newLikedSongs)
    // 👉 optionally send like/unlike request to backend here
    // fetch(`${API_BASE}/songs/${songId}/like`, { method: "POST" })
  }

  if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>
  if (!playlist) return <p className="p-6 text-muted-foreground">Playlist not found</p>

  return (
    <div className="p-6 bg-gradient-to-b from-purple-700 via-purple-900 to-black text-white min-h-screen">
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
          <h1 className="text-5xl font-bold mb-4">{playlist.name}</h1>
          <p className="text-gray-300 mb-4">{playlist.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="font-medium text-white">{playlist.owner}</span>
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
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button variant="ghost" size="lg" className="text-gray-300 hover:text-white">
          <Heart className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="lg" className="text-gray-300 hover:text-white">
          <Download className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="lg" className="text-gray-300 hover:text-white">
          <Share className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="lg" className="text-gray-300 hover:text-white">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Songs List */}
      <div className="space-y-2 bg-black/40 rounded-lg p-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
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
            className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-purple-800/40 group cursor-pointer"
          >
            <div className="col-span-1 flex items-center">
              <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
              <Button size="sm" variant="ghost" className="hidden group-hover:flex w-8 h-8 p-0">
                <Play className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-5 flex items-center gap-3">
              <img src={song.cover || "/placeholder.svg"} alt={song.title} className="w-10 h-10 rounded object-cover" />
              <div>
                <p className="font-medium text-white">{song.title}</p>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </div>
            <div className="col-span-3 flex items-center">
              <p className="text-sm text-gray-400">{song.album}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(parseISO(song.dateAdded), { addSuffix: true })}
              </p>
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
                    likedSongs.has(song.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </Button>
              <span className="text-sm text-gray-400">{song.duration}</span>
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
