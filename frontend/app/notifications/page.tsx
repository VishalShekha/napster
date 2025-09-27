"use client"

import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, UserPlus, Music, Play } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "like",
      message: "Sarah liked your song 'Midnight Echoes'",
      time: "2 minutes ago",
      unread: true,
      icon: Heart,
      color: "text-red-500",
    },
    {
      id: 2,
      type: "comment",
      message: "Mike commented on 'Digital Dreams': 'Amazing track!'",
      time: "15 minutes ago",
      unread: true,
      icon: MessageCircle,
      color: "text-blue-500",
    },
    {
      id: 3,
      type: "follow",
      message: "Alex started following you",
      time: "1 hour ago",
      unread: true,
      icon: UserPlus,
      color: "text-green-500",
    },
    {
      id: 4,
      type: "playlist",
      message: "Your song 'Bass Revolution' was added to 'Top Hits 2024'",
      time: "3 hours ago",
      unread: false,
      icon: Music,
      color: "text-purple-500",
    },
    {
      id: 5,
      type: "milestone",
      message: "'Acoustic Sunrise' reached 2,000 plays!",
      time: "1 day ago",
      unread: false,
      icon: Play,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your music activity</p>
            </div>
            <Button variant="outline" className="rounded-full bg-transparent">
              Mark all as read
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = notification.icon
              return (
                <Card
                  key={notification.id}
                  className={`bg-card hover:bg-accent/50 transition-colors cursor-pointer ${
                    notification.unread ? "border-primary/50" : ""
                  }`}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`p-2 rounded-full bg-muted ${notification.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-card-foreground">{notification.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <Badge variant="default" className="bg-primary">
                        New
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <MusicPlayer />
    </div>
  )
}
