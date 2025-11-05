"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  song?: {
    id?: string;
    title: string;
    artist?: string;
    cover?: string;
    audioUrl?: string;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
  volume: number;
  onVolumeChange: (v: number) => void;
}

export function MusicPlayer({
  song,
  isPlaying,
  onPlayPause,
  volume,
  onVolumeChange,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ✅ Ensure listen is recorded only once per song
  const hasRecorded = useRef(false);

  // ✅ Listen recorder
  const recordListen = async () => {
    if (!song?.id) return;

    try {
      const res = await fetch("http://localhost:4000/api/stats/listen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ songId: song.id }),
      });

      console.log("✅ Listen recorded for", song.title);
    } catch (err) {
      console.error("❌ Failed to record listen:", err);
    }
  };

  // ✅ SONG CHANGED
  useEffect(() => {
    if (!audioRef.current || !song?.audioUrl) return;

    const audio = audioRef.current;

    audio.pause();
    audio.src = song.audioUrl;
    audio.load();

    hasRecorded.current = false; // ✅ reset counter for new song
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch((err) => console.warn("Playback failed:", err));
    }
  }, [song?.id]); // ✅ song.id triggers when switching songs

  // ✅ PLAY / PAUSE CONTROL
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch((err) => console.warn("Playback failed:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ✅ RECORD LISTEN WHEN USER PRESSES PLAY (ONLY ONCE)
  useEffect(() => {
    if (!isPlaying || !song?.id) return;

    if (!hasRecorded.current) {
      recordListen();
      hasRecorded.current = true;
    }
  }, [isPlaying, song?.id]);

  // ✅ AUDIO LISTENERS
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => onPlayPause();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onPlayPause]);

  // ✅ Format time
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // ✅ Seek control
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
      <audio ref={audioRef} />

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Currently Playing */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 bg-muted rounded-md flex items-center justify-center">
            {song?.cover ? (
              <img
                src={song.cover}
                alt="Album cover"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="text-muted-foreground text-xs">No Cover</div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {song?.title || "No song playing"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {song?.artist || "—"}
            </p>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-8 h-8"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatTime(currentTime)}
            </span>

            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration || 100}
              step={1}
              className="flex-1"
            />

            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}
