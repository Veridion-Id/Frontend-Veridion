import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, storeOtp, verifyOtp, hashIdentifier, checkBinding, setBinding } from '@/features/verifications/services/otp-service';
import { checkRateLimit } from '@/features/verifications/services/rate-limiter';
import { sendOtpEmail } from '@/features/verifications/services/email-sender';
import { isValidEmail } from '@/features/verifications/utils/email-utils';
import { isDisposableEmail } from '@/features/verifications/services/disposable-domains';

export async function POST(req: NextRequest) {
  const { action, email, code, wallet } = await req.json();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  if (isDisposableEmail(email)) {
    return NextResponse.json({ error: 'Disposable email addresses are not allowed.' }, { status: 400 });
  }

  if (action === 'send') {
    if (!checkRateLimit(`email-send:${email}`) || (wallet && !checkRateLimit(`email-wallet:${wallet}`))) {
      return NextResponse.json({ error: 'Too many requests. Please wait before retrying.' }, { status: 429 });
    }

    if (wallet) {
      const hash = await hashIdentifier(email, wallet);
      if (checkBinding(hash, wallet) === 'other-wallet') {
        return NextResponse.json({ error: 'This email is already linked to another wallet.' }, { status: 409 });
      }
    }

    const otp = generateOtp();
    storeOtp(`email:${email}`, otp);

    try {
      await sendOtpEmail(email, otp);
    } catch {
      return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  }

  if (action === 'verify') {
    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Invalid code format.' }, { status: 400 });
    }

    const result = verifyOtp(`email:${email}`, code);

    if (result === 'ok') {
      if (wallet) {
        const hash = await hashIdentifier(email, wallet);
        setBinding(hash, wallet);
      }
      return NextResponse.json({ success: true });
    }

    const messages: Record<string, string> = {
      expired: 'Code expired. Please request a new one.',
      invalid: 'Incorrect code. Please try again.',
      'too-many-attempts': 'Too many failed attempts. Request a new code.',
    };
    return NextResponse.json({ error: messages[result] ?? 'Verification failed.' }, { status: 400 });
  }

  return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
}
