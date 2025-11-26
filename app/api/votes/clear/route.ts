import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// DELETE - Clear all votes
export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db("youthgala");
    
    // Delete all votes from the collection
    const result = await db.collection("votes").deleteMany({});

    return NextResponse.json({ 
      success: true, 
      message: `Successfully cleared ${result.deletedCount} votes`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error clearing votes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear votes" },
      { status: 500 }
    );
  }
}
