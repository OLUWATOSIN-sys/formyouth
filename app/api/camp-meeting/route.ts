import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Helper to get South Africa time
function getSATime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const fullName = searchParams.get("fullName");
    
    const db = await getDatabase();
    
    // Search attendees for autocomplete (returns multiple matches)
    if (action === "searchAttendees" && fullName) {
      const searchTerm = fullName.trim();
      if (searchTerm.length < 2) {
        return NextResponse.json([]);
      }
      
      // Remove spaces and create flexible pattern
      const noSpaces = searchTerm.replace(/\s+/g, '');
      const chars = noSpaces.split('').map((c: string) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const fuzzyPattern = chars.join('.*');
      
      const attendees = await db.collection("camp-meeting")
        .find({ fullName: { $regex: new RegExp(fuzzyPattern, 'i') } })
        .limit(10)
        .toArray();
      
      return NextResponse.json(attendees);
    }

    // Find attendee by name for sign-in/sign-out lookup
    if (action === "findAttendee" && fullName) {
      // Try exact match first
      let attendee = await db.collection("camp-meeting").findOne({
        fullName: { $regex: new RegExp(`^${fullName}$`, 'i') }
      });
      
      // Fuzzy search if not found
      if (!attendee) {
        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length >= 2) {
          const fuzzyPattern = nameParts.map((part: string) => `(?=.*${part})`).join('');
          attendee = await db.collection("camp-meeting").findOne({
            fullName: { $regex: new RegExp(fuzzyPattern, 'i') }
          });
        } else if (nameParts.length === 1) {
          // Search by first name or last name
          attendee = await db.collection("camp-meeting").findOne({
            fullName: { $regex: new RegExp(nameParts[0], 'i') }
          });
        }
      }
      
      if (!attendee) {
        return NextResponse.json(
          { error: "not_found", message: "You are not registered. Please see the registration desk." },
          { status: 404 }
        );
      }
      
      return NextResponse.json(attendee);
    }
    
    // Default: return all attendees
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

// POST - Admin registers new attendee (not signed in yet)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    // Check for duplicate by full name (case-insensitive)
    const existingByName = await db.collection("camp-meeting").findOne({
      fullName: { $regex: new RegExp(`^${body.fullName}$`, 'i') }
    });

    if (existingByName) {
      return NextResponse.json(
        { error: "already_exists", message: "This person is already registered." },
        { status: 409 }
      );
    }

    const attendee = {
      fullName: body.fullName,
      gender: body.gender,
      parish: body.parish,
      signedIn: false,
      signInTime: null,
      signOutTime: null,
      createdAt: new Date(),
    };

    const result = await db.collection("camp-meeting").insertOne(attendee);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Error registering attendee:", error);
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

    // Admin actions by ID
    if (action === "signOut" && id) {
      await db.collection("camp-meeting").updateOne(
        { _id: new ObjectId(id) },
        { $set: { signedIn: false, signOutTime: new Date() } }
      );
      return NextResponse.json({ success: true });
    } 
    
    if (action === "signIn" && id) {
      await db.collection("camp-meeting").updateOne(
        { _id: new ObjectId(id) },
        { $set: { signedIn: true, signInTime: new Date(), signOutTime: null } }
      );
      return NextResponse.json({ success: true });
    }

    // Self Sign-In by name
    if (action === "selfSignIn") {
      const { attendeeId } = body;
      
      const attendee = await db.collection("camp-meeting").findOne({ _id: new ObjectId(attendeeId) });
      
      if (!attendee) {
        return NextResponse.json(
          { error: "not_found", message: "Attendee not found." },
          { status: 404 }
        );
      }

      if (attendee.signedIn) {
        return NextResponse.json(
          { error: "already_signed_in", message: "You are already signed in.", signInTime: attendee.signInTime },
          { status: 400 }
        );
      }

      await db.collection("camp-meeting").updateOne(
        { _id: new ObjectId(attendeeId) },
        { $set: { signedIn: true, signInTime: new Date() } }
      );

      return NextResponse.json({ success: true, signInTime: new Date() });
    }

    // Self Sign-Out by ID
    if (action === "selfSignOut") {
      const settings = await db.collection("camp-meeting-settings").findOne({ type: "settings" });
      
      if (!settings || settings.signOutEnabled !== true) {
        return NextResponse.json(
          { error: "disabled", message: "Sign-out is currently disabled. Please wait for admin to enable it." },
          { status: 403 }
        );
      }

      const { attendeeId } = body;
      
      const attendee = await db.collection("camp-meeting").findOne({ _id: new ObjectId(attendeeId) });
      
      if (!attendee) {
        return NextResponse.json(
          { error: "not_found", message: "Attendee not found." },
          { status: 404 }
        );
      }

      if (!attendee.signedIn) {
        return NextResponse.json(
          { error: "not_signed_in", message: "You are not currently signed in." },
          { status: 400 }
        );
      }

      await db.collection("camp-meeting").updateOne(
        { _id: new ObjectId(attendeeId) },
        { $set: { signedIn: false, signOutTime: new Date() } }
      );

      return NextResponse.json({ success: true, signOutTime: new Date() });
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
