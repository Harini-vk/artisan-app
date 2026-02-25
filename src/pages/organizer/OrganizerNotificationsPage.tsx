import { useState } from "react";
import { organizerNotifications, type OrganizerNotification } from "@/data/organizerData";
import { Bell, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OrganizerNotificationsPage() {
  const [notifications] = useState<OrganizerNotification[]>(organizerNotifications);
  const [broadcastMsg, setBroadcastMsg] = useState("");

  const sendBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    toast({ title: "Broadcast Sent", description: "Notification sent to all entrepreneurs." });
    setBroadcastMsg("");
  };

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold text-foreground">Notifications</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Updates & broadcast messages</p>
      </div>

      {/* Broadcast */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card space-y-3">
        <h3 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" /> Send Broadcast
        </h3>
        <textarea value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)}
          placeholder="Type an announcement for all entrepreneurs..." rows={3}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        <button onClick={sendBroadcast}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
          Send to All
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className={`bg-card rounded-xl p-4 border shadow-card ${notif.read ? "border-border" : "border-primary/30"}`}>
            <div className="flex items-start gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.read ? "bg-muted" : "bg-primary/15"}`}>
                <Bell className={`h-4 w-4 ${notif.read ? "text-muted-foreground" : "text-primary"}`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${notif.read ? "text-foreground" : "text-foreground"}`}>{notif.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
              </div>
              {!notif.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
