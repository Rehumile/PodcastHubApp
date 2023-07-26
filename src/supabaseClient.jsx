import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://xisyhoqjktbgpmhzkmoz.supabase.co'
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpc3lob3Fqa3RiZ3BtaHprbW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MDUwNjYsImV4cCI6MjAwNTk4MTA2Nn0.E8mJaHH7j_8_U3f83_tupo-gTrAjyN2vNaMAtZecuHk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)