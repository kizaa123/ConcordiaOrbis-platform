import { createHmac, timingSafeEqual } from 'crypto';
import { AppError } from '../utils/errors';
import { getPaystackConfig, toPaystackAmount } from '../config/paystack.config';
import type { PaymentInitRequest, PaymentProvider, PaymentResult } from './payment.types';

const PAYSTACK_API = 'https://api.paystack.co';

interface PaystackApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface PaystackInitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface PaystackVerifyData {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  metadata?: Record<string, unknown> | null;
}

function flattenMetadata(raw: Record<string, unknown> | null | undefined): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value == null || key === 'custom_fields') continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[key] = String(value);
    }
  }
  return out;
}

export class PaystackPaymentProvider implements PaymentProvider {
  readonly name = 'paystack';

  async initiatePayment(request: PaymentInitRequest): Promise<PaymentResult> {
    const config = getPaystackConfig();
    if (!config.enabled) {
      throw new AppError(503, 'Paystack is not configured.', 'PAYSTACK_NOT_CONFIGURED');
    }

    const reference = `co_${Date.now()}_${request.userId.slice(0, 8)}`;
    const data = await this.request<PaystackInitializeData>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: request.email,
        amount: toPaystackAmount(request.amount),
        currency: config.currency,
        reference,
        callback_url: config.callbackUrl,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        metadata: {
          ...request.metadata,
          userId: request.userId,
          kind: request.type,
          paymentMethod: request.paymentMethod,
          cancel_action: config.callbackUrl,
        },
      }),
    });

    return {
      transactionId: data.reference,
      status: 'PENDING',
      authorizationUrl: data.authorization_url,
      accessCode: data.access_code,
      providerReference: data.access_code,
      metadata: request.metadata,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    const data = await this.request<PaystackVerifyData>(
      `/transaction/verify/${encodeURIComponent(transactionId)}`,
      { method: 'GET' }
    );

    const paid = data.status === 'success';
    return {
      transactionId: data.reference,
      status: paid ? 'COMPLETED' : data.status === 'failed' ? 'FAILED' : 'PENDING',
      providerReference: data.reference,
      amountPesewas: data.amount,
      channel: data.channel,
      metadata: flattenMetadata(data.metadata ?? undefined),
    };
  }

  async refund(reference: string, reason: string): Promise<void> {
    try {
      await this.request('/refund', {
        method: 'POST',
        body: JSON.stringify({ transaction: reference, merchant_note: reason.slice(0, 500) }),
      });
    } catch (error) {
      console.error('Paystack refund failed:', error);
    }
  }

  verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
    const secret = getPaystackConfig().secretKey;
    if (!secret || !signature) return false;
    const hash = createHmac('sha512', secret).update(rawBody).digest('hex');
    const expected = Buffer.from(hash, 'utf8');
    const received = Buffer.from(signature, 'utf8');
    if (expected.length !== received.length) return false;
    return timingSafeEqual(expected, received);
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const config = getPaystackConfig();
    const res = await fetch(`${PAYSTACK_API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });

    let json: PaystackApiResponse<T>;
    try {
      json = (await res.json()) as PaystackApiResponse<T>;
    } catch {
      throw new AppError(502, 'Paystack did not return a valid response.', 'PAYSTACK_ERROR');
    }

    if (!res.ok || !json.status) {
      throw new AppError(502, json.message || 'Paystack request failed.', 'PAYSTACK_ERROR');
    }
    return json.data;
  }
}

export function paystackAmountMatches(expectedGhs: number, paidPesewas: number | undefined): boolean {
  if (paidPesewas == null) return true;
  return Math.abs(paidPesewas - Math.round(expectedGhs * 100)) <= 1;
}
