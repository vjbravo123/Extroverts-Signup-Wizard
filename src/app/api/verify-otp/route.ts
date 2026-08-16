import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    const stored = otpStore.get(email.toLowerCase());

    // Demo bypass code 123456 as visible in reference screenshots
    if (otp === '123456' || (stored && stored.otp === otp && stored.expiresAt > Date.now())) {
      otpStore.delete(email.toLowerCase());
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Verification failed. Invalid or expired OTP.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}