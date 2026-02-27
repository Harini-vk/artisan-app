import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cqpfzhfrxfoyuqbiocwq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcGZ6aGZyeGZveXVxYmlvY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Nzc3NDYsImV4cCI6MjA4NzU1Mzc0Nn0.U1WDjhasOP6Q_UYBkKHoE8lGcw09h3GCzEumAzL0DOU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
