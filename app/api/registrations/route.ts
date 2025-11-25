import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { randomUUID } from "crypto";

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
    
    // Generate unique token for payment upload (valid until November 27th, 2025)
    const paymentUploadToken = randomUUID();
    const paymentUploadExpiry = new Date('2025-11-27T23:59:59');
    
    const newRegistration = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      guests: body.guests,
      guestNames: body.guestNames || [],
      ticketType: body.ticketType || "regular", // "vip", "vip-plus", or "regular"
      dietaryRequirement: body.dietaryRequirement || "none",
      allergies: body.allergies || "",
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

    // Send email with upload link
    const uploadLink = `https://rccgyouthheavensgate.org/upload-payment/${paymentUploadToken}`;
    
    // Send email and wait for it to complete
    try {
      console.log("Attempting to send email to:", body.email);
      const { sendPaymentUploadEmail } = await import("@/lib/email");
      const emailResult = await sendPaymentUploadEmail(body.email, body.name, uploadLink, body.guests, body.ticketType || "regular");
      if (emailResult.success) {
        console.log("✅ Email sent successfully to:", body.email);
      } else {
        console.error("❌ Email failed:", emailResult.error);
      }
    } catch (emailError) {
      console.error("❌ Email error:", emailError);
    }

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
