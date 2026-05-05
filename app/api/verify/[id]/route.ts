import { NextResponse } from 'next/server';
import { getRegistration, checkInRegistration } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const registration = await getRegistration(id);
  if (!registration) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }
  return NextResponse.json(registration);
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const registration = await getRegistration(id);
  if (!registration) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }
  if (registration.checkedIn) {
    return NextResponse.json(
      { error: 'Already checked in', registration },
      { status: 409 },
    );
  }
  await checkInRegistration(id);
  return NextResponse.json({ success: true, registration: await getRegistration(id) });
}
