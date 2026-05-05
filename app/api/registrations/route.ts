import { NextResponse } from 'next/server';
import { getAllRegistrations } from '@/lib/db';

export async function GET() {
  const registrations = await getAllRegistrations();
  return NextResponse.json(registrations);
}
