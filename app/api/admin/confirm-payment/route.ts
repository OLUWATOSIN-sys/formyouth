import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    const client = await clientPromise;
    const db = client.db("youthgala");

    // Get registrant details first
    const registrant = await db.collection("registrations").findOne({
      _id: new ObjectId(id),
    });

    if (!registrant) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    // Update payment status
    const result = await db.collection("registrations").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          paymentStatus: "confirmed",
          paymentConfirmedAt: new Date().toISOString(),
        },
      }
    );

    // Send confirmation email
    if (process.env.SMTP_USER && registrant.email) {
      const { sendPaymentConfirmationEmail } = await import("@/lib/email");
      sendPaymentConfirmationEmail(registrant.email, registrant.name).catch(err =>
        console.error("Failed to send confirmation email:", err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
