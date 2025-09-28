"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

interface Genre {
  id: number;
  name: string;
  color: string;
  cover: string;
}

interface Chart {
  id: number;
  title: string;
  description: string;
  cover: string;
}

interface Playlist {
  id: number;
  title: string;
  description: string;
  cover: string;
}


export default function Browse() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [topCharts, setTopCharts] = useState<Chart[]>([]);
  const [moodPlaylists, setMoodPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  

  async function safeFetch<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return []; // fallback empty array
  }
}

  useEffect(() => {
  async function fetchData() {
    setLoading(true);
    const [fGenres, fTopCharts, fMoodPlaylists] = await Promise.all([
      safeFetch<Genre>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/genres`),
      safeFetch<Chart>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/top-charts`),
      safeFetch<Playlist>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mood-playlists`)

    ]);
    setGenres(fGenres);
    setTopCharts(fTopCharts);
    setMoodPlaylists(fMoodPlaylists);
    setLoading(false);
  }
  fetchData();
}, []);
  if (loading) {
  return (
    <div className="p-6">
      <p>Loading...</p>
    </div>
  );
}



  

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
          {genres.map((genre: Genre) => (
          <Card key={genre.id} className={`${genre.color} hover:scale-105 transition-transform cursor-pointer relative overflow-hidden`}
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
          {topCharts.map((chart: Chart) => (
          <Card key={chart.id} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
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
          {moodPlaylists.map((playlist: Playlist) => (
          <Card key={playlist.id} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
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
