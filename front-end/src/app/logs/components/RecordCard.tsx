import { Record } from "@/types/record";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High":
      return "text-red-500";
    case "Moderate":
      return "text-orange-500";
    case "Low":
      return "text-yellow-500";
    default:
      return "";
  }
};

export const RecordCard = ({
  id,
  name,
  location,
  status,
  severity,
  notes,
  video_path,
  time,
}: Record) => {
  const formattedTimestamp = new Date(time).toLocaleString();

  return (
    <Card key={id} className="w-full border rounded-lg mb-4 shadow-md">
      {video_path && (
        <div className="w-full">
          <video controls width="600">
            <source src={`${video_path}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        <div className="flex flex-col gap-0">
          <p className="text-sm text-muted-foreground">{location}</p>
          <p className="text-sm text-muted-foreground">{formattedTimestamp}</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-row gap-1">
          <p className="font-semibold">Status:</p>
          {status ? "Responded" : "Not Responded"}
        </div>
        <div className="flex flex-row gap-1">
          <p className="font-semibold">Severity:</p>
          <p className={getSeverityColor(severity)}>{severity}</p>
        </div>
        <p className="font-semibold">Notes:</p> {notes}
      </CardContent>
    </Card>
  );
};
