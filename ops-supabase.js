// SpeedVerse OPS — isolated admin Supabase client
// Uses sessionStorage + a separate key so it never touches the user's localStorage session.
const SUPABASE_URL  = 'https://gyperxfmdkukpvoadahx.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cGVyeGZtZGt1a3B2b2FkYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjczNjcsImV4cCI6MjA5NTIwMzM2N30.DNOdBWhOHV4DMZ3ZAqBwg4P6Tz4LICrOcOcLObmafgM';

window.SV_DB = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:           window.sessionStorage,
    storageKey:        'sv-ops-auth',
    persistSession:    true,
    autoRefreshToken:  true,
  }
});
