import { useState, useEffect, useMemo } from "react";
import type { Event } from "@/data/mockData";
import EventCard from "@/components/EventCard";
import EventDetailModal from "@/components/EventDetailModal";
import heroBanner from "@/assets/hero-banner.jpg";
import { toast } from "@/hooks/use-toast";
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { useEvents, useEventActions } from "@/hooks/useSupabase";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const { events, loading: eventsLoading } = useEvents();
  const { recommendedEvents, loading: recsLoading, error: recsError, modelUsed } = useRecommendations();
  const { registerForEvent } = useEventActions();
  const { user } = useAuth();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch already-registered event IDs on page load
  useEffect(() => {
    async function fetchRegistered() {
      if (!user) return;
      const { data } = await supabase
        .from("event_registrations")
        .select("event_id")
        .eq("user_id", user.id);
      if (data) {
        setAppliedIds(new Set(data.map((r: any) => r.event_id)));
      }
    }
    fetchRegistered();
  }, [user]);

  // Use recommended events if available, otherwise fall back to all events
  const displayEvents = useMemo(() => {
    if (recommendedEvents.length > 0) {
      return recommendedEvents;
    }
    return events;
  }, [recommendedEvents, events]);

  const isUsingRecommendations = recommendedEvents.length > 0;

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(displayEvents.map((e) => e.category)))];
  }, [displayEvents]);

  const handleApply = async (event: Event) => {
    const res = await registerForEvent(event.id);
    if (res.success) {
      setAppliedIds((prev) => new Set(prev).add(event.id));
      toast({
        title: "Application Submitted!",
        description: `You've applied for ${event.name}. We'll notify you of updates.`,
      });
    } else {
      toast({ title: "Error", description: res.error || "Failed to apply", variant: "destructive" });
    }
  };

  const filtered = displayEvents.filter((event) => {
    const matchesSearch =
      !search ||
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      event.date.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const hasActiveFilters = search || activeCategory !== "All";
  const loading = eventsLoading || recsLoading;

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Hero */}
      <div className="relative h-44 overflow-hidden">
        <img src={heroBanner} alt="Artisan marketplace" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="font-heading text-xl font-bold text-primary-foreground">
            Welcome, Artisan!
          </h2>
          <p className="text-sm text-primary-foreground/80 mt-1">
            Discover events tailored for your craft
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, dates, keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-lg border transition-colors ${showFilters ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Category pills */}
        {showFilters && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-xs font-medium px-3 py-2 rounded-full transition-colors ${activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-primary font-medium">
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Recommended Events */}
      <div className="px-4 space-y-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            {hasActiveFilters ? (
              `Results (${filtered.length})`
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-amber-500" />
                Recommended Events For You
              </>
            )}
          </h2>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-1">
              Based on your interests and business profile
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
            <p className="text-sm">Finding the best events for you...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.length > 0 ? (
              filtered.map((event) => (
                <div key={event.id} className="relative">
                  {/* Match score badge */}
                  {isUsingRecommendations && (event as any).match_score != null && !hasActiveFilters && (
                    <div className="absolute top-3 right-3 z-10 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {Math.round((event as any).match_score * 100)}% match
                    </div>
                  )}
                  <EventCard
                    event={event}
                    onViewDetails={setSelectedEvent}
                    onApply={handleApply}
                    applied={appliedIds.has(event.id)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No events match your search</p>
              </div>
            )}
          </div>
        )}
      </div>

      <EventDetailModal
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onApply={handleApply}
        applied={selectedEvent ? appliedIds.has(selectedEvent.id) : false}
      />
    </div>
  );
}
