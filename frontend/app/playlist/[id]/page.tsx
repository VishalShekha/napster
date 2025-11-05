"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, Pause, MoreHorizontal, Clock, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

interface Song {
  id: string;
  title: string;
  album: string;
  duration: string;
  coverUrl?: string;
  audioUrl?: string;
}

interface Playlist {
  playlistId: string;
  emailid: string;
  name: string;
  description: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

interface UserSong {
  id: string;
  title: string;
  album: string;
  plays: number;
  duration: string;
  status: string;
  uploadDate: string;
  cover?: string;
  audioUrl?: string;
}

export default function PlaylistPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Songs Dialog States
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [userSongs, setUserSongs] = useState<UserSong[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_BASE}/playlists/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched playlist:", data);
      setPlaylist(data.data || data);
    } catch (err: any) {
      setError(err.message || "Failed to load playlist");
      if (err.message.includes("401") || err.message.includes("403")) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSongs = async () => {
    try {
      setLoadingSongs(true);

      const email =
        typeof window !== "undefined"
          ? localStorage.getItem("email") || ""
          : "";
      if (!email) {
        alert("User email not found");
        return;
      }

      const res = await fetch(`${API_BASE}/user-songs?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched user songs:", data); 
      setUserSongs(data);
    } catch (err: any) {
      alert(err.message || "Failed to load your songs");
    } finally {
      setLoadingSongs(false);
    }
  };

  const handleOpenAddDialog = () => {
    setShowAddDialog(true);
    setSelectedSongs(new Set());
    fetchUserSongs();
  };

  const toggleSongSelection = (songId: string) => {
    const newSelection = new Set(selectedSongs);
    if (newSelection.has(songId)) {
      newSelection.delete(songId);
    } else {
      newSelection.add(songId);
    }
    setSelectedSongs(newSelection);
  };

  const handleAddSongs = async () => {
    if (selectedSongs.size === 0) {
      alert("Please select at least one song");
      return;
    }

    try {
      setAddingLoading(true);

      const token = localStorage.getItem("token");
      const songIds = Array.from(selectedSongs);

      const res = await fetch(`${API_BASE}/playlists/${id}/songs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ songIds }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      alert(data.message || "Songs added successfully");
      setShowAddDialog(false);
      setSelectedSongs(new Set());
      fetchPlaylist();
    } catch (err: any) {
      alert(err.message || "Failed to add songs");
    } finally {
      setAddingLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm("Are you sure you want to delete this playlist?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/playlists/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      alert("Playlist deleted successfully");
      router.push("/home");
    } catch (err: any) {
      alert(err.message || "Failed to delete playlist");
    }
  };

  const calculateTotalDuration = () => {
    if (!playlist || playlist.songs.length === 0) return "0 min";

    let totalSeconds = 0;
    playlist.songs.forEach((song) => {
      const [minutes, seconds] = song.duration?.split(":").map(Number) || [
        0, 0,
      ];
      totalSeconds += minutes * 60 + seconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-muted-foreground">Loading playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchPlaylist}>Try Again</Button>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="text-muted-foreground mb-4">Playlist not found</p>
        <Button onClick={() => router.push("/home")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-purple-700 via-purple-900 to-black text-white min-h-screen">
      {/* Playlist Header */}
      <div className="flex items-end gap-6 mb-8">
        <div className="w-60 h-60 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl">
          <span className="text-8xl font-bold">🎵</span>
        </div>
        <div className="flex-1">
          <Badge variant="secondary" className="mb-2">
            Playlist
          </Badge>
          <h1 className="text-5xl font-bold mb-4">{playlist.name}</h1>
          <p className="text-gray-300 mb-4">
            {playlist.description || "No description"}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="font-medium text-white">{playlist.emailid}</span>
            <span>•</span>
            <span>
              {playlist.songs.length}{" "}
              {playlist.songs.length === 1 ? "song" : "songs"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14"
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={playlist.songs.length === 0}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="text-gray-300 hover:text-white"
          onClick={handleOpenAddDialog}
        >
          <Plus className="h-6 w-6 mr-2" />
          Add Songs
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="text-red-400 hover:text-red-300"
          onClick={handleDeletePlaylist}
        >
          <Trash2 className="h-6 w-6" />
        </Button>
      </div>

      {/* Songs List */}
      {playlist.songs.length === 0 ? (
        <div className="text-center py-20 bg-black/40 rounded-lg">
          <p className="text-gray-400 text-lg mb-2">
            No songs in this playlist yet
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Add songs to get started!
          </p>
          <Button onClick={handleOpenAddDialog} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Songs
          </Button>
        </div>
      ) : (
        <div className="space-y-2 bg-black/40 rounded-lg p-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-4">Album</div>
            <div className="col-span-1 flex justify-end">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          {/* Song Rows */}
          {Array.isArray(playlist.songs) && playlist.songs.length > 0 ? (
            playlist.songs.map((song, index) => {
              // handle both object and string cases safely
              const title = typeof song === "object" ? song.title : song;
              const album =
                typeof song === "object" ? song.album : "Unknown Album";
              const duration =
                typeof song === "object" ? song.duration : "0:00";

              return (
                <div
                  key={song.id || index}
                  className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-purple-800/40 group cursor-pointer"
                >
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400 group-hover:hidden">
                      {index + 1}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hidden group-hover:flex w-8 h-8 p-0"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                      🎵
                    </div>
                    <div>
                      <p className="font-medium text-white">{title}</p>
                    </div>
                  </div>

                  <div className="col-span-4 flex items-center">
                    <p className="text-sm text-gray-400">{album}</p>
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <span className="text-sm text-gray-400">{duration}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-black/40 rounded-lg">
              <p className="text-gray-400 text-lg mb-2">
                No songs found in this playlist
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Add some songs to get started!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Songs Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Songs to Playlist</DialogTitle>
            <DialogDescription>
              Select songs from your library to add to this playlist.
            </DialogDescription>
          </DialogHeader>

          {loadingSongs ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading your songs...
            </div>
          ) : userSongs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-2">No songs found</p>
              <p className="text-sm text-muted-foreground">
                Upload some songs first!
              </p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {userSongs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => toggleSongSelection(song.id)}
                    >
                      <Checkbox
                        checked={selectedSongs.has(song.id)}
                        onCheckedChange={() => toggleSongSelection(song.id)}
                      />
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                        🎵
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {song.album}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {song.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {selectedSongs.size} song{selectedSongs.size !== 1 ? "s" : ""}{" "}
                  selected
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSongs}
                    disabled={selectedSongs.size === 0 || addingLoading}
                  >
                    {addingLoading ? "Adding..." : "Add Songs"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
