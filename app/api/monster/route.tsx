import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("monsters")
    .select("*")
    .is("deletedAt", null)
    .order("id");

  if (error) {
    console.log("error fetching monster: ", error);
    return NextResponse.json(
      { error: "Failed to fetch monsters" },
      { status: 500 },
    );
  }
  console.log("data: ", data);
  return NextResponse.json(data);
}

const BUCKET = process.env.BUCKET_NAME;

export async function POST(request: Request) {
  try {
    if (!BUCKET) {
      throw new Error("Missing Bucket");
    }
    const supabase = await createClient();

    const formData = await request.formData();
    const image = formData.get("image");
    const rawData = formData.get("data");

    if (!(image instanceof File) || typeof rawData !== "string") {
      return NextResponse.json(
        { error: "Missing image or data" },
        { status: 400 },
      );
    }

    const { name, threatLevel, abnormalStatus, elementalWeakness } =
      JSON.parse(rawData);

    const monsterObject = {
      name,
      threatLevel,
      abnormalStatus,
      elementalWeakness,
    };

    console.log("input Monster object: ", monsterObject);

    const { data: monster, error: insertError } = await supabase
      .from("monsters")
      .insert({
        name,
        threatLevel: threatLevel,
        abnormalStatus: abnormalStatus,
        elementalWeakness: elementalWeakness,
      })
      .select()
      .single();

    if (insertError || !monster) {
      console.error("Error inserting monster:", insertError);
      return NextResponse.json(
        { error: "Failed to create monster" },
        { status: 500 },
      );
    }

    // 2. Upload the image using your naming standard
    const imgKey = `monster${monster.id}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(imgKey, image, {
        contentType: image.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      await supabase.from("monsters").delete().eq("id", monster.id);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 },
      );
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(imgKey);

    const imageUrl = urlData.publicUrl;

    const { data: updated, error: updateError } = await supabase
      .from("monsters")
      .update({ imgKey, imageUrl })
      .eq("id", monster.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error saving img_key:", updateError);
      await supabase.storage.from(BUCKET).remove([imgKey]);
      await supabase.from("monsters").delete().eq("id", monster.id);
      return NextResponse.json(
        { error: "Failed to save image key" },
        { status: 500 },
      );
    }

    return NextResponse.json(updated, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
