import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Event } from "@/data/mockData";
import { BACKEND_API_URL } from "@/lib/api";

interface RecommendedEvent extends Event {
    match_score?: number;
    match_percentage?: number;
}

interface RecommendationResult {
    recommendedEvents: RecommendedEvent[];
    loading: boolean;
    error: string | null;
    modelUsed: string | null;
}

export function useRecommendations(): RecommendationResult {
    const { user } = useAuth();
    const [recommendedEvents, setRecommendedEvents] = useState<RecommendedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modelUsed, setModelUsed] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRecommendations() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${BACKEND_API_URL}/recommend`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: user.id }),
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.detail || `API error: ${response.status}`);
                }

                const data = await response.json();
                setModelUsed(data.model_used || null);

                // Map API response to Event interface
                const mapped: RecommendedEvent[] = (data.recommendations || []).map(
                    (rec: any) => ({
                        id: rec.id,
                        name: rec.name,
                        category: rec.event_type || "",
                        date: rec.event_date || "",
                        description: rec.description || "",
                        longDescription: rec.description || "",
                        image: "",
                        location: rec.location || "",
                        organizer: rec.organizer_id || "",
                        eligibility: rec.industry_focus || "",
                        match_score: rec.match_score,
                        match_percentage: rec.match_percentage,
                    })
                );

                setRecommendedEvents(mapped);
                setError(null);
            } catch (err: any) {
                console.warn("Recommendation API unavailable, falling back to all events:", err.message);
                setError(err.message);
                setRecommendedEvents([]);
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [user?.id]);

    return { recommendedEvents, loading, error, modelUsed };
}
