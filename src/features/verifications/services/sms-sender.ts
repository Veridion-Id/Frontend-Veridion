export async function sendSms(to: string, body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_FROM;

  if (!accountSid || !authToken || !from) {
    console.log(`[DEV SMS] to=${to}: ${body}`);
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({ From: from, To: to, Body: body });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Twilio error ${res.status}: ${detail}`);
  }
}

export async function sendOtpSms(phone: string, code: string): Promise<void> {
  await sendSms(
    phone,
    `Your Veridion verification code is ${code}. It expires in 10 minutes. Do not share it.`
  );
}
