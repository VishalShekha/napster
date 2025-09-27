"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Play, X } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState([
    "Shattered Reality",
    "Supersonic",
    "Electronic music",
    "Chill vibes",
  ])

  // Mock search results
  const searchResults = {
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
        title: "Electric Pulse",
        artist: "Neon Waves",
        album: "Synthwave",
        duration: "3:55",
        cover: "/album-cover-electric-pulse.jpg",
      },
      {
        id: 3,
        title: "Bass Drop",
        artist: "Digital Storm",
        album: "Electronic Fury",
        duration: "3:18",
        cover: "/album-cover-bass-drop.jpg",
      },
    ],
    artists: [
      {
        id: 1,
        name: "Supersonic",
        followers: "1.2M",
        cover: "/placeholder.svg?key=artist1",
      },
      {
        id: 2,
        name: "Neon Waves",
        followers: "856K",
        cover: "/placeholder.svg?key=artist2",
      },
      {
        id: 3,
        name: "Digital Storm",
        followers: "623K",
        cover: "/placeholder.svg?key=artist3",
      },
    ],
    albums: [
      {
        id: 1,
        title: "Digital Dreams",
        artist: "Supersonic",
        year: "2024",
        cover: "/album-cover-shattered-reality.jpg",
      },
      {
        id: 2,
        title: "Synthwave",
        artist: "Neon Waves",
        year: "2024",
        cover: "/album-cover-electric-pulse.jpg",
      },
      {
        id: 3,
        title: "Electronic Fury",
        artist: "Digital Storm",
        year: "2023",
        cover: "/album-cover-bass-drop.jpg",
      },
    ],
    playlists: [
      {
        id: 1,
        title: "Electronic Hits",
        description: "The best electronic music",
        songs: 127,
        cover: "/placeholder.svg?key=playlist1",
      },
      {
        id: 2,
        title: "Future Bass",
        description: "Modern bass-heavy tracks",
        songs: 89,
        cover: "/placeholder.svg?key=playlist2",
      },
    ],
  }

  const browseCategories = [
    { name: "Pop", color: "bg-pink-500" },
    { name: "Hip-Hop", color: "bg-orange-500" },
    { name: "Rock", color: "bg-red-500" },
    { name: "Electronic", color: "bg-purple-500" },
    { name: "Jazz", color: "bg-blue-500" },
    { name: "Classical", color: "bg-green-500" },
    { name: "R&B", color: "bg-yellow-500" },
    { name: "Country", color: "bg-amber-600" },
  ]

  const removeRecentSearch = (searchToRemove: string) => {
    setRecentSearches(recentSearches.filter((search) => search !== searchToRemove))
  }

  const hasResults = query.length > 0

  return (
    <div className="p-6">
      {/* Search Header */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {!hasResults ? (
        <div>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent searches</h2>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-accent/50 cursor-pointer group"
                  >
                    <span className="text-foreground">{search}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 p-0"
                      onClick={() => removeRecentSearch(search)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Browse Categories */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {browseCategories.map((category, index) => (
                <Card
                  key={index}
                  className={`${category.color} hover:scale-105 transition-transform cursor-pointer relative overflow-hidden`}
                >
                  <CardContent className="p-4 h-24 flex items-end">
                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Result */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Top result</h2>
            <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={searchResults.songs[0].cover || "/placeholder.svg"}
                    alt={searchResults.songs[0].title}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-card-foreground mb-1">{searchResults.songs[0].title}</h3>
                    <p className="text-muted-foreground">Song • {searchResults.songs[0].artist}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12"
                >
                  <Play className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Songs */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Songs</h2>
            <div className="space-y-2">
              {searchResults.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-accent/50 cursor-pointer group"
                >
                  <img
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{song.title}</p>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{song.duration}</span>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 w-8 h-8 p-0">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Artists */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {searchResults.artists.map((artist) => (
                <Card key={artist.id} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <img
                      src={artist.cover || "/placeholder.svg"}
                      alt={artist.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                    <p className="font-medium text-card-foreground mb-1">{artist.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      Artist
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Albums */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {searchResults.albums.map((album) => (
                <Card key={album.id} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={album.cover || "/placeholder.svg"}
                        alt={album.title}
                        className="w-full aspect-square rounded-md object-cover"
                      />
                      <Button
                        size="sm"
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 rounded-full w-10 h-10 shadow-lg"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium text-card-foreground truncate mb-1">{album.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {album.year} • {album.artist}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Playlists */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Playlists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {searchResults.playlists.map((playlist) => (
                <Card key={playlist.id} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={playlist.cover || "/placeholder.svg"}
                        alt={playlist.title}
                        className="w-full aspect-square rounded-md object-cover"
                      />
                      <Button
                        size="sm"
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 rounded-full w-10 h-10 shadow-lg"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium text-card-foreground truncate mb-1">{playlist.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{playlist.songs} songs</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
