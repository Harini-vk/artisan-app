from supabase import create_client
import json

SUPABASE_URL = "https://cqpfzhfrxfoyuqbiocwq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcGZ6aGZyeGZveXVxYmlvY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Nzc3NDYsImV4cCI6MjA4NzU1Mzc0Nn0.U1WDjhasOP6Q_UYBkKHoE8lGcw09h3GCzEumAzL0DOU"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

tables = ['events', 'profiles', 'applications', 'notifications', 'schemes']
results = {}

for t in tables:
    try:
        resp = supabase.table(t).select('*').limit(1).execute()
        results[t] = "Exists, count: " + str(len(resp.data))
    except Exception as e:
        results[t] = "Error: " + str(e)

print(json.dumps(results, indent=2))
