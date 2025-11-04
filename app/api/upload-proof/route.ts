import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, proofOfPayment } = body;

    const client = await clientPromise;
    const db = client.db("youthgala");

    // Update registration with proof of payment
    const result = await db.collection("registrations").updateOne(
      { paymentUploadToken: token },
      {
        $set: {
          proofOfPayment: proofOfPayment,
          paymentStatus: "proof_uploaded",
          proofUploadedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading proof:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload proof" },
      { status: 500 }
    );
  }
}
