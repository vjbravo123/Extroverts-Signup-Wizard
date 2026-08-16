import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { otpStore } from '@/lib/otpStore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Save to store
    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    // Send via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `Your Extroverts Verification Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 40px 20px; text-align: center; border-radius: 12px;">
          <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-bottom: 8px;">E<span style="color:#a855f7;">•</span></h1>
          <p style="color: #a1a1aa; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Getting Ready for the Party</p>
          <div style="margin: 32px 0;">
            <p style="font-size: 16px; margin-bottom: 12px; color: #d4d4d8;">Your 6-digit verification OTP is:</p>
            <div style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #a855f7; background: #18181b; padding: 12px 24px; border-radius: 8px; border: 1px solid #3f3f46;">
              ${otp}
            </div>
          </div>
          <p style="color: #71717a; font-size: 12px;">Valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.warn('Resend failed (Check API Key / Domain):', error);
      // Return OTP in response in dev mode if email sending fails so testing isn't blocked
      return NextResponse.json({ 
        success: true, 
        message: 'OTP generated (Email delivery failed or unverified recipient)',
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined 
      });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}