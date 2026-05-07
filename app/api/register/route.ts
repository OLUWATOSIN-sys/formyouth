import { NextResponse } from 'next/server';
import { createRegistration, getCapacityLimit, getRegistrationCount } from '@/lib/db';
import { sendTicketEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, parish } = body as Record<string, string>;

    if (!fullName?.trim()) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    const [limit, count] = await Promise.all([getCapacityLimit(), getRegistrationCount()]);
    if (limit !== null && count >= limit) {
      return NextResponse.json({ error: 'Registration is full' }, { status: 409 });
    }

    const id = await createRegistration({
      fullName: fullName.trim(),
      email: email?.trim() ?? '',
      phone: phone?.trim() ?? '',
      parish: parish?.trim() ?? '',
    });

    /* Send ticket email — fire-and-forget so it never blocks the response */
    if (email?.trim()) {
      const origin = request.headers.get('origin') ?? 'https://identity2026.co.za';
      sendTicketEmail(
        { id, fullName: fullName.trim(), email: email.trim(), phone: phone?.trim(), parish: parish?.trim() },
        origin,
      )
        .then(() => console.log(`[email] Ticket sent to ${email.trim()} for ID ${id}`))
        .catch(err => console.error('[email]', err));
    }

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
