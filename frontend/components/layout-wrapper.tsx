"use client"

import { usePathname } from "next/navigation"
import { MusicPlayer } from "@/components/music-player"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "" // ✅ ensure string, not null
  const hidePlayer =
    pathname.startsWith("/register") || pathname.startsWith("/login")

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto pb-24">{children}</main>
      {!hidePlayer && <MusicPlayer />}
    </div>
  )
}
