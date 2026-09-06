import { requireSupabaseClient } from '@/lib/supabase/client';

export async function signInAdmin(email: string, password: string) {
  const supabase = requireSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOutAdmin() {
  const supabase = requireSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
