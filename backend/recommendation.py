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

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model", "bilingual_fasttext_model.bin")
# Hybrid weights
FASTTEXT_WEIGHT = 0.7
TFIDF_WEIGHT = 0.3

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(title="Event Recommendation API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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


SCHEMES_DATA = [
    {
        "id": "1",
        "name": "Mudra Yojana (PMMY)",
        "type": "Loan",
        "description": "Micro-credit up to ₹10 lakh for income-generating micro enterprises without collateral.",
        "eligibility": "Women entrepreneurs in manufacturing, trading, or service sectors",
        "benefits": "Shishu (up to 50K), Kishore (50K to 5L), Tarun (5L to 10L)",
        "link": "https://www.mudra.org.in/"
    },
    {
        "id": "2",
        "name": "Stand-Up India Scheme",
        "type": "Subsidy/Loan",
        "description": "Facilitates bank loans between ₹10 lakh and ₹1 crore for SC/ST and Women entrepreneurs.",
        "eligibility": "Women setting up greenfield enterprise in manufacturing, services or trading sector",
        "benefits": "Composite loan (inclusive of term loan and working capital) up to ₹1 crore",
        "link": "https://www.standupmitra.in/"
    },
    {
        "id": "3",
        "name": "Mahila Samridhi Yojana",
        "type": "Micro Finance",
        "description": "Microfinance scheme for women belonging to backward classes to start small businesses.",
        "eligibility": "Women belonging to marginalized communities.",
        "benefits": "Loan up to ₹1,40,000 at lower interest rates.",
        "link": "https://nbcfdc.gov.in/"
    },
    {
        "id": "4",
        "name": "TREAD Scheme",
        "type": "Grant / Credit",
        "description": "Trade Related Entrepreneurship Assistance and Development scheme provides credit to projects.",
        "eligibility": "Women who lack access to formal credit.",
        "benefits": "Upto 30% grant or subsidy of total project cost.",
        "link": "https://msme.gov.in/"
    },
    {
        "id": "5",
        "name": "PMEGP",
        "type": "Grant",
        "description": "Prime Minister's Employment Generation Programme.",
        "eligibility": "Any individual, above 18 years of age.",
        "benefits": "15-35% subsidy on project cost.",
        "link": "https://www.kviconline.gov.in/"
    }
]


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": ft_model is not None,
    }


@app.get("/schemes")
def get_schemes():
    """Returns a list of real Government Schemes available for women entrepreneurs."""
    return {"schemes": SCHEMES_DATA}


@app.get("/notifications/{user_id}")
def get_notifications(user_id: str):
    """
    Dynamically generate notifications for the given user.
    Uses Event Recommendations, Applications, and General Schemes.
    """
    notifications = []
    notif_id_counter = [1]

    def make_id():
        curr = str(notif_id_counter[0])
        notif_id_counter[0] += 1
        return curr

    # 1. New Scheme Available (Static highlight)
    notifications.append({
        "id": make_id(),
        "title": "New Scheme Available",
        "message": "Check out the Mudra Yojana scheme for women entrepreneurs offering up to ₹10 lakh without collateral.",
        "time": "Just now",
        "read": False,
        "type": "scheme"
    })

    # 2. Check recommendations for top events
    try:
        req = RecommendRequest(**{"user_id": user_id})
        rec_data = recommend_events(req)
        top_events = rec_data.get("recommendations", [])
        
        if top_events and len(top_events) > 0:
            top_event = top_events[0]
            # If the score is decent, notify
            if top_event["match_score"] > 0.4:
                notifications.append({
                    "id": make_id(),
                    "title": "New Event Recommended",
                    "message": f"{top_event['name']} matches your profile interests.",
                    "time": "2 hours ago",
                    "read": False,
                    "type": "event"
                })
    except Exception as e:
        print(f"Error fetching recommendations for notifications: {e}")

    # 3. Check application approvals & Event Reminders
    try:
        app_resp = supabase.table("applications").select("*, events(*)").eq("user_id", user_id).execute()
        apps = app_resp.data or []
        
        for app_record in apps:
            status = app_record.get("status", "").lower()
            event_name = "Event"
            if app_record.get("events"):
                event_name = app_record["events"].get("name", "Event")

            # Notification: Application Approved
            if status == "approved":
                notifications.append({
                    "id": make_id(),
                    "title": "Application Approved",
                    "message": f"Your application for {event_name} has been approved!",
                    "time": "1 day ago",
                    "read": False,
                    "type": "status"
                })
                
                # Highlight an event reminder
                notifications.append({
                    "id": make_id(),
                    "title": "Event Reminder",
                    "message": f"Don't forget to prepare for {event_name} coming up soon!",
                    "time": "3 days ago",
                    "read": True, # Marked as read usually
                    "type": "event"
                })
                
            elif status == "rejected":
                notifications.append({
                    "id": make_id(),
                    "title": "Application Update",
                    "message": f"Your application for {event_name} was not accepted this time.",
                    "time": "1 day ago",
                    "read": True,
                    "type": "status"
                })
    except Exception as e:
        print(f"Error fetching applications: {e}")

    # Sort notifications to have unread first (simulated times)
    notifications.sort(key=lambda x: not x["read"], reverse=True)

    return {"notifications": notifications}