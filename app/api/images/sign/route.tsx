import { NextResponse } from "next/server";
import { fetchImageUrl } from "./helper";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("body in route: ", body);
    const signedUrl = await fetchImageUrl(body?.imgKey);

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.log("error in IMAGE SIGN POST API: ", error);
    return NextResponse.json(
      { error: "Failed to sign image" },
      { status: 500 },
    );
  }
}
