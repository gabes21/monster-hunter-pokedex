import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase
    .from("monsters")
    .update({ deletedAt: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}

const BUCKET = process.env.BUCKET_NAME;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!BUCKET) {
      throw new Error("Missing Bucket");
    }
    const { id } = await params;
    const supabase = await createClient();

    const formData = await request.formData();
    const image = formData.get("image");
    const rawData = formData.get("data");

    if (typeof rawData !== "string") {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const { name, threatLevel, abnormalStatus, elementalWeakness } =
      JSON.parse(rawData);

    const updates: Record<string, unknown> = {
      name,
      threatLevel,
      abnormalStatus,
      elementalWeakness,
    };

    if (image instanceof File && image.size > 0) {
      const imgKey = `monster${id}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(imgKey, image, { contentType: image.type, upsert: true });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 },
        );
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(imgKey);

      updates.imgKey = imgKey;
      updates.imageUrl = `${urlData.publicUrl}?v=${Date.now()}`;
    }

    console.log("updates object: ", updates);

    const { data: updated, error: updateError } = await supabase
      .from("monsters")
      .update(updates)
      .eq("id", id)
      .is("deletedAt", null)
      .select()
      .single();

    if (updateError || !updated) {
      console.error("Error updating monster:", updateError);
      return NextResponse.json(
        { error: "Failed to update monster" },
        { status: 500 },
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
