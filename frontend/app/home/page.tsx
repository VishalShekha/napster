"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

interface Song {
  id: string;
  title: string;
  album: string;
  plays: number;
  duration: string;
  status: "published" | "draft";
  uploadDate: string;
  cover?: string;
  audioUrl?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]); // new state
  const [loading, setLoading] = useState(true);
  const [loadingRec, setLoadingRec] = useState(true); // rec loading
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);

  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("email") || "" : "";

  // Fetch user's uploaded songs
  async function fetchSongs() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/user-songs?email=${userEmail}`);
      if (!res.ok) throw new Error("Failed to fetch songs");
      const data = (await res.json()) as Song[];
      setSongs(data || []);
    } catch (err: any) {
      setError(err.message);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch recommendations
  async function fetchRecommendations() {
    try {
      setLoadingRec(true);
      console.log(
        "Fetching recommendations for:",
        `${API_BASE}/api/rec?email=${userEmail}`
      );
      const res = await fetch(
        `${API_BASE}/api/rec?email=${encodeURIComponent(userEmail)}`
      );
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = (await res.json()) as Song[];
      setRecommendedSongs(data || []);
    } catch (err: any) {
      console.error("Error fetching recommendations:", err);
      setRecommendedSongs([]);
    } finally {
      setLoadingRec(false);
    }
  }

  async function incrementPlayCount(songId: string) {
    try {
      await fetch(`${API_BASE}/increment-play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });
    } catch (err) {
      console.error("Error incrementing play count:", err);
    }
  }

  async function updateListeningHistory(songId: string) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/api/stats/listen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ songId }),
      });
    } catch (err) {
      console.error("Error saving listening history:", err);
    }
  }

  useEffect(() => {
    fetchSongs();
    fetchRecommendations();
  }, []);

  const handlePlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      incrementPlayCount(song.id);
      updateListeningHistory(song.id);
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentSong?.audioUrl) {
      const newAudio = new Audio(currentSong.audioUrl);
      newAudio.volume = volume / 100;

      newAudio.addEventListener("loadedmetadata", () =>
        setDuration(newAudio.duration)
      );
      newAudio.addEventListener("timeupdate", () =>
        setProgress(newAudio.currentTime)
      );
      newAudio.addEventListener("ended", () => setIsPlaying(false));

      setAudio(newAudio);
      return () => {
        newAudio.pause();
        newAudio.src = "";
      };
    }
  }, [currentSong]);

  useEffect(() => {
    if (audio) audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audio) return;
    if (isPlaying) audio.play();
    else audio.pause();
  }, [isPlaying, audio]);

  return (
    <div className="flex h-screen bg-gradient-to-b from-background to-muted/20">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-28">
        <div className="p-8">
          {/* Header */}
          <h1 className="text-4xl font-bold text-foreground mb-6 tracking-tight">
            Welcome Back 🎧
          </h1>
          <p className="text-muted-foreground mb-10">
            Here are your uploaded songs. Sit back and enjoy.
          </p>

          {/* --- Uploaded Songs --- */}
          {loading && (
            <p className="text-muted-foreground animate-pulse">
              Loading your music...
            </p>
          )}
          {error && <p className="text-red-500">Error: {error}</p>}

          {!loading && !error && songs.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Songs</h2>
              <div className="flex gap-6 overflow-x-auto scrollbar-hide py-2">
                {songs.map((song, i) => (
                  <motion.div
                    key={song.id}
                    className="min-w-[240px] flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="group relative overflow-hidden border border-border/50 bg-card/60 backdrop-blur-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl">
                      <div className="relative">
                        <img
                          src={song.cover || "/placeholder.svg"}
                          alt={song.title}
                          className="w-full h-48 object-cover rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Button
                            size="icon"
                            className="rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                            onClick={() => handlePlay(song)}
                          >
                            {currentSong?.id === song.id && isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-semibold text-foreground truncate text-base">
                          {song.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {song.album}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && songs.length === 0 && (
            <div className="text-center text-muted-foreground mt-20 text-lg">
              You have no songs yet. 🎵
            </div>
          )}

          {/* --- Recommendations Section --- */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>

            {loadingRec && (
              <p className="text-muted-foreground animate-pulse">
                Fetching your personalized recommendations...
              </p>
            )}

            {!loadingRec && recommendedSongs.length > 0 && (
              <div className="flex gap-6 overflow-x-auto scrollbar-hide py-2">
                {recommendedSongs.map((song, i) => (
                  <motion.div
                    key={song.id}
                    className="min-w-[240px] flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="group relative overflow-hidden border border-border/50 bg-card/60 backdrop-blur-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl">
                      <div className="relative">
                        <img
                          src={song.cover || "/placeholder.svg"}
                          alt={song.title}
                          className="w-full h-48 object-cover rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Button
                            size="icon"
                            className="rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                            onClick={() => handlePlay(song)}
                          >
                            {currentSong?.id === song.id && isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-semibold text-foreground truncate text-base">
                          {song.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {song.album}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!loadingRec && recommendedSongs.length === 0 && (
              <div className="text-center text-muted-foreground mt-10 text-lg">
                No recommendations available right now. 🎶
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- Bottom Player --- */}
      {currentSong && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="fixed bottom-0 left-0 right-0 bg-card/70 backdrop-blur-lg border-t border-border shadow-2xl z-50"
        >
          <div className="flex items-center justify-between px-8 py-4">
            {/* Left: Song info */}
            <div className="flex items-center gap-4 w-1/3">
              <img
                src={currentSong.cover || "/placeholder.svg"}
                alt={currentSong.title}
                className="w-14 h-14 rounded-xl object-cover shadow-md"
              />
              <div>
                <p className="font-semibold text-foreground truncate max-w-[180px]">
                  {currentSong.title}
                </p>
                <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                  {currentSong.album}
                </p>
              </div>
            </div>

            {/* Middle: Controls */}
            <div className="flex flex-col items-center w-1/3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full w-12 h-12 bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-105 mb-1"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {formatTime(progress)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Right: Volume */}
            <div className="flex items-center gap-3 w-1/3 justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 010 14.14" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
              </svg>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-28 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
