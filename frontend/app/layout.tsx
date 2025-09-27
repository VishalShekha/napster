import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { MusicPlayer } from "@/components/music-player"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "MusicStream - Your Music, Your Way",
  description: "Stream millions of songs and discover new music",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex h-screen bg-background">
            
            <main className="flex-1 overflow-auto pb-24">{children}</main>
            <MusicPlayer />
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
