import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const file = path.join(process.cwd(), "data", "moodPlaylists.json");
    const json = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(json);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to read moodPlaylists.json:", err);
    return NextResponse.json([], { status: 500 }); // always return valid JSON
  }
}


