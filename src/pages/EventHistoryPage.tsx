import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/data/mockData";
import EventCard from "@/components/EventCard";
import EventDetailModal from "@/components/EventDetailModal";
import { Clock } from "lucide-react";

const tabs = [
  { key: "registered", label: "Registered" },
  { key: "past", label: "Past Events" },
] as const;

export default function EventHistoryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"registered" | "past">("registered");
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      setLoading(true);

      // Fetch registered events
      const { data: regData } = await supabase
        .from("event_registrations")
        .select("event_id, events(*)")
        .eq("user_id", user.id);

      if (regData) {
        const mapped: Event[] = regData
          .filter((r: any) => r.events)
          .map((r: any) => ({
            id: r.events.id,
            name: r.events.name,
            category: r.events.event_type,
            date: r.events.event_date,
            description: r.events.description,
            longDescription: r.events.description,
            image: "",
            location: r.events.location,
            organizer: r.events.organizer_id,
            eligibility: r.events.industry_focus,
          }));
        setRegisteredEvents(mapped);
      }

      // Fetch past events (events with dates before today)
      const today = new Date().toISOString().split('T')[0];
      const { data: pastData } = await supabase
        .from("event_registrations")
        .select("event_id, events(*)")
        .eq("user_id", user.id)
        .lt("events.event_date", today);

      if (pastData) {
        const mapped: Event[] = pastData
          .filter((s: any) => s.events)
          .map((s: any) => ({
            id: s.events.id,
            name: s.events.name,
            category: s.events.event_type,
            date: s.events.event_date,
            description: s.events.description,
            longDescription: s.events.description,
            image: "",
            location: s.events.location,
            organizer: s.events.organizer_id,
            eligibility: s.events.industry_focus,
          }));
        setPastEvents(mapped);
      }

      setLoading(false);
    }
    fetchHistory();
  }, [user]);

  const events = activeTab === "registered" ? registeredEvents : pastEvents;

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading event history...</div>;
  }

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <h2 className="font-heading text-xl font-bold text-foreground">Event History</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-accent"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={setSelectedEvent}
              status={activeTab === "registered" ? "applied" : "past"}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No {activeTab} events yet</p>
          </div>
        )}
      </div>

      <EventDetailModal
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onApply={() => { }}
        applied
      />
    </div>
  );
}
