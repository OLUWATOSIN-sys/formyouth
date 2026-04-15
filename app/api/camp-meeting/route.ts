import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const attendees = await db
      .collection("camp-meeting")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(attendees);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendees" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    // Check for duplicate sign-in by phone number on the same date
    const existingByPhone = await db.collection("camp-meeting").findOne({
      phone: body.phone,
      date: body.date,
    });

    if (existingByPhone) {
      return NextResponse.json(
        { error: "already_signed_in", message: "This phone number is already signed in for this date." },
        { status: 409 }
      );
    }

    // Check for duplicate by full name on the same date (case-insensitive)
    const existingByName = await db.collection("camp-meeting").findOne({
      fullName: { $regex: new RegExp(`^${body.fullName}$`, 'i') },
      date: body.date,
    });

    if (existingByName) {
      return NextResponse.json(
        { error: "already_signed_in", message: "This name is already signed in for this date." },
        { status: 409 }
      );
    }

    const attendee = {
      ...body,
      signedIn: true,
      signInTime: new Date(),
      signOutTime: null,
      createdAt: new Date(),
    };

    const result = await db.collection("camp-meeting").insertOne(attendee);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Error creating attendee:", error);
    return NextResponse.json(
      { error: "Failed to register attendee" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;
    const db = await getDatabase();

    if (action === "signOut") {
      await db.collection("camp-meeting").updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            signedIn: false, 
            signOutTime: new Date() 
          } 
        }
      );
    } else if (action === "signIn") {
      await db.collection("camp-meeting").updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            signedIn: true, 
            signInTime: new Date(),
            signOutTime: null 
          } 
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating attendee:", error);
    return NextResponse.json(
      { error: "Failed to update attendee" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection("camp-meeting").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting attendee:", error);
    return NextResponse.json(
      { error: "Failed to delete attendee" },
      { status: 500 }
    );
  }
}
