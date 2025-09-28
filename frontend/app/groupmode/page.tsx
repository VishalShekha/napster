"use client"
import { Input } from "@/components/ui/input" 
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Play, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

type Friend = {
  id: string
  name: string
  status: string
  avatar?: string
}

type Blend = {
  id: string
  name: string
  members: string[]
  cover?: string
}

type Session = {
  id: string
  name: string
  host: string
  participants: number
}

export default function GroupModePage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [personalBlends, setPersonalBlends] = useState<Blend[]>([])
  const [commonBlends, setCommonBlends] = useState<Blend[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])

  useEffect(() => {
    // ⏳ Replace with backend fetch later
    setFriends([
      { id: "1", name: "Alice", status: "Listening to Midnight Echoes", avatar: "/friend1.jpg" },
      { id: "2", name: "Bob", status: "Online • Browsing music", avatar: "/friend2.jpg" },
      { id: "3", name: "Charlie", status: "Offline", avatar: "/friend3.jpg" },
    ])

    setPersonalBlends([
      { id: "1", name: "Alice Mix", members: ["Alice"], cover: "/blend1.jpg" },
    ])

    setCommonBlends([
      { id: "2", name: "Workout Beats", members: ["You", "Bob"], cover: "/blend2.jpg" },
      { id: "3", name: "Chill Nights", members: ["You", "Alice", "Charlie"], cover: "/blend3.jpg" },
    ])

    setSessions([
      { id: "1", name: "Late Night Jam", host: "Alice", participants: 4 },
      { id: "2", name: "Coding Mix", host: "Bob", participants: 2 },
    ])
  }, [])

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    )
  }

  const handleCreateBlend = () => {
    if (selectedFriends.length === 0) {
      alert("Select at least one friend to create a blend")
      return
    }

    const newBlend: Blend = {
      id: String(Date.now()),
      name: `Blend with ${selectedFriends.length} friends`,
      members: selectedFriends,
      cover: "/placeholder.svg",
    }

    setCommonBlends((prev) => [...prev, newBlend])
    setSelectedFriends([])
    // ⏳ Later: POST /api/blends {members: selectedFriends}
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8 space-y-10">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Group Mode</h1>
            <Button className="rounded-full bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Start Jam Session
            </Button>
          </div>

          {/* Jamming Sessions */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Jamming Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="bg-card hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{session.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Hosted by {session.host} • {session.participants} listening
                      </p>
                    </div>
                    <Button size="sm" className="rounded-full">
                      <Play className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Personal Blends */}
{/* Friends Section */}
<section>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold text-foreground">Friends</h2>
    <Input
      placeholder="Search friends..."
      className="w-64 rounded-full"
      onChange={(e) => {
        const query = e.target.value.toLowerCase()
        setFriends((prev) =>
          prev.map((f) => ({ ...f, hidden: !f.name.toLowerCase().includes(query) }))
        )
      }}
    />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {friends
      .filter((friend) => !friend.hidden)
      .map((friend) => (
        <Card key={friend.id} className="bg-card hover:bg-accent/50 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback>{friend.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{friend.name}</p>
                <p className="text-sm text-muted-foreground">{friend.status}</p>
              </div>
            </div>

            {/* Sleek Icon Button for Blend */}
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-primary/20 transition-colors"
              onClick={() => {
                // handle personal blend creation later
                console.log("Create blend with", friend.name)
              }}
            >
              <PlusCircle className="h-5 w-5 text-primary" />
            </Button>
          </CardContent>
        </Card>
      ))}
  </div>
</section>
          {/* Common Blends */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Common Blends</h2>
              {/* Dialog for multi-friend blend creation */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-full bg-primary hover:bg-primary/90">
                    <Users className="h-4 w-4 mr-2" />
                    Create Blend
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Friends</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {friends.map((friend) => (
                      <div key={friend.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedFriends.includes(friend.id)}
                          onCheckedChange={() => toggleFriendSelection(friend.id)}
                        />
                        <span>{friend.name}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleCreateBlend} className="mt-4 w-full">
                    Create Blend
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {commonBlends.map((blend) => (
                <Card key={blend.id} className="bg-card hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <img
                      src={blend.cover || "/placeholder.svg"}
                      alt={blend.name}
                      className="w-full h-32 rounded-lg object-cover mb-3"
                    />
                    <h3 className="font-semibold text-foreground">{blend.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {blend.members.join(", ")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <MusicPlayer />
    </div>
  )
}
