"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Music, ImageIcon } from "lucide-react"
import { useState } from "react"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    // Handle file drop logic here
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto pb-24">
        <div className="p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your Music</h1>
            <p className="text-muted-foreground">Share your creativity with the world</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Audio File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">Drop your audio file here</p>
                  <p className="text-muted-foreground mb-4">or click to browse (MP3, WAV, FLAC)</p>
                  <Button className="rounded-full">Choose File</Button>
                </div>
              </CardContent>
            </Card>

            {/* Cover Art Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Cover Art
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">Upload cover art</p>
                  <p className="text-muted-foreground mb-4">JPG, PNG (minimum 1400x1400px)</p>
                  <Button variant="outline" className="rounded-full bg-transparent">
                    Choose Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Song Details */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Song Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Song Title *</Label>
                  <Input id="title" placeholder="Enter song title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist Name *</Label>
                  <Input id="artist" placeholder="Enter artist name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="album">Album</Label>
                  <Input id="album" placeholder="Enter album name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" placeholder="Enter genre" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Tell us about your song..." className="min-h-[100px]" />
              </div>

              <div className="flex items-center justify-between pt-6">
                <Button variant="outline" className="rounded-full bg-transparent">
                  Save as Draft
                </Button>
                <Button className="bg-primary hover:bg-primary/90 rounded-full px-8">Upload Song</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MusicPlayer />
    </div>
  )
}
