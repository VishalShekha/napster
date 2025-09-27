import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

export default function Browse() {
  const genres = [
    { name: "Pop", color: "bg-pink-500", cover: "/placeholder.svg?key=pop1" },
    { name: "Hip-Hop", color: "bg-orange-500", cover: "/placeholder.svg?key=hiphop1" },
    { name: "Rock", color: "bg-red-500", cover: "/placeholder.svg?key=rock1" },
    { name: "Electronic", color: "bg-purple-500", cover: "/placeholder.svg?key=electronic1" },
    { name: "Jazz", color: "bg-blue-500", cover: "/placeholder.svg?key=jazz1" },
    { name: "Classical", color: "bg-green-500", cover: "/placeholder.svg?key=classical1" },
    { name: "R&B", color: "bg-yellow-500", cover: "/placeholder.svg?key=rnb1" },
    { name: "Country", color: "bg-amber-600", cover: "/placeholder.svg?key=country1" },
    { name: "Indie", color: "bg-teal-500", cover: "/placeholder.svg?key=indie1" },
    { name: "Alternative", color: "bg-indigo-500", cover: "/placeholder.svg?key=alt1" },
  ]

  const topCharts = [
    { title: "Global Top 50", description: "The most played songs right now", cover: "/placeholder.svg?key=global50" },
    { title: "Viral 50", description: "The most viral tracks", cover: "/placeholder.svg?key=viral50" },
    { title: "Top Hits 2024", description: "The biggest hits of the year", cover: "/placeholder.svg?key=tophits" },
    { title: "New Music Friday", description: "Fresh tracks for your weekend", cover: "/placeholder.svg?key=newmusic" },
  ]

  const moodPlaylists = [
    { title: "Chill Vibes", description: "Relax and unwind", cover: "/placeholder.svg?key=chill" },
    { title: "Workout Energy", description: "High energy tracks", cover: "/placeholder.svg?key=workout" },
    { title: "Focus Flow", description: "Music for concentration", cover: "/placeholder.svg?key=focus" },
    { title: "Party Mix", description: "Get the party started", cover: "/placeholder.svg?key=party" },
    { title: "Sleep Sounds", description: "Peaceful tracks for rest", cover: "/placeholder.svg?key=sleep" },
    { title: "Road Trip", description: "Perfect driving companions", cover: "/placeholder.svg?key=roadtrip" },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Browse all</h1>
        <p className="text-muted-foreground">Discover music by genre, mood, and more</p>
      </div>

      {/* Genres */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Browse by genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {genres.map((genre, index) => (
            <Card
              key={index}
              className={`${genre.color} hover:scale-105 transition-transform cursor-pointer relative overflow-hidden`}
            >
              <CardContent className="p-4 h-32 flex flex-col justify-between">
                <h3 className="text-white font-bold text-lg">{genre.name}</h3>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-black/20 rounded-full transform rotate-12">
                  <img
                    src={genre.cover || "/placeholder.svg"}
                    alt={genre.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Charts */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Top charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCharts.map((chart, index) => (
            <Card key={index} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={chart.cover || "/placeholder.svg"}
                    alt={chart.title}
                    className="w-full aspect-square rounded-md object-cover"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 rounded-full w-10 h-10 shadow-lg"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium text-card-foreground truncate mb-1">{chart.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{chart.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mood & Activity */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Mood & activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moodPlaylists.map((playlist, index) => (
            <Card key={index} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-4">
                <img
                  src={playlist.cover || "/placeholder.svg"}
                  alt={playlist.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground truncate">{playlist.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{playlist.description}</p>
                </div>
                <Button
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 rounded-full w-10 h-10"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
