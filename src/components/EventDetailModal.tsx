import { X, Calendar, MapPin, Users, Building, CalendarDays } from "lucide-react";
import type { Event } from "@/data/mockData";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface EventDetailModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onApply: (event: Event) => void;
  applied?: boolean;
}

export default function EventDetailModal({ event, open, onClose, onApply, applied }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md mx-auto p-0 bg-card rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{event.name}</DialogTitle>
        <div className="relative">
          {event.image ? (
            <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
              <CalendarDays className="h-14 w-14 text-primary/40" />
            </div>
          )}
          <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            {event.category}
          </span>
        </div>
        <div className="p-5 space-y-4">
          <h2 className="font-heading text-xl font-bold text-foreground">{event.name}</h2>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <span>{event.organizer}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{event.eligibility}</span>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold text-foreground mb-2">About This Event</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{event.longDescription}</p>
          </div>

          <button
            onClick={() => onApply(event)}
            disabled={applied}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${applied
                ? "bg-success/20 text-success cursor-default"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
          >
            {applied ? "✓ Application Submitted" : "Apply for This Event"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
