
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function DashboardPage() {
  interface UserProfile {
    name: string;
    avatarUrl: string | null;
    initials: string;
  }

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("PROFILE: No token found in localStorage");
          setLoadingProfile(false);
          return;
        }

        const res = await fetch(`${API_BASE}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("PROFILE: backend returned error", res.status);
          setLoadingProfile(false);
          return;
        }

        const payload = await res.json();

        if (payload?.data) {
          const d = payload.data;

          setProfile({
            name: d.name || "User",
            avatarUrl: d.avatarUrl ?? d.avatar ?? null,
            initials: d.name
              ? d.name.split(" ").map((x: string) => x[0]).join("")
              : "U",
          });
        }
      } catch (err) {
        console.error("PROFILE: fetch error", err);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">

        {loadingProfile && (
          <div className="mb-4 text-sm text-muted-foreground">Loading profile…</div>
        )}

        {!loadingProfile && !profile && (
          <div className="mb-4 text-sm text-red-600">
            Failed to load profile. Check backend.
          </div>
        )}

        {profile && (
          <div className="mb-10 flex items-center gap-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold">
                {profile.initials}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              {/* ✅ role removed completely */}
            </div>
          </div>
        )}

        {/* Subscriptions */}
        <h2 className="text-2xl font-bold mb-6">Subscriptions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-primary/20 hover:shadow-xl">
            <CardHeader>
              <CardTitle>Group Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Collaborate with others and create shared playlists.
              </p>
              <Button className="w-full rounded-full">Subscribe</Button>
            </CardContent>
          </Card>

          <Card className="border-chart-3/40 bg-gradient-to-br from-chart-3/10 to-chart-4/20 hover:shadow-xl">
            <CardHeader>
              <CardTitle>Upload Music</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Unlock unlimited music uploads.
              </p>
              <Button className="w-full rounded-full bg-chart-3 text-white">
                Subscribe
              </Button>
            </CardContent>
          </Card>

          <Card className="border-chart-5/40 bg-gradient-to-br from-chart-5/10 to-primary/20 hover:shadow-xl">
            <CardHeader>
              <CardTitle>Recommended Playlist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get AI-curated playlists based on the music you listen to.
              </p>
              <Button className="w-full rounded-full bg-chart-5 text-white">
                View Playlist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
