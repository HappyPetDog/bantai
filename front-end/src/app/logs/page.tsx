"use client";

import { useEffect, useState } from "react";
import { fetchLogs } from "@/lib/fetch-logs";

import { Record } from "@/types/record";
import { RecordCard } from "./components/RecordCard";

export default function Page() {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const getRecords = async () => {
      const { data, error } = await fetchLogs();
      if (error) {
        console.error(error);
      } else {
        setRecords(data || []);
      }
    };

    getRecords();
  }, []);

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Logs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {records.map((record) => (
          <RecordCard
            key={record.id}
            id={record.id}
            name={record.name}
            location={record.location}
            status={record.status}
            severity={record.severity}
            notes={record.notes}
            video_path={record.video_path}
            time={record.time}
          />
        ))}
      </div>
    </div>
  );
}
