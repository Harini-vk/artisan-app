import { useState } from "react";
import { organizerEvents, type EventApplication } from "@/data/organizerData";
import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OrganizerApplicationsPage() {
  const allApps = organizerEvents.flatMap((e) =>
    e.applications.map((a) => ({ ...a, eventName: e.name, eventId: e.id }))
  );

  const [apps, setApps] = useState(allApps);

  const updateStatus = (entrepreneurId: string, eventId: string, status: EventApplication["status"]) => {
    setApps(apps.map((a) =>
      a.entrepreneurId === entrepreneurId && a.eventId === eventId ? { ...a, status } : a
    ));
    toast({ title: `Application ${status}`, description: `Status updated successfully.` });
  };

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold text-foreground">Applications</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{apps.length} total applications</p>
      </div>

      <div className="space-y-3">
        {apps.length > 0 ? apps.map((app, i) => (
          <div key={i} className="bg-card rounded-xl p-4 border border-border shadow-card space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{app.entrepreneurName}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" /> {app.eventName}
                </p>
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${
                app.status === "approved" ? "text-primary" : app.status === "rejected" ? "text-destructive" : "text-muted-foreground"
              }`}>
                {app.status === "approved" ? <CheckCircle className="h-3 w-3" /> : app.status === "rejected" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Applied: {app.appliedDate}</p>
            {app.status === "pending" && (
              <div className="flex gap-2 pt-1">
                <button onClick={() => updateStatus(app.entrepreneurId, app.eventId, "approved")}
                  className="flex-1 bg-primary text-primary-foreground py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                  Approve
                </button>
                <button onClick={() => updateStatus(app.entrepreneurId, app.eventId, "rejected")}
                  className="flex-1 bg-muted text-foreground py-1.5 rounded-lg text-xs font-semibold hover:bg-accent transition-colors">
                  Reject
                </button>
              </div>
            )}
          </div>
        )) : (
          <p className="text-center py-10 text-sm text-muted-foreground">No applications yet.</p>
        )}
      </div>
    </div>
  );
}
