import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

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
    
    // Generate unique token for payment upload (valid for 24 hours)
    const paymentUploadToken = uuidv4();
    const paymentUploadExpiry = new Date();
    paymentUploadExpiry.setHours(paymentUploadExpiry.getHours() + 24);
    
    const newRegistration = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      guests: body.guests,
      timestamp: new Date().toISOString(),
      paymentStatus: "not_paid",
      proofOfPayment: null,
      paymentUploadToken: paymentUploadToken,
      paymentUploadExpiry: paymentUploadExpiry.toISOString(),
      proofUploadedAt: null,
      paymentConfirmedAt: null,
    };

    const client = await clientPromise;
    const db = client.db("youthgala");
    const result = await db.collection("registrations").insertOne(newRegistration);

    // Send email with upload link (we'll implement this next)
    const uploadLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/upload-payment/${paymentUploadToken}`;
    
    // TODO: Send email with uploadLink
    console.log("Payment upload link:", uploadLink);

    return NextResponse.json({ 
      success: true, 
      registration: { ...newRegistration, id: result.insertedId.toString() },
      uploadLink: uploadLink
    });
  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save registration" },
      { status: 500 }
    );
  }
}
