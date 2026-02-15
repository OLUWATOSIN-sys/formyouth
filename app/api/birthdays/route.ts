import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const birthdays = await db
      .collection("birthdays")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(
      birthdays.map((b) => ({
        id: b._id.toString(),
        fullName: b.fullName,
        dateOfBirth: b.dateOfBirth,
        phoneNumber: b.phoneNumber,
        email: b.email,
        createdAt: b.createdAt,
      }))
    );
  } catch (error) {
    console.error("Error fetching birthdays:", error);
    return NextResponse.json({ error: "Failed to fetch birthdays" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    const newBirthday = {
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      phoneNumber: body.phoneNumber,
      email: body.email,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("birthdays").insertOne(newBirthday);

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    console.error("Error creating birthday:", error);
    return NextResponse.json({ error: "Failed to save birthday" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    await db.collection("birthdays").deleteOne({ _id: new ObjectId(body.id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting birthday:", error);
    return NextResponse.json({ error: "Failed to delete birthday" }, { status: 500 });
  }
}
