"use client"

import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Edit, Trash2, Eye } from "lucide-react"

export default function MySongsPage() {
  const mySongs = [
    {
      title: "Midnight Echoes",
      album: "Solo Sessions",
      plays: 1247,
      duration: "3:42",
      status: "published",
      uploadDate: "2024-01-15",
      cover: "/abstract-album-cover.png",
    },
    {
      title: "Digital Dreams",
      album: "Electronic Vibes",
      plays: 892,
      duration: "4:15",
      status: "published",
      uploadDate: "2024-01-10",
      cover: "/midnight-dreams-album-cover.png",
    },
    {
      title: "Acoustic Sunrise",
      album: "Morning Sessions",
      plays: 2156,
      duration: "3:28",
      status: "published",
      uploadDate: "2024-01-05",
      cover: "/acoustic-sessions-album-cover.png",
    },
    {
      title: "Bass Revolution",
      album: "Heavy Beats",
      plays: 3421,
      duration: "2:58",
      status: "published",
      uploadDate: "2023-12-28",
      cover: "/album-cover-bass-drop.jpg",
    },
    {
      title: "Jazz Fusion",
      album: "Smooth Sounds",
      plays: 567,
      duration: "5:12",
      status: "draft",
      uploadDate: "2024-01-20",
      cover: "/album-cover-jazz-nights.jpg",
    },
  ]

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
    }
    return <Badge variant="secondary">Draft</Badge>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Songs</h1>
              <p className="text-muted-foreground">Manage and track your music uploads</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 rounded-full">Upload New Song</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/20 to-chart-2/20 border-primary/20">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary mb-1">
                  {mySongs.filter((s) => s.status === "published").length}
                </div>
                <div className="text-sm text-muted-foreground">Published Songs</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-3/20 to-chart-4/20 border-chart-3/20">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-chart-3 mb-1">
                  {mySongs.filter((s) => s.status === "draft").length}
                </div>
                <div className="text-sm text-muted-foreground">Drafts</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-5/20 to-primary/20 border-chart-5/20">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-chart-5 mb-1">
                  {mySongs.reduce((sum, song) => sum + song.plays, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Plays</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-2/20 to-chart-3/20 border-chart-2/20">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-chart-2 mb-1">
                  {Math.max(...mySongs.map((s) => s.plays)).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Top Song Plays</div>
              </CardContent>
            </Card>
          </div>

          {/* Songs List */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mySongs.map((song, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0"
                  >
                    <img
                      src={song.cover || "/placeholder.svg"}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-card-foreground truncate">{song.title}</p>
                        {getStatusBadge(song.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{song.album}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="text-center">
                        <div className="font-medium text-foreground">{song.plays.toLocaleString()}</div>
                        <div>plays</div>
                      </div>
                      <div>{song.duration}</div>
                      <div>{new Date(song.uploadDate).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="rounded-full w-8 h-8">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full w-8 h-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full w-8 h-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full w-8 h-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MusicPlayer />
    </div>
  )
}
