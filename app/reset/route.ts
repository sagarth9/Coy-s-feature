import { NextResponse } from "next/server";
import { resetDemo } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await resetDemo();
    return NextResponse.json({
      success: true,
      message: "Demo deck and matches reset successfully",
    });
  } catch (error) {
    console.error("POST /reset error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset demo" },
      { status: 500 }
    );
  }
}
