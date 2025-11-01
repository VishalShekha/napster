"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}


/* ---- TypeScript interface ---- */
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

export default function MySongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("email") || "" : "";

  async function fetchSongs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/user-songs?email=${userEmail}`);
      if (!res.ok) throw new Error(`Failed to fetch songs (${res.status})`);
      const data = (await res.json()) as Song[];
      setSongs(data || []);
    } catch (err: any) {
      console.error("fetchSongs error:", err);
      setError(err?.message ?? "Failed to load songs");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }

  

  useEffect(() => {
    fetchSongs();
  }, []);

  const publishedCount = songs.filter((s) => s.status === "published").length;
  const draftCount = songs.filter((s) => s.status === "draft").length;
  const totalPlays = songs.reduce((sum, s) => sum + (s.plays || 0), 0);
  const topPlays =
    songs.length > 0 ? Math.max(...songs.map((s) => s.plays || 0)) : 0;

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Published
        </Badge>
      );
    }
    return <Badge variant="secondary">Draft</Badge>;
  };

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);

  const handlePlay = (song: Song) => {
    // If clicking the same song, just toggle play/pause
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      // New song - set it and start playing
      setCurrentSong(song);
      setIsPlaying(true);
    }

  
  };

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
const [progress, setProgress] = useState(0);
const [duration, setDuration] = useState(0);

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
  if (audio) {
    audio.volume = volume / 100;
  }
}, [volume]);

useEffect(() => {
  if (!audio) return;
  if (isPlaying) audio.play();
  else audio.pause();
}, [isPlaying, audio]);


  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Your Songs
              </h1>
              <p className="text-muted-foreground">
                Manage and track your music uploads
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 rounded-full"
              onClick={() => router.push("/upload")}
            >
              Upload New Song
            </Button>
          </div>

          {/* Loading / Error */}
          {loading && (
            <p className="text-muted-foreground mb-4">Loading songs...</p>
          )}
          {error && <p className="text-red-500 mb-4">Error: {error}</p>}

          {/* Stats */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-primary/20 to-chart-2/20 border-primary/20">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {publishedCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Published Songs
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-chart-3/20 to-chart-4/20 border-chart-3/20">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-chart-3 mb-1">
                    {draftCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Drafts</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-chart-5/20 to-primary/20 border-chart-5/20">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-chart-5 mb-1">
                    {totalPlays.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Plays
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-chart-2/20 to-chart-3/20 border-chart-2/20">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-chart-2 mb-1">
                    {topPlays.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Top Song Plays
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Songs List */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {loading && (
                  <div className="p-6">
                    <p className="text-muted-foreground">
                      Loading songs list...
                    </p>
                  </div>
                )}

                {!loading && !error && songs.length === 0 && (
                  <div className="p-6">
                    <p className="text-muted-foreground">
                      You have no songs yet.
                    </p>
                  </div>
                )}

                {!loading &&
                  !error &&
                  songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0"
                    >
                      <img
                        src={song.cover || "/placeholder.svg"}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-card-foreground truncate">
                            {song.title}
                          </p>
                          {getStatusBadge(song.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {song.album}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="text-center">
                          <div className="font-medium text-foreground">
                            {song.plays.toLocaleString()}
                          </div>
                          <div>plays</div>
                        </div>
                        <div>{song.duration}</div>
                        <div>
                          {new Date(song.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`rounded-full w-8 h-8 ${
                            currentSong?.id === song.id && isPlaying
                              ? "text-primary"
                              : ""
                          }`}
                          onClick={() => handlePlay(song)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full w-8 h-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full w-8 h-8"
                        >
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

     
    {/* --- Bottom Music Player --- */}
    {currentSong && (
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="flex items-center justify-between px-6 py-3">
          {/* --- Left Section: Song Info --- */}
          <div className="flex items-center gap-4 w-1/3">
            <img
              src={currentSong.cover || "/placeholder.svg"}
              alt={currentSong.title}
              className="w-12 h-12 rounded-md object-cover"
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

          {/* --- Middle Section: Controls & Progress --- */}
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-4 mb-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full w-10 h-10 bg-primary/10 hover:bg-primary/20 text-primary transition"
              >
                {isPlaying ? (
                  // Lucide Pause icon (matches Play style)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Progress bar */}
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
                className="w-full accent-primary"
              />
              <span className="text-xs text-muted-foreground w-8">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* --- Right Section: Volume --- */}
          <div className="flex items-center gap-3 w-1/3 justify-end">
            {/* Improved volume icon (Lucide Volume2) */}
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
              className="w-24 accent-primary"
            />
          </div>
        </div>
      </div>
    )}


    </div>
  );
}