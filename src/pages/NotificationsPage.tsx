import { useEffect, useState } from "react";
import { Bell, Calendar, BadgeCheck, Landmark, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const typeIcons: Record<string, React.ReactNode> = {
  event: <Calendar className="h-5 w-5" />,
  status: <BadgeCheck className="h-5 w-5" />,
  scheme: <Landmark className="h-5 w-5" />,
};

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/notifications/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Could not load notifications at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <h2 className="font-heading text-xl font-bold text-foreground">Notifications</h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm border border-destructive/20">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          No new notifications.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-card rounded-xl p-4 shadow-card flex gap-3 ${
                !n.read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <span className={`p-2 rounded-lg h-fit ${!n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {typeIcons[n.type] || <Bell className="h-5 w-5" />}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                  {n.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                <span className="text-xs text-muted-foreground/60 mt-2 block">{n.time}</span>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

