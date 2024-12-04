import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

const RecentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = [
        {
          id: 1,
          message: "Accident detected at 5th Avenue",
          timestamp: "2023-10-01 10:00:00",
        },
        {
          id: 2,
          message: "Accident detected at Main Street",
          timestamp: "2023-10-01 09:30:00",
        },
        {
          id: 3,
          message: "Accident detected at Elm Street",
          timestamp: "2023-10-01 09:00:00",
        },
      ];
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.timestamp}</TableCell>
                <TableCell>{notification.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentNotifications;
