"use client"

import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, TrendingUp } from "lucide-react"

export default function Home() {
  const featuredAlbums = [
    { title: "Midnight Dreams", artist: "Luna Eclipse", cover: "/midnight-dreams-album-cover.png" },
    { title: "Electric Pulse", artist: "Neon Waves", cover: "/album-cover-electric-pulse.jpg" },
    { title: "Acoustic Sessions", artist: "River Stone", cover: "/acoustic-sessions-album-cover.png" },
    { title: "Bass Drop", artist: "Digital Storm", cover: "/album-cover-bass-drop.jpg" },
    { title: "Jazz Nights", artist: "Smooth Collective", cover: "/album-cover-jazz-nights.jpg" },
    { title: "Rock Anthems", artist: "Thunder Road", cover: "/album-cover-rock-anthems.jpg" },
  ]

  const recentlyPlayed = [
    { title: "Shattered Reality", artist: "Supersonic", cover: "/album-cover-shattered-reality.jpg" },
    { title: "Ocean Waves", artist: "Calm Sounds", cover: "/album-cover-ocean-waves.png" },
    { title: "City Lights", artist: "Urban Beat", cover: "/album-cover-city-lights.jpg" },
    { title: "Mountain High", artist: "Folk Tales", cover: "/album-cover-mountain-high.png" },
  ]

  const trendingSongs = [
    { title: "Neon Nights", artist: "Cyber Dreams", plays: "2.1M", cover: "/abstract-album-cover.png" },
    { title: "Sunset Boulevard", artist: "Golden Hour", plays: "1.8M", cover: "/midnight-dreams-album-cover.png" },
    { title: "Electric Storm", artist: "Thunder Beats", plays: "1.5M", cover: "/album-cover-electric-pulse.jpg" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-3">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-lg">Discover new sounds and revisit your favorites</p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Jump back in</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentlyPlayed.map((item, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-r from-card to-card/50 hover:from-accent/50 hover:to-accent/30 transition-all duration-300 cursor-pointer group border-0 shadow-lg"
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <img
                      src={item.cover || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-card-foreground truncate text-lg">{item.title}</p>
                      <p className="text-muted-foreground truncate">{item.artist}</p>
                    </div>
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary hover:bg-primary/90 rounded-full w-12 h-12 shadow-lg"
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingSongs.map((song, index) => (
                <Card key={index} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={song.cover || "/placeholder.svg"}
                        alt={song.title}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        <p className="text-xs text-primary font-medium">{song.plays} plays</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Made for you</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary rounded-full">
                Show all
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {featuredAlbums.map((album, index) => (
                <Card
                  key={index}
                  className="bg-card hover:bg-accent/50 transition-all duration-300 cursor-pointer group border-0 shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="relative mb-4">
                      <img
                        src={album.cover || "/placeholder.svg"}
                        alt={album.title}
                        className="w-full aspect-square rounded-xl object-cover shadow-lg"
                      />
                      <Button
                        size="sm"
                        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary hover:bg-primary/90 rounded-full w-12 h-12 shadow-xl"
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground truncate mb-1">{album.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{album.artist}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <MusicPlayer />
    </div>
  )
}
