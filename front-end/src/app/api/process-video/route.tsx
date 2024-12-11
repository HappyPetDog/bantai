// app/api/process-video/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  const { videoPath } = await req.json();

  if (!videoPath) {
    return NextResponse.json(
      { error: "Video path is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("http://localhost:5001/process-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoPath }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
