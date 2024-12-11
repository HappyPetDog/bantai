"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import supabase from "@/lib/supabase";

export default function Home() {
  const [videos] = useState(["testvid.mp4", "testvid-noacc.mp4"]); // List videos manually or fetch dynamically
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [output, setOutput] = useState<{
    message: string;
    output_video_path: string;
    severity: string;
  } | null>(null);

  const handleProcess = async () => {
    if (!selectedVideo) return alert("Please select a video!");

    try {
      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoPath: `public/videos/${selectedVideo}` }),
      });

      const result = await response.json();
      const cleanedResult = {
        ...result,
        output_video_path: result.output_video_path.replace(
          "front-end/public/",
          ""
        ),
      };
      setOutput(cleanedResult);

      // Push data to Supabase
      await supabase.from("logs").insert([
        {
          location,
          name,
          notes,
          severity: cleanedResult.severity,
          video_path: cleanedResult.output_video_path,
          time: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error processing video:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">YOLO Video Processor</h1>

      <h2 className="text-xl mb-4">Select a Video:</h2>
      <ul className="mb-4">
        {videos.map((video) => (
          <li key={video} className="mb-2">
            <Button onClick={() => setSelectedVideo(video)}>{video}</Button>
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <Label htmlFor="location">Location:</Label>
        <Input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="name">Name:</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="notes">Notes:</Label>
        <Input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button onClick={handleProcess} disabled={!selectedVideo}>
        Process Video
      </Button>

      {output && (
        <div className="mt-6">
          <h2 className="text-xl mb-2">Output:</h2>
          <p>{output.message}</p>
          <p>Severity: {output.severity}</p>
          <video controls width="600">
            <source src={`${output.output_video_path}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
