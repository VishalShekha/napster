"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MusicPlayer } from "@/components/music-player";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, UserPlus, Music, Play } from "lucide-react";

interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "playlist" | "milestone";
  message: string;
  time: string;
  unread: boolean;
}

const iconMap: Record<Notification["type"], any> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  playlist: Music,
  milestone: Play,
};

const colorMap: Record<Notification["type"], string> = {
  like: "text-red-500",
  comment: "text-blue-500",
  follow: "text-green-500",
  playlist: "text-purple-500",
  milestone: "text-orange-500",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications`
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = (await res.json()) as Notification[];
        setNotifications(data);
      } catch (err: any) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Notifications
              </h1>
              <p className="text-muted-foreground">
                Stay updated with your music activity
              </p>
            </div>
            <Button variant="outline" className="rounded-full bg-transparent">
              Mark all as read
            </Button>
          </div>

          {/* States */}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Notifications List */}
          <div className="space-y-3">
            {!loading &&
              !error &&
              notifications.map((notification) => {
                const IconComponent = iconMap[notification.type];
                const color = colorMap[notification.type];
                return (
                  <Card
                    key={notification.id}
                    className={`bg-card hover:bg-accent/50 transition-colors cursor-pointer ${
                      notification.unread ? "border-primary/50" : ""
                    }`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={`p-2 rounded-full bg-muted ${color}`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-card-foreground">
                          {notification.message}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <Badge variant="default" className="bg-primary">
                          New
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
