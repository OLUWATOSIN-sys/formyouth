import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET - Retrieve all registrations
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("youthgala");
    const registrations = await db
      .collection("registrations")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

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
      name: body.name,
      email: body.email,
      phone: body.phone,
      guests: body.guests,
      timestamp: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db("youthgala");
    const result = await db.collection("registrations").insertOne(newRegistration);

    return NextResponse.json({ 
      success: true, 
      registration: { ...newRegistration, id: result.insertedId.toString() }
    });
  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save registration" },
      { status: 500 }
    );
  }
}
