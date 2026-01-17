import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const db = await getDatabase();

    const admin = await db.collection("admin").findOne({ password });

    if (admin) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error authenticating:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const db = await getDatabase();

    const admin = await db.collection("admin").findOne({ password: currentPassword });

    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid current password" }, { status: 401 });
    }

    await db.collection("admin").updateOne(
      { _id: admin._id },
      { $set: { password: newPassword } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
