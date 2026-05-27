// SpeedVerse Markets — Supabase client
const SUPABASE_URL  = 'https://ywnpzjjpighjhhqoxtsj.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bnB6ampwaWdoamhocW94dHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1Mjc4OTUsImV4cCI6MjA5MzEwMzg5NX0.lfeKjFfNsCoy1UaQ0ASIUD08fUq8mhY-1gbMPzrjYDE';

window.SV_DB = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
