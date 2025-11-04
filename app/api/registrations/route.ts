import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "registrations.json");

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ registrations: [] }));
  }
}

// GET - Retrieve all registrations
export async function GET() {
  try {
    ensureDataDir();
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading registrations:", error);
    return NextResponse.json({ registrations: [] });
  }
}

// POST - Add new registration
export async function POST(request: Request) {
  try {
    ensureDataDir();
    const body = await request.json();
    
    const newRegistration = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      guests: body.guests,
      timestamp: new Date().toISOString(),
    };

    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const jsonData = JSON.parse(data);
    jsonData.registrations.push(newRegistration);
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({ success: true, registration: newRegistration });
  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save registration" },
      { status: 500 }
    );
  }
}
