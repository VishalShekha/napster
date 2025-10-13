"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MusicPlayer } from "@/components/music-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Play, MoreHorizontal, Edit } from "lucide-react";

/* ---- TypeScript interface ---- */
interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  plays: number;
  duration: string;
  cover?: string;
}

interface UserProfile {
  name: string;
  avatarUrl?: string;
  initials: string;
  role: string; // e.g., "Artist"
}



if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in your .env file");
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function ProfilePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);

useEffect(() => {
  async function fetchProfile() {
    try {
      const res = await fetch(`${API_BASE}/users/me`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: UserProfile = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  }
  fetchProfile();
}, []);


  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/user-songs`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = (await res.json()) as Song[];
        setSongs(data);
      } catch (err: any) {
        setError(err.message || "Failed to load songs");
      } finally {
        setLoading(false);
      }
    }
    fetchSongs();
  }, []);

  const totalPlays = songs.reduce((sum, s) => sum + s.plays, 0);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-8 mb-8">
            <Avatar className="w-32 h-32">
            <AvatarImage src={profile?.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback>{profile?.initials || "NA"}</AvatarFallback>
          </Avatar>

            <div className="flex-1">
              <Badge variant="secondary">{profile?.role || "User"}</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {profile?.name || "Unnamed"}
              </h1>

              {loading ? (
                <p className="text-muted-foreground mb-4">Loading songs...</p>
              ) : error ? (
                <p className="text-red-500 mb-4">{error}</p>
              ) : (
                <p className="text-muted-foreground mb-4">
                  {totalPlays.toLocaleString()} total plays • {songs.length} songs
                </p>
              )}
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
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-primary/20 to-chart-2/20 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Plays
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {totalPlays.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-chart-3/20 to-chart-4/20 border-chart-3/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Songs Released
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-3">{songs.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-chart-5/20 to-primary/20 border-chart-5/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Most Popular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-5">
                    {songs.length > 0
                      ? Math.max(...songs.map((s) => s.plays)).toLocaleString()
                      : "0"}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Your Songs */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Songs</h2>
            {loading && <p>Loading songs...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="space-y-2">
                {songs.map((song, index) => (
                  <Card
                    key={song.id}
                    className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-muted-foreground w-6 text-center">
                          {index + 1}
                        </div>
                        <img
                          src={song.cover || "/placeholder.svg"}
                          alt={song.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-card-foreground truncate">
                            {song.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {song.album}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-sm text-muted-foreground">
                          {song.plays.toLocaleString()} plays
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {song.duration}
                        </div>
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
            )}
          </section>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
