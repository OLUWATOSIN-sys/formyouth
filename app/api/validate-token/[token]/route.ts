import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    const client = await clientPromise;
    const db = client.db("youthgala");
    
    const registrant = await db.collection("registrations").findOne({
      paymentUploadToken: token,
    });

    if (!registrant) {
      return NextResponse.json({ valid: false });
    }

    // Check if token has expired (24 hours)
    const expiry = new Date(registrant.paymentUploadExpiry);
    const now = new Date();

    if (now > expiry) {
      return NextResponse.json({ valid: false, reason: "expired" });
    }

    return NextResponse.json({
      valid: true,
      registrant: {
        name: registrant.name,
        email: registrant.email,
        guests: registrant.guests,
        ticketType: registrant.ticketType,
        paymentStatus: registrant.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
