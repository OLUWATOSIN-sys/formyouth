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
    
    // Generate unique token for payment upload (valid for 24 hours)
    const paymentUploadToken = randomUUID();
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

    // Send email with upload link
    const uploadLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/upload-payment/${paymentUploadToken}`;
    
    // Send email (don't wait for it to avoid blocking)
    if (process.env.SMTP_USER) {
      console.log("Attempting to send email to:", body.email);
      const { sendPaymentUploadEmail } = await import("@/lib/email");
      sendPaymentUploadEmail(body.email, body.name, uploadLink, body.guests)
        .then(() => console.log("Email sent successfully to:", body.email))
        .catch(err => console.error("Failed to send email:", err));
    } else {
      console.log("SMTP not configured - skipping email");
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
