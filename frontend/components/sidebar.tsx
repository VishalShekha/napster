"use client";

import {
  Home,
  Search,
  Library,
  Heart,
  Music,
  User,
  Upload,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CreatePlaylistDialog } from "@/components/create-playlist-dialog";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

interface Playlist {
  playlistId: string;
  name: string;
  description?: string;
  emailid: string;
  songs: any[];
  createdAt: string;
  updatedAt: string;
}

export function Sidebar() {
  const [groupMode, setGroupMode] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isGroupMode = pathname.startsWith("/groupmode");

  // Fetch playlists on component mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No token found, user not logged in");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/playlists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      setPlaylists(data.data || []);

    } catch (err: any) {
      console.error("Error fetching playlists:", err.message);
      // Don't show alert for auth errors on initial load
      if (err.message.includes("401") || err.message.includes("403")) {
        // Token expired or invalid - optionally redirect to login
        // router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh playlists (can be called after creating a new playlist)
  const handlePlaylistCreated = () => {
    fetchPlaylists();
  };

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">
              Napster
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent rounded-full w-9 h-9"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent rounded-full w-9 h-9"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-sidebar-foreground">Group Mode</span>
          <Switch
            checked={isGroupMode}
            onCheckedChange={(checked) => {
              if (checked) {
                router.push("/groupmode");
              } else {
                router.push("/home");
              }
            }}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-3">
        <div className="space-y-2">
          <Link href="/home">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/" || pathname === "/home" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Home className="h-5 w-5" />
              Home
            </Button>
          </Link>
          <Link href="/search">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/search" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Search className="h-5 w-5" />
              Search
            </Button>
          </Link>
          <Link href="/browse">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/browse" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Library className="h-5 w-5" />
              Browse
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="mx-4 bg-sidebar-border" />

      <div className="px-4 py-3">
        <div className="space-y-2">
          <Link href="/upload">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/upload" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Upload className="h-5 w-5" />
              Upload Song
            </Button>
          </Link>
          <Link href="/my-songs">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/my-songs" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Music className="h-5 w-5" />
              Your Songs
            </Button>
          </Link>
          <CreatePlaylistDialog onPlaylistCreated={handlePlaylistCreated} />
          <Link href="/liked-songs">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl h-11 ${
                pathname === "/liked-songs" ? "bg-sidebar-accent text-primary" : ""
              }`}
            >
              <Heart className="h-5 w-5" />
              Liked Songs
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="mx-4 bg-sidebar-border" />

      {/* Playlists */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 py-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">
            Your Playlists
          </h3>
          
          {loading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Loading playlists...
            </div>
          ) : playlists.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No playlists yet. Create one!
            </div>
          ) : (
            playlists.map((playlist) => (
              <Link key={playlist.playlistId} href={`/playlist/${playlist.playlistId}`}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm rounded-xl h-10 ${
                    pathname === `/playlist/${playlist.playlistId}`
                      ? "bg-sidebar-accent text-primary"
                      : ""
                  }`}
                >
                  {playlist.name}
                </Button>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}