import { getSupabaseClient, requireSupabaseClient } from '@/lib/supabase/client';
import type { GalleryImage } from '@/types/gallery.types';

const BUCKET = 'gallery';

export async function getPublicGalleryImages(): Promise<GalleryImage[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('gallery_images')
    .select('id, url, caption, sort_order, created_at')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function uploadGalleryImage(file: File, caption?: string) {
  const supabase = requireSupabaseClient();
  const fileExt = file.name.split('.').pop() ?? 'jpg';
  const filePath = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  const { error: insertError } = await supabase.from('gallery_images').insert({
    url: publicUrlData.publicUrl,
    storage_path: filePath,
    caption: caption ?? null,
    is_published: true,
  });
  if (insertError) throw insertError;
}
