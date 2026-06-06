# Event Match - Maker Mentor Map

A platform designed for entrepreneurs, investors, and organizers to connect through events. This project features an AI-powered event recommendation system that uses a hybrid FastText + TF-IDF approach to match users with relevant events based on their profiles.

## Prerequisites

- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.8+](https://www.python.org/) (for the recommendation backend)
- [Supabase](https://supabase.com/) account and project

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
