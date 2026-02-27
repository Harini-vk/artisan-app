import { useState, useEffect } from "react";
import { eventCategories, type OrganizerEvent } from "@/data/organizerData";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Users, FileText, Calendar, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");

  useEffect(() => {
    if (user?.id) fetchEvents();
  }, [user?.id]);

  const fetchEvents = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const mapped: OrganizerEvent[] = data.map((e) => ({
        id: e.id,
        name: e.name,
        category: e.event_type,
        date: e.event_date,
        description: e.description,
        location: e.location,
        active: true, // we don't have active in DB yet, pretend true
        invitedEntrepreneurs: [], // missing real join
        applications: []
      }));
      setEvents(mapped);
    }
  };

  const resetForm = () => {
    setFormName(""); setFormCategory(""); setFormDate(""); setFormDescription(""); setFormLocation("");
    setShowCreate(false); setEditingId(null);
  };

  const handleCreate = async () => {
    if (!formName || !formCategory || !formDate || !user) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("events").insert({
      organizer_id: user.id,
      name: formName,
      event_type: formCategory,
      event_date: formDate,
      event_time: "10:00:00", // default time
      description: formDescription,
      location: formLocation,
      industry_focus: formCategory
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event Created", description: `${formName} has been created.` });
      fetchEvents();
      resetForm();
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("events").update({
      name: formName,
      event_type: formCategory,
      event_date: formDate,
      description: formDescription,
      location: formLocation,
    }).eq("id", editingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event Updated", description: "Event details have been saved." });
      fetchEvents();
      resetForm();
    }
  };

  const startEdit = (event: OrganizerEvent) => {
    setEditingId(event.id);
    setFormName(event.name); setFormCategory(event.category); setFormDate(event.date);
    setFormDescription(event.description); setFormLocation(event.location);
    setShowCreate(true);
  };

  const toggleActive = (id: string) => {
    setEvents(events.map((e) => e.id === id ? { ...e, active: !e.active } : e));
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
      setEvents(events.filter((e) => e.id !== id));
      toast({ title: "Event Deleted" });
    }
  };

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Events</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{events.length} total events</p>
        </div>
        <button onClick={() => { resetForm(); setShowCreate(true); }}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> New Event
        </button>
      </div>

      {/* Create / Edit Form */}
      {showCreate && (
        <div className="bg-card rounded-xl p-4 border border-border shadow-card space-y-3">
          <h3 className="font-heading font-semibold text-foreground text-sm">{editingId ? "Edit Event" : "Create Event"}</h3>
          <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Event name *"
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Select category *</option>
            {eventCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="e.g. Chennai, India"
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Description" rows={3}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <div className="flex gap-2">
            <button onClick={editingId ? handleUpdate : handleCreate}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
              {editingId ? "Save Changes" : "Create Event"}
            </button>
            <button onClick={resetForm} className="px-4 py-2 rounded-lg text-xs font-medium text-muted-foreground bg-muted hover:bg-accent transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Event List */}
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className={`bg-card rounded-xl p-4 border shadow-card space-y-3 ${event.active ? "border-border" : "border-border opacity-60"}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-semibold text-foreground text-sm">{event.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${event.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {event.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{event.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.date}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" /> {event.invitedEntrepreneurs.length} invited
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <FileText className="h-3 w-3" /> {event.applications.length} applications
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-border">
              <button onClick={() => startEdit(event)} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                <Edit2 className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => toggleActive(event.id)} className="flex items-center gap-1 text-xs text-muted-foreground font-medium hover:text-foreground">
                {event.active ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                {event.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => deleteEvent(event.id)} className="flex items-center gap-1 text-xs text-destructive font-medium hover:underline ml-auto">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
