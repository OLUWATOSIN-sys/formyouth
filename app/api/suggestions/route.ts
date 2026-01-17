import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const suggestions = await db
      .collection("suggestions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(
      suggestions.map((s) => ({
        id: s._id.toString(),
        suggestion: s.suggestion,
        category: s.category || "general",
        anonymous: true,
        createdAt: s.createdAt,
        status: s.status || "new",
      }))
    );
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    const newSuggestion = {
      suggestion: body.suggestion,
      category: body.category || "general",
      createdAt: new Date().toISOString(),
      status: "new",
    };

    const result = await db.collection("suggestions").insertOne(newSuggestion);

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    return NextResponse.json({ error: "Failed to create suggestion" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    await db.collection("suggestions").updateOne(
      { _id: new ObjectId(body.id) },
      { $set: { status: body.status } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating suggestion:", error);
    return NextResponse.json({ error: "Failed to update suggestion" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    await db.collection("suggestions").deleteOne({ _id: new ObjectId(body.id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    return NextResponse.json({ error: "Failed to delete suggestion" }, { status: 500 });
  }
}
