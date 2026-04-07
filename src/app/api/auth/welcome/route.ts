import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    await sendWelcomeEmail({ to: email, name });
    return NextResponse.json({ sent: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Welcome email error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
