import { NextResponse } from 'next/server';
import { getCapacityLimit, setCapacityLimit, getRegistrationCount } from '@/lib/db';

export async function GET() {
  try {
    const [limit, count] = await Promise.all([getCapacityLimit(), getRegistrationCount()]);
    return NextResponse.json({ limit, count });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { limit } = await request.json() as { limit: number };
    if (typeof limit !== 'number' || limit < 1) {
      return NextResponse.json({ error: 'Invalid limit' }, { status: 400 });
    }
    await setCapacityLimit(limit);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
