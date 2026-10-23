import { createClient } from "@/lib/supabase/server";

export async function fetchImageUrl(imgKey: string): Promise<string> {
  const bucketname = process.env.BUCKET_NAME;
  const supabase = await createClient();
  if (!bucketname) {
    throw new Error("Missing bucket");
  }

  const { data } = supabase.storage.from(bucketname).getPublicUrl(imgKey);

  return data.publicUrl;
}
