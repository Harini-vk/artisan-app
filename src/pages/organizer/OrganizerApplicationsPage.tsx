import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Clock, XCircle, FileText, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Application {
  id: string;
  eventId: string;
  eventName: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

export default function OrganizerApplicationsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchApplications();
  }, [user?.id]);

  const fetchApplications = async () => {
    if (!user) return;
    setLoading(true);

    // Get all events owned by this organizer, then get their registrations
    const { data: myEvents } = await supabase
      .from("events")
      .select("id, name")
      .eq("organizer_id", user.id);

    if (!myEvents || myEvents.length === 0) {
      setApps([]);
      setLoading(false);
      return;
    }

    const eventIds = myEvents.map((e) => e.id);
    const eventNameMap: Record<string, string> = {};
    myEvents.forEach((e) => { eventNameMap[e.id] = e.name; });

    // Fetch all registrations for these events + join user info
    const { data: registrations } = await supabase
      .from("event_registrations")
      .select("id, event_id, user_id, status, created_at, users(name, email)")
      .in("event_id", eventIds)
      .order("created_at", { ascending: false });

    if (registrations) {
      const mapped: Application[] = registrations.map((r: any) => ({
        id: r.id,
        eventId: r.event_id,
        eventName: eventNameMap[r.event_id] || "Unknown Event",
        userId: r.user_id,
        userName: r.users?.name || "Unknown",
        userEmail: r.users?.email || "",
        status: r.status || "pending",
        appliedDate: new Date(r.created_at).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric"
        }),
      }));
      setApps(mapped);
    }
    setLoading(false);
  };

  const updateStatus = async (registrationId: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("event_registrations")
      .update({ status })
      .eq("id", registrationId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setApps(apps.map((a) => a.id === registrationId ? { ...a, status } : a));
    toast({ title: `Application ${status}`, description: "Status updated successfully." });
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading applications...</div>;
  }

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold text-foreground">Applications</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{apps.length} total applications</p>
      </div>

      <div className="space-y-3">
        {apps.length > 0 ? apps.map((app) => (
          <div key={app.id} className="bg-card rounded-xl p-4 border border-border shadow-card space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{app.userName}</h3>
                <p className="text-xs text-muted-foreground">{app.userEmail}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <FileText className="h-3 w-3" /> {app.eventName}
                </p>
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${app.status === "approved" ? "text-primary" : app.status === "rejected" ? "text-destructive" : "text-muted-foreground"
                }`}>
                {app.status === "approved" ? <CheckCircle className="h-3 w-3" /> : app.status === "rejected" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Applied: {app.appliedDate}</p>
            {app.status === "pending" && (
              <div className="flex gap-2 pt-1">
                <button onClick={() => updateStatus(app.id, "approved")}
                  className="flex-1 bg-primary text-primary-foreground py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                  Approve
                </button>
                <button onClick={() => updateStatus(app.id, "rejected")}
                  className="flex-1 bg-muted text-foreground py-1.5 rounded-lg text-xs font-semibold hover:bg-accent transition-colors">
                  Reject
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No applications yet. Applications will appear here when entrepreneurs apply for your events.</p>
          </div>
        )}
      </div>
    </div>
  );
}
