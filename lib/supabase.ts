import { createClient } from '@supabase/supabase-js'

// REPLACE THESE WITH YOUR SUPABASE KEYS
const supabaseUrl = 'https://gtizygxnztibmekogzss.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0aXp5Z3huenRpYm1la29nenNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDcwNjYsImV4cCI6MjA4MDE4MzA2Nn0.obOo_gj2DzIOjZf8_NcDmf4K9N6jeGUsmqMwPPh_Hlw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
