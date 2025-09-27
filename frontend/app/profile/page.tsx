"use client"

import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Play, MoreHorizontal, Edit } from "lucide-react"

export default function ProfilePage() {
  const userSongs = [
    {
      title: "Midnight Echoes",
      artist: "You",
      album: "Solo Sessions",
      plays: 1247,
      duration: "3:42",
      cover: "/abstract-album-cover.png",
    },
    {
      title: "Digital Dreams",
      artist: "You",
      album: "Electronic Vibes",
      plays: 892,
      duration: "4:15",
      cover: "/midnight-dreams-album-cover.png",
    },
    {
      title: "Acoustic Sunrise",
      artist: "You",
      album: "Morning Sessions",
      plays: 2156,
      duration: "3:28",
      cover: "/acoustic-sessions-album-cover.png",
    },
    {
      title: "Bass Revolution",
      artist: "You",
      album: "Heavy Beats",
      plays: 3421,
      duration: "2:58",
      cover: "/album-cover-bass-drop.jpg",
    },
    {
      title: "Jazz Fusion",
      artist: "You",
      album: "Smooth Sounds",
      plays: 567,
      duration: "5:12",
      cover: "/album-cover-jazz-nights.jpg",
    },
  ]

  const totalPlays = userSongs.reduce((sum, song) => sum + song.plays, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-8 mb-8">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/music-artist-profile.jpg" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">
                Artist
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-2">John Doe</h1>
              <p className="text-muted-foreground mb-4">
                {totalPlays.toLocaleString()} total plays • {userSongs.length} songs
              </p>
              <div className="flex items-center gap-4">
                <Button className="bg-primary hover:bg-primary/90 rounded-full px-8">
                  <Play className="h-4 w-4 mr-2" />
                  Play All
                </Button>
                <Button variant="outline" className="rounded-full bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/20 to-chart-2/20 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Plays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalPlays.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-3/20 to-chart-4/20 border-chart-3/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Songs Released</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-3">{userSongs.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-5/20 to-primary/20 border-chart-5/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Most Popular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-5">
                  {Math.max(...userSongs.map((s) => s.plays)).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Songs */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Songs</h2>
            <div className="space-y-2">
              {userSongs.map((song, index) => (
                <Card key={index} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-muted-foreground w-6 text-center">{index + 1}</div>
                      <img
                        src={song.cover || "/placeholder.svg"}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.album}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-muted-foreground">{song.plays.toLocaleString()} plays</div>
                      <div className="text-sm text-muted-foreground">{song.duration}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-8 h-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
