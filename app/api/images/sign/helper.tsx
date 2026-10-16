import { createClient } from "@/lib/supabase/server";

export async function fetchImageUrl(imgKey: string): Promise<string> {
  const supabase = await createClient();

  const { data } = supabase.storage.from("monster-images").getPublicUrl(imgKey);

  return data.publicUrl;
}
