import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const REGISTRATIONS_KEY = "youth-gala-registrations";

// GET - Retrieve all registrations
export async function GET() {
  try {
    const registrations = await kv.get(REGISTRATIONS_KEY) || [];
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Error reading registrations:", error);
    return NextResponse.json({ registrations: [] });
  }
}

// POST - Add new registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newRegistration = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      guests: body.guests,
      timestamp: new Date().toISOString(),
    };

    // Get existing registrations
    const registrations = (await kv.get(REGISTRATIONS_KEY)) || [];
    
    // Add new registration
    const updatedRegistrations = Array.isArray(registrations) 
      ? [...registrations, newRegistration]
      : [newRegistration];
    
    // Save back to KV
    await kv.set(REGISTRATIONS_KEY, updatedRegistrations);

    return NextResponse.json({ success: true, registration: newRegistration });
  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save registration" },
      { status: 500 }
    );
  }
}
