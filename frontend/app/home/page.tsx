"use client";

import { Sidebar } from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { MusicPlayer } from "@/components/music-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

export default function Home() {
  const [jumpBackSongs, setJumpBackSongs] = useState<Song[]>([]);
  const [recommended, setRecommended] = useState<Song[]>([]);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);

  /* ----------------------------------------------------
     ✅ Fetch Data from Backend
  ---------------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // ✅ 1. Jump Back In
    fetch("http://localhost:4000/stats/top-songs/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ JUMP BACK IN RAW RESPONSE →", data);
        setJumpBackSongs(data.topSongs || []);
      })
      .catch((err) => console.error("JumpBackIn fetch error:", err));

    // ✅ 2. Made For You
    fetch("http://localhost:4000/stats/made-for-you", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setRecommended(data.recommended || []))
      .catch((err) => console.error("Recommended fetch error:", err));
  }, []);

  /* ✅ Debug Jump Back In state */
  useEffect(() => {
    console.log("🎧 JUMP BACK SONGS STATE →", jumpBackSongs);
  }, [jumpBackSongs]);

  /* ----------------------------------------------------
     ✅ Update listening history on click
  ---------------------------------------------------- */
  const handleSongClick = async (song: Song) => {
    setCurrentSong(song);

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch("http://localhost:4000/stats/listen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ songId: song.id })
    }).catch((err) => console.error("listen update failed:", err));
  };

  /* ----------------------------------------------------
     ✅ Music Player Handlers
  ---------------------------------------------------- */
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
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying, audio]);

  /* ----------------------------------------------------
     ✅ UI
  ---------------------------------------------------- */
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-3">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Discover new sounds and revisit your favorites
          </p>

          {/* ✅ JUMP BACK IN */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Jump Back In
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jumpBackSongs.map((song) => (
                <Card
                  key={song.id}
                  onClick={() => handleSongClick(song)}
                  className="bg-card hover:bg-accent/50 transition-all cursor-pointer group shadow-lg"
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate">
                        {song.title}
                      </p>
                      <p className="text-muted-foreground truncate">
                        {song.artist}
                      </p>
                    </div>

                    <Button className="opacity-0 group-hover:opacity-100 bg-primary rounded-full w-12 h-12">
                      <Play />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ✅ MADE FOR YOU */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Made for You
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {recommended.map((song) => (
                <Card
                  key={song.id}
                  onClick={() => handleSongClick(song)}
                  className="bg-card hover:bg-accent/50 cursor-pointer group"
                >
                  <CardContent className="p-5">
                    <div className="relative mb-4">
                      <img
                        src={song.cover}
                        className="w-full aspect-square rounded-xl object-cover"
                      />

                      <Button className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 bg-primary rounded-full w-12 h-12">
                        <Play />
                      </Button>
                    </div>
                    <p className="font-semibold truncate">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ✅ MUSIC PLAYER */}
      {currentSong && (
        <MusicPlayer
          currentSong={currentSong}
          audio={audio}
          progress={progress}
          duration={duration}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          setProgress={setProgress}
          volume={volume}
          setVolume={setVolume}
        />
      )}
    </div>
  );
}
