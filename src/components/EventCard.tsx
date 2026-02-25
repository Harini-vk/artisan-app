import { Calendar, MapPin, Tag } from "lucide-react";
import type { Event } from "@/data/mockData";

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onApply?: (event: Event) => void;
  status?: "applied" | "approved" | "past";
}

const statusStyles = {
  applied: "bg-warning/20 text-warning-foreground border-warning/30",
  approved: "bg-success/20 text-success border-success/30",
  past: "bg-muted text-muted-foreground border-border",
};

const statusLabels = {
  applied: "Applied",
  approved: "Approved",
  past: "Completed",
};

export default function EventCard({ event, onViewDetails, onApply, status }: EventCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card animate-fade-in">
      <div className="relative">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-40 object-cover"
        />
        <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
          {event.category}
        </span>
        {status && (
          <span className={`absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full border ${statusStyles[status]}`}>
            {statusLabels[status]}
          </span>
        )}
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
          {event.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {event.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location.split(",")[0]}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description}
        </p>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onViewDetails(event)}
            className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors"
          >
            View Details
          </button>
          {!status && onApply && (
            <button
              onClick={() => onApply(event)}
              className="flex-1 text-sm font-medium py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
