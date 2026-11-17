import { NextRequest, NextResponse } from "next/server";
import { recordSwipe } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profileId = body.profileId || body.targetProfileId || body.targetId;
    const action = body.action; // "like" | "pass"

    if (!profileId || !action) {
      return NextResponse.json(
        { success: false, error: "profileId and action ('like' | 'pass') are required" },
        { status: 400 }
      );
    }

    if (action !== "like" && action !== "pass") {
      return NextResponse.json(
        { success: false, error: "action must be either 'like' or 'pass'" },
        { status: 400 }
      );
    }

    const result = await recordSwipe(profileId, action);

    return NextResponse.json({
      success: true,
      matched: result.matched,
      profile: result.profile ?? null,
      message: result.matched ? "It's a mutual match!" : `Recorded ${action}`,
    });
  } catch (error: any) {
    console.error("POST /swipe error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record swipe" },
      { status: 500 }
    );
  }
}
