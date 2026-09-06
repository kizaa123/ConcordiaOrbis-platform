import { PLATFORM_NAME } from '../constants/platform';

type SmsProviderName = 'arkesel' | 'hubtel' | 'twilio' | 'custom';

type SmsSendResult =
  | { sent: true; provider: SmsProviderName }
  | { sent: false; devMode: true; devCode: string };

function allowDevFallback(): boolean {
  if (process.env.SMS_ALLOW_DEV_FALLBACK === 'true') return true;
  if (process.env.SMS_ALLOW_DEV_FALLBACK === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

function smsDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

function twilioToAddress(phone: string): string {
  if (phone.startsWith('+')) return phone;
  return `+${smsDigits(phone)}`;
}

function hubtelToAddress(phone: string): string {
  return smsDigits(phone);
}

/** Arkesel expects country code without + , e.g. 233241234567 */
function arkeselToAddress(phone: string): string {
  return smsDigits(phone);
}

async function sendViaArkesel(toPhone: string, message: string): Promise<boolean> {
  const apiKey = process.env.ARKESEL_API_KEY?.trim();
  const sender = (process.env.ARKESEL_SENDER_ID?.trim() || 'Concordia').slice(0, 11);

  if (!apiKey) {
    return false;
  }

  const res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender,
      message,
      recipients: [arkeselToAddress(toPhone)],
    }),
  });

  const payload = (await res.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
    code?: string;
  };

  if (!res.ok) {
    console.error('[sms:arkesel] Error sending SMS:', payload);
    throw new Error(payload.message || `Arkesel HTTP ${res.status}`);
  }

  const status = (payload.status || '').toLowerCase();
  if (status && status !== 'success' && status !== 'ok') {
    console.error('[sms:arkesel] Gateway rejected SMS:', payload);
    throw new Error(payload.message || 'Arkesel rejected the SMS request');
  }

  console.log(`[sms] Sent SMS to ${toPhone} via Arkesel`);
  return true;
}

async function sendViaTwilio(toPhone: string, message: string): Promise<boolean> {
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER?.trim();

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    return false;
  }

  const auth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');
  const body = new URLSearchParams({
    To: twilioToAddress(toPhone),
    From: twilioPhoneNumber,
    Body: message,
  });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    console.error('[sms:twilio] Error sending SMS:', errorData);
    throw new Error((errorData?.message as string) || `Twilio HTTP ${res.status}`);
  }

  console.log(`[sms] Sent SMS to ${toPhone} via Twilio`);
  return true;
}

async function sendViaHubtel(toPhone: string, message: string): Promise<boolean> {
  const clientId = process.env.HUBTEL_CLIENT_ID?.trim();
  const clientSecret = process.env.HUBTEL_CLIENT_SECRET?.trim();
  const senderId = process.env.HUBTEL_SENDER_ID?.trim() || 'ANIPlatform';

  if (!clientId || !clientSecret) {
    return false;
  }

  const params = new URLSearchParams({
    clientid: clientId,
    clientsecret: clientSecret,
    from: senderId,
    to: hubtelToAddress(toPhone),
    content: message,
  });

  const res = await fetch(`https://smsc.hubtel.com/v1/messages/send?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    console.error('[sms:hubtel] Error sending SMS:', errorText || res.status);
    throw new Error(errorText || `Hubtel HTTP ${res.status}`);
  }

  const payload = (await res.json().catch(() => ({}))) as { status?: number; message?: string };
  if (payload.status !== undefined && payload.status !== 0) {
    console.error('[sms:hubtel] Gateway rejected SMS:', payload);
    throw new Error(payload.message || 'Hubtel rejected the SMS request');
  }

  console.log(`[sms] Sent SMS to ${toPhone} via Hubtel`);
  return true;
}

async function sendViaCustomGateway(toPhone: string, message: string): Promise<boolean> {
  const smsApiKey = process.env.SMS_API_KEY?.trim();
  const smsApiUrl = process.env.SMS_API_URL?.trim();
  const smsSenderId = process.env.SMS_SENDER_ID?.trim() || PLATFORM_NAME;

  if (!smsApiKey || !smsApiUrl) {
    return false;
  }

  const res = await fetch(smsApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${smsApiKey}`,
    },
    body: JSON.stringify({
      to: toPhone,
      from: smsSenderId,
      message,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    console.error('[sms:custom] Error sending SMS:', errorText || res.status);
    throw new Error(errorText || `SMS gateway HTTP ${res.status}`);
  }

  console.log(`[sms] Sent SMS to ${toPhone} via custom gateway`);
  return true;
}

export async function sendSmsOtp(toPhone: string, code: number): Promise<SmsSendResult> {
  const formattedCode = String(code).padStart(4, '0');
  const message = `Your ${PLATFORM_NAME} verification code is: ${formattedCode}. Expires in 15 minutes.`;

  const providers: Array<{ name: SmsProviderName; send: () => Promise<boolean> }> = [
    { name: 'arkesel', send: () => sendViaArkesel(toPhone, message) },
    { name: 'hubtel', send: () => sendViaHubtel(toPhone, message) },
    { name: 'twilio', send: () => sendViaTwilio(toPhone, message) },
    { name: 'custom', send: () => sendViaCustomGateway(toPhone, message) },
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      const sent = await provider.send();
      if (sent) {
        return { sent: true, provider: provider.name };
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('SMS send failed');
      console.error(`[sms:${provider.name}] Failed:`, lastError.message);
    }
  }

  if (!allowDevFallback()) {
    throw lastError ?? new Error(
      'SMS is not configured. Set ARKESEL_API_KEY on the server (see backend/.env.example).'
    );
  }

  console.log(`[sms:dev] Verification code for ${toPhone} → ${formattedCode}`);
  return { sent: false, devMode: true, devCode: formattedCode };
}

export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.ARKESEL_API_KEY?.trim() ||
      (process.env.HUBTEL_CLIENT_ID?.trim() && process.env.HUBTEL_CLIENT_SECRET?.trim()) ||
      (process.env.TWILIO_ACCOUNT_SID?.trim() &&
        process.env.TWILIO_AUTH_TOKEN?.trim() &&
        process.env.TWILIO_PHONE_NUMBER?.trim()) ||
      (process.env.SMS_API_KEY?.trim() && process.env.SMS_API_URL?.trim())
  );
}
