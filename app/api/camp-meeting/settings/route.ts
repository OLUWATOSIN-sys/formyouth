import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const settings = await db.collection("camp-meeting-settings").findOne({ type: "settings" });
    
    if (!settings) {
      // Default settings
      const defaultSettings = {
        type: "settings",
        signInEnabled: true,
        signInDeadline: null,
        signOutEnabled: false,
      };
      await db.collection("camp-meeting-settings").insertOne(defaultSettings);
      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    
    await db.collection("camp-meeting-settings").updateOne(
      { type: "settings" },
      { $set: body },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
