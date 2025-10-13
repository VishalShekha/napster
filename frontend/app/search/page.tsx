"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MusicPlayer } from "@/components/music-player";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in your .env file");
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover?: string;
}

interface Artist {
  id: number;
  name: string;
  followers: string;
  cover?: string;
}

interface Album {
  id: number;
  title: string;
  artist: string;
  year: string;
  cover?: string;
}

interface Playlist {
  id: number;
  title: string;
  description: string;
  songs: number;
  cover?: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

interface SearchResults {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE}/search/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch results when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    async function fetchResults() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch search results");
        const data = (await res.json()) as SearchResults;
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          {/* 🔍 Search Bar */}
          <div className="flex items-center gap-2 mb-8">
            <Input
              placeholder="What do you want to listen to?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            {query && (
              <Button
                variant="outline"
                onClick={() => setQuery("")}
                className="rounded-full"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Results or Categories */}
          {loading && <p className="text-muted-foreground">Loading...</p>}

          {!loading && results ? (
            <div className="space-y-8">
              {/* Songs */}
              {results.songs.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Songs
                  </h2>
                  <div className="space-y-2">
                    {results.songs.map((song) => (
                      <Card
                        key={song.id}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <img
                            src={song.cover || "/placeholder.svg"}
                            alt={song.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{song.title}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {song.artist} • {song.album}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {song.duration}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Artists */}
              {results.artists.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Artists
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.artists.map((artist) => (
                      <Card
                        key={artist.id}
                        className="hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <img
                            src={artist.cover || "/placeholder.svg"}
                            alt={artist.name}
                            className="w-24 h-24 rounded-full object-cover mb-2"
                          />
                          <p className="font-medium">{artist.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {artist.followers} followers
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Albums */}
              {results.albums.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Albums
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.albums.map((album) => (
                      <Card
                        key={album.id}
                        className="hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <img
                            src={album.cover || "/placeholder.svg"}
                            alt={album.title}
                            className="w-24 h-24 rounded-md object-cover mb-2"
                          />
                          <p className="font-medium">{album.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {album.artist} • {album.year}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Playlists */}
              {results.playlists.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Playlists
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.playlists.map((pl) => (
                      <Card
                        key={pl.id}
                        className="hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <img
                            src={pl.cover || "/placeholder.svg"}
                            alt={pl.title}
                            className="w-24 h-24 rounded-md object-cover mb-2"
                          />
                          <p className="font-medium">{pl.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {pl.songs} songs
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            // Browse Categories (default view)
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Browse all
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className={`${category.color} hover:scale-105 transition-transform cursor-pointer relative overflow-hidden`}
                    onClick={() => setQuery(category.name)}
                  >
                    <CardContent className="p-4 h-24 flex items-end">
                      <h3 className="text-white font-bold text-lg">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
