import { randomBytes } from 'crypto';
import { AppError } from '../utils/errors';
import { getPaystackConfig } from '../config/paystack.config';
import { PaystackPaymentProvider } from './paystack.provider';
import type { PaymentInitRequest, PaymentProvider, PaymentResult } from './payment.types';

export type { PaymentInitRequest, PaymentKind, PaymentProvider, PaymentResult } from './payment.types';
export { isLivePaystackCheckout } from './payment.types';

function mockReference(userId: string) {
  return `MOCK-${Date.now()}-${userId.slice(0, 6).toUpperCase()}-${randomBytes(2).toString('hex')}`;
}

/** Local/dev provider: marks the charge complete immediately (no Paystack keys). */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';

  async initiatePayment(request: PaymentInitRequest): Promise<PaymentResult> {
    const transactionId = mockReference(request.userId);
    return {
      transactionId,
      status: 'COMPLETED',
      providerReference: transactionId,
      metadata: request.metadata,
      channel: request.paymentMethod,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return { transactionId, status: 'COMPLETED', providerReference: transactionId };
  }
}

const mockProvider = new MockPaymentProvider();
const paystackProvider = new PaystackPaymentProvider();

export function getPaymentProvider(): PaymentProvider {
  const config = getPaystackConfig();
  if (config.enabled) return paystackProvider;
  if (process.env.NODE_ENV === 'production') {
    throw new AppError(
      503,
      'Paystack is not configured. Set PAYSTACK_SECRET_KEY on the API.',
      'PAYSTACK_NOT_CONFIGURED'
    );
  }
  return mockProvider;
}

export function getPaystackProvider(): PaystackPaymentProvider {
  return paystackProvider;
}
