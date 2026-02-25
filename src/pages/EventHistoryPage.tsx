import { useState } from "react";
import { recommendedEvents } from "@/data/mockData";
import type { Event, EventApplication } from "@/data/mockData";
import EventCard from "@/components/EventCard";
import EventDetailModal from "@/components/EventDetailModal";

const mockApplications: EventApplication[] = [
  { eventId: "1", status: "applied", appliedDate: "Feb 10, 2026" },
  { eventId: "2", status: "approved", appliedDate: "Feb 5, 2026" },
  { eventId: "3", status: "past", appliedDate: "Jan 20, 2026" },
];

const tabs = [
  { key: "applied", label: "Applied" },
  { key: "approved", label: "Approved" },
  { key: "past", label: "Past" },
] as const;

export default function EventHistoryPage() {
  const [activeTab, setActiveTab] = useState<"applied" | "approved" | "past">("applied");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filtered = mockApplications.filter((a) => a.status === activeTab);
  const events = filtered.map((a) => ({
    ...recommendedEvents.find((e) => e.id === a.eventId)!,
    status: a.status,
  }));

  return (
    <div className="px-4 py-5 space-y-5 animate-fade-in">
      <h2 className="font-heading text-xl font-bold text-foreground">Event History</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
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
              status={event.status}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No {activeTab} events yet</p>
          </div>
        )}
      </div>

      <EventDetailModal
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onApply={() => {}}
        applied
      />
    </div>
  );
}
