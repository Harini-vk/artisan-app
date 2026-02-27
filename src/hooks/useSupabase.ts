import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Event, Product } from "@/data/mockData";

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            const { data, error } = await supabase.from('events').select('*');
            if (data) {
                // Map db fields to Event interface
                const mapped: Event[] = data.map(dbEvent => ({
                    id: dbEvent.id,
                    name: dbEvent.name,
                    category: dbEvent.event_type,
                    date: dbEvent.event_date,
                    description: dbEvent.description,
                    longDescription: dbEvent.description,
                    image: '', // Needs a real image URL
                    location: dbEvent.location,
                    organizer: dbEvent.organizer_id, // we might need to join users table
                    eligibility: dbEvent.industry_focus
                }));
                setEvents(mapped);
            }
            setLoading(false);
        }
        fetchEvents();
    }, []);

    return { events, loading };
}

export function useEventActions() {
    const { user } = useAuth();

    const registerForEvent = async (eventId: string) => {
        if (!user) return { success: false, error: 'Not logged in' };

        // Check if already registered
        const { data: existing } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existing) {
            return { success: true, error: undefined }; // Already registered, treat as success
        }

        const { error } = await supabase
            .from('event_registrations')
            .insert({ event_id: eventId, user_id: user.id });

        if (error) {
            // Handle duplicate key gracefully
            if (error.code === '23505') {
                return { success: true, error: undefined };
            }
            return { success: false, error: error.message };
        }
        return { success: true, error: undefined };
    };

    const saveEvent = async (eventId: string) => {
        if (!user) return { success: false, error: 'Not logged in' };
        const { error } = await supabase
            .from('saved_events')
            .insert({ event_id: eventId, user_id: user.id });

        return { success: !error, error: error?.message };
    };

    return { registerForEvent, saveEvent };
}
