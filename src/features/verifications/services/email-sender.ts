function buildOtpHtml(code: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><title>Veridion Verification</title></head>
    <body style="margin:0;padding:0;background:#0e0d0d;font-family:sans-serif">
      <div style="max-width:480px;margin:40px auto;background:#1a1919;border-radius:12px;padding:32px;color:#fff">
        <h1 style="margin:0 0 8px;font-size:22px;color:#fff">Verify your email</h1>
        <p style="color:#9ca3af;margin:0 0 24px;font-size:14px">
          Use the code below to complete your Veridion verification.
        </p>
        <div style="background:#0e0d0d;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px">
          <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#3b82f6">${code}</span>
        </div>
        <p style="color:#6b7280;font-size:12px;margin:0">
          This code expires in <strong style="color:#9ca3af">10 minutes</strong>.
          Never share it with anyone.
        </p>
      </div>
    </body>
    </html>
  `.trim();
}

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@veridion.app';

  if (!apiKey) {
    console.log(`[DEV EMAIL] to=${to} code=${code}`);
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${code} is your Veridion verification code`,
      html: buildOtpHtml(code),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend error ${res.status}: ${detail}`);
  }
}
