import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://eakfilddkferkswvzpkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVha2ZpbGRka2Zlcmtzd3Z6cGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4Nzc3NjIsImV4cCI6MjA1MTQ1Mzc2Mn0.O-EH9J5RQxODUno6sEc9B9NyeG679R-Lht7Cj6eIvKA';

// Create a single instance of the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 