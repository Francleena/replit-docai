import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zjmptwdtmshxlmzwkhge.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbXB0d2R0bXNoeGxtendraGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MzEyNDYsImV4cCI6MjA3MDMwNzI0Nn0.zn5DDa42NLVR3OynxFyarKryVypZ7FPkPeHlq_HDTmY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchPublicFile(publicUrl) {
  const res = await fetch(publicUrl);
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`);
  return await res.text();
}
