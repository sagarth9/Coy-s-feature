import { NextResponse } from "next/server";
import { getFeed } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const feed = await getFeed();
    return NextResponse.json({
      success: true,
      count: feed.length,
      profiles: feed,
    });
  } catch (error) {
    console.error("GET /feed error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feed profiles" },
      { status: 500 }
    );
  }
}
