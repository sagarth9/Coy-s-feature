import { NextResponse } from "next/server";
import { getMatches } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("GET /matches error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
