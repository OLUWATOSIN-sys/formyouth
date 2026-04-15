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

    // Check settings for sign-in restrictions
    const settings = await db.collection("camp-meeting-settings").findOne({ type: "settings" });
    
    if (settings) {
      // Check if sign-in is disabled
      if (settings.signInEnabled === false) {
        return NextResponse.json(
          { error: "blocked", message: "Sign-in is currently disabled by admin." },
          { status: 403 }
        );
      }
      
      // Check if sign-in deadline has passed
      if (settings.signInDeadline) {
        const deadline = new Date(settings.signInDeadline);
        if (new Date() > deadline) {
          return NextResponse.json(
            { error: "blocked", message: "Sign-in period has ended. Registration is closed." },
            { status: 403 }
          );
        }
      }
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
    } else if (action === "selfSignOut") {
      // Check if sign-out is enabled by admin
      const settings = await db.collection("camp-meeting-settings").findOne({ type: "settings" });
      
      if (!settings || settings.signOutEnabled !== true) {
        return NextResponse.json(
          { error: "disabled", message: "Sign-out is currently disabled. Please wait for admin to enable it." },
          { status: 403 }
        );
      }

      // Self sign-out by name and date with smart matching
      const { fullName, date } = body;
      
      // First try exact match (case-insensitive)
      let attendee = await db.collection("camp-meeting").findOne({
        fullName: { $regex: new RegExp(`^${fullName}$`, 'i') },
        date: date,
        signedIn: true
      });

      // If not found, try fuzzy match (contains search)
      if (!attendee) {
        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length >= 2) {
          // Try matching with first and last name parts
          const fuzzyPattern = nameParts.map((part: string) => `(?=.*${part})`).join('');
          attendee = await db.collection("camp-meeting").findOne({
            fullName: { $regex: new RegExp(fuzzyPattern, 'i') },
            date: date,
            signedIn: true
          });
        }
      }

      // If still not found, check if they ever signed in for that date
      if (!attendee) {
        const anyRecord = await db.collection("camp-meeting").findOne({
          fullName: { $regex: new RegExp(fullName.split(/\s+/)[0], 'i') },
          date: date
        });

        if (anyRecord && !anyRecord.signedIn) {
          return NextResponse.json(
            { error: "already_signed_out", message: "You have already signed out for this date." },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: "not_found", message: "You have not signed in for this date. Please check your name and date." },
          { status: 404 }
        );
      }

      await db.collection("camp-meeting").updateOne(
        { _id: attendee._id },
        { 
          $set: { 
            signedIn: false, 
            signOutTime: new Date() 
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
