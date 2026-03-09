"""
Event Recommendation System
Hybrid approach: FastText (custom-trained model) + TF-IDF
See RECOMMENDATION_WORKING.txt for detailed explanation.
"""

import os
import numpy as np
import fasttext
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity as sklearn_cosine_similarity
from supabase import create_client

# ─── Configuration ────────────────────────────────────────────────────────────

SUPABASE_URL = "https://cqpfzhfrxfoyuqbiocwq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcGZ6aGZyeGZveXVxYmlvY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Nzc3NDYsImV4cCI6MjA4NzU1Mzc0Nn0.U1WDjhasOP6Q_UYBkKHoE8lGcw09h3GCzEumAzL0DOU"

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "events_embeddings.bin")

# Hybrid weights
FASTTEXT_WEIGHT = 0.7
TFIDF_WEIGHT = 0.3

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(title="Event Recommendation API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─── Load FastText Model ─────────────────────────────────────────────────────

print(f"Loading FastText model from {MODEL_PATH}...")
try:
    ft_model = fasttext.load_model(MODEL_PATH)
    print("FastText model loaded successfully!")
except Exception as e:
    print(f"Error loading FastText model: {e}")
    ft_model = None

# ─── Pydantic Models ─────────────────────────────────────────────────────────

class RecommendRequest(BaseModel):
    user_id: str

# ─── Helper Functions ─────────────────────────────────────────────────────────

def text_to_fasttext_embedding(text: str) -> np.ndarray | None:
    """
    Convert text to a FastText embedding by averaging word vectors.
    The FastText model can generate vectors even for unseen words
    thanks to its subword (character n-gram) approach.
    """
    if ft_model is None:
        return None

    words = text.lower().replace(",", " ").replace("&", " ").split()
    words = [w.strip() for w in words if len(w.strip()) > 1]

    if not words:
        return None

    vectors = []
    for word in words:
        vec = ft_model.get_word_vector(word)
        if np.any(vec):  # skip zero vectors
            vectors.append(vec)

    if not vectors:
        return None

    return np.mean(vectors, axis=0)


def cosine_sim(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))


def build_user_text(profile_data: dict) -> str:
    """
    Build a text representation from user profile data.
    Combines businessType, interests, and categories into a single string.
    """
    parts = []

    business_type = profile_data.get("businessType", "")
    if business_type:
        parts.append(business_type)

    interests = profile_data.get("interests", [])
    if interests:
        parts.append(" ".join(interests))

    categories = profile_data.get("categories", [])
    if categories:
        parts.append(" ".join(categories))

    # Also include organization if present (for investors)
    organization = profile_data.get("organization", "")
    if organization:
        parts.append(organization)

    return " ".join(parts) if parts else ""


def build_event_text(event: dict) -> str:
    """
    Build a text representation from an event record.
    Combines name, description, event_type, and industry_focus.
    """
    parts = []
    for field in ["name", "description", "event_type", "industry_focus"]:
        val = event.get(field, "")
        if val:
            parts.append(str(val))
    return " ".join(parts)


# ─── API Endpoints ────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "Event Recommendation API",
        "model_loaded": ft_model is not None,
        "approach": "Hybrid FastText + TF-IDF",
        "fasttext_weight": FASTTEXT_WEIGHT,
        "tfidf_weight": TFIDF_WEIGHT,
    }


@app.post("/recommend")
def recommend_events(req: RecommendRequest):
    """
    Recommend events for a user based on their profile.
    Uses a hybrid scoring approach:
      final_score = 0.7 * FastText_score + 0.3 * TF-IDF_score
    """

    # 1. Fetch user profile
    profile_resp = supabase.table("profiles").select("*").eq("id", req.user_id).execute()
    if not profile_resp.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    profile = profile_resp.data[0]
    profile_data = profile.get("data", {}) or {}

    user_text = build_user_text(profile_data)
    if not user_text:
        raise HTTPException(
            status_code=400,
            detail="User profile has no interests, businessType, or categories set. Please complete your profile first."
        )

    # 2. Fetch all events
    events_resp = supabase.table("events").select("*").execute()
    if not events_resp.data:
        return {"recommendations": [], "user_profile_summary": user_text, "model_used": "No events found"}

    events = events_resp.data
    event_texts = [build_event_text(e) for e in events]

    # 3A. FastText scoring
    fasttext_scores = []
    user_embedding = text_to_fasttext_embedding(user_text)

    if user_embedding is not None:
        for event_text in event_texts:
            event_embedding = text_to_fasttext_embedding(event_text)
            if event_embedding is not None:
                score = cosine_sim(user_embedding, event_embedding)
                # Normalize to 0-1 range (cosine can be -1 to 1)
                score = (score + 1) / 2
                fasttext_scores.append(score)
            else:
                fasttext_scores.append(0.0)
    else:
        fasttext_scores = [0.0] * len(events)

    # 3B. TF-IDF scoring
    tfidf_scores = []
    try:
        all_texts = [user_text] + event_texts
        vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        tfidf_matrix = vectorizer.fit_transform(all_texts)

        user_tfidf = tfidf_matrix[0:1]
        event_tfidf = tfidf_matrix[1:]

        similarities = sklearn_cosine_similarity(user_tfidf, event_tfidf).flatten()
        tfidf_scores = similarities.tolist()
    except Exception:
        tfidf_scores = [0.0] * len(events)

    # 4. Combine scores (hybrid)
    combined_scores = []
    for i in range(len(events)):
        ft_score = fasttext_scores[i] if i < len(fasttext_scores) else 0.0
        tf_score = tfidf_scores[i] if i < len(tfidf_scores) else 0.0
        final = FASTTEXT_WEIGHT * ft_score + TFIDF_WEIGHT * tf_score
        combined_scores.append(final)

    # 5. Build results sorted by score
    results = []
    for i, event in enumerate(events):
        results.append({
            "id": event.get("id"),
            "name": event.get("name"),
            "description": event.get("description"),
            "event_type": event.get("event_type"),
            "industry_focus": event.get("industry_focus"),
            "event_date": event.get("event_date"),
            "event_time": event.get("event_time"),
            "location": event.get("location"),
            "organizer_id": event.get("organizer_id"),
            "match_score": round(combined_scores[i], 4),
            "fasttext_score": round(fasttext_scores[i], 4),
            "tfidf_score": round(tfidf_scores[i], 4),
        })

    # Sort by match_score descending (most similar first)
    results.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "recommendations": results,
        "user_profile_summary": user_text,
        "model_used": "FastText + TF-IDF Hybrid",
        "weights": {"fasttext": FASTTEXT_WEIGHT, "tfidf": TFIDF_WEIGHT},
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": ft_model is not None,
    }