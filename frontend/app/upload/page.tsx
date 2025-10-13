"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Music, ImageIcon } from "lucide-react"

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in your .env file");
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverArt, setCoverArt] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [album, setAlbum] = useState("")
  const [genre, setGenre] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0])
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverArt(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAudioFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!audioFile || !title || !artist) {
      alert("Please provide at least audio file, title, and artist.")
      return
    }

    setStatus("uploading")

    try {
      const formData = new FormData()
      formData.append("audio", audioFile)
      if (coverArt) formData.append("coverArt", coverArt)
      formData.append("title", title)
      formData.append("artist", artist)
      formData.append("album", album)
      formData.append("genre", genre)
      formData.append("description", description)



      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      setStatus("success")
      alert("Song uploaded successfully!")
    } catch (err) {
      console.error(err)
      setStatus("error")
      alert("Something went wrong while uploading.")
    }
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
            {/* Audio Upload */}
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
                  <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" id="audio-upload" />
                  <label htmlFor="audio-upload">
                    <Button className="rounded-full">Choose File</Button>
                  </label>
                  {audioFile && <p className="mt-2 text-sm text-green-600">{audioFile.name}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Cover Art */}
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
                  <p className="text-muted-foreground mb-4">JPG, PNG (min 1400x1400px)</p>
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" id="cover-upload" />
                  <label htmlFor="cover-upload">
                    <Button variant="outline" className="rounded-full bg-transparent">
                      Choose Image
                    </Button>
                  </label>
                  {coverArt && <p className="mt-2 text-sm text-green-600">{coverArt.name}</p>}
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
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter song title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist Name *</Label>
                  <Input id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Enter artist name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="album">Album</Label>
                  <Input id="album" value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="Enter album name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Enter genre" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about your song..." className="min-h-[100px]" />
              </div>

              <div className="flex items-center justify-between pt-6">
                <Button variant="outline" className="rounded-full bg-transparent">
                  Save as Draft
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 rounded-full px-8"
                  onClick={handleSubmit}
                  disabled={status === "uploading"}
                >
                  {status === "uploading" ? "Uploading..." : "Upload Song"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MusicPlayer />
    </div>
  )
}
