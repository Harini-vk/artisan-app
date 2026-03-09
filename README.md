# Event Match - Maker Mentor Map

A platform designed for entrepreneurs, investors, and organizers to connect through events. This project features an AI-powered event recommendation system that uses a hybrid FastText + TF-IDF approach to match users with relevant events based on their profiles.

## Prerequisites

- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.8+](https://www.python.org/) (for the recommendation backend)
- [Supabase](https://supabase.com/) account and project

---

## Getting Started

### 1. Database Setup (Supabase)

Before running the application, you need to seed the database with mock events.

1.  Open your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to the **SQL Editor**.
3.  Create a new query and paste the contents of `backend/seed_events.sql` (if available, or use your own event data).
4.  Run the query to populate the `events` table.

### 2. Backend Setup (Recommendation AI)

The backend provides the AI recommendation engine using a custom-trained FastText model.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Ensure your `events_embeddings.bin` model file is in the `backend` folder.
4.  Start the FastAPI server:
    ```bash
    python -m uvicorn recommendation:app --host 0.0.0.0 --port 8000
    ```
    The backend will now be running at `http://localhost:8000`.

### 3. Frontend Setup

The frontend is a React application built with Vite.

1.  In the root directory, install the dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at the URL shown in your terminal (usually `http://localhost:5173`).

---

## How the Recommendation System Works

The recommendation system uses a hybrid approach:
- **FastText (70% weight)**: Provides semantic understanding. It recognizes that "pottery" and "ceramics" are related even if the words don't match exactly.
- **TF-IDF (30% weight)**: Provides exact keyword matching to boost events that contain the precise terms the user is interested in.

For a detailed architectural breakdown, see the `backend/Working.txt` file.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React, Supabase-js
- **Backend**: FastAPI, fasttext, scikit-learn, numpy, supabase-py
- **Database**: Supabase (PostgreSQL)
