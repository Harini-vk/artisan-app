import { useState } from "react";
import { organizerEvents } from "@/data/organizerData";
import { entrepreneurs } from "@/data/investorData";
import { Send, CheckCircle, Clock, XCircle, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OrganizerInvitationsPage() {
  const [selectedEventId, setSelectedEventId] = useState(organizerEvents[0]?.id || "");
  const selectedEvent = organizerEvents.find((e) => e.id === selectedEventId);

  const handleInvite = (name: string) => {
    toast({ title: "Invitation Sent", description: `Invitation sent to ${name} for ${selectedEvent?.name}.` });
  };

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold text-foreground">Invitations</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Send & track invitations to entrepreneurs</p>
      </div>

      {/* Event Selector */}
      <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
        {organizerEvents.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
      </select>

      {selectedEvent && (
        <>
          {/* Invited List */}
          <div className="bg-card rounded-xl p-4 border border-border shadow-card space-y-3">
            <h3 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Invited ({selectedEvent.invitedEntrepreneurs.length})
            </h3>
            {selectedEvent.invitedEntrepreneurs.length > 0 ? (
              selectedEvent.invitedEntrepreneurs.map((name, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{name}</span>
                  <span className="text-xs text-primary flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Sent</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No invitations sent yet.</p>
            )}
          </div>

          {/* Send New Invitations */}
          <div className="bg-card rounded-xl p-4 border border-border shadow-card space-y-3">
            <h3 className="font-heading font-semibold text-foreground text-sm">Send Invitations</h3>
            {entrepreneurs
              .filter((e) => !selectedEvent.invitedEntrepreneurs.includes(e.name))
              .map((entrepreneur) => (
                <div key={entrepreneur.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{entrepreneur.name}</p>
                    <p className="text-xs text-muted-foreground">{entrepreneur.businessCategory}</p>
                  </div>
                  <button onClick={() => handleInvite(entrepreneur.name)}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Send className="h-3 w-3" /> Invite
                  </button>
                </div>
              ))}
          </div>

          {/* Application Responses */}
          {selectedEvent.applications.length > 0 && (
            <div className="bg-card rounded-xl p-4 border border-border shadow-card space-y-3">
              <h3 className="font-heading font-semibold text-foreground text-sm">Responses</h3>
              {selectedEvent.applications.map((app) => (
                <div key={app.entrepreneurId} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.entrepreneurName}</p>
                    <p className="text-xs text-muted-foreground">Applied: {app.appliedDate}</p>
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-1 ${
                    app.status === "approved" ? "text-primary" : app.status === "rejected" ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {app.status === "approved" ? <CheckCircle className="h-3 w-3" /> : app.status === "rejected" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
