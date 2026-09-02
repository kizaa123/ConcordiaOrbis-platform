import prisma from '../database/prisma';
import { AppError, assertFound } from '../utils/errors';
import { getPaymentProvider, isLivePaystackCheckout } from './payment.provider';
import type { PaymentInitRequest, PaymentResult } from './payment.types';

export async function loadPayer(userId: string) {
  return assertFound(
    await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    }),
    'User not found'
  );
}

export async function startCheckout(request: PaymentInitRequest): Promise<PaymentResult> {
  return getPaymentProvider().initiatePayment(request);
}

export function checkoutRedirect(result: PaymentResult) {
  if (isLivePaystackCheckout(result) && result.authorizationUrl) {
    return {
      pending: true as const,
      checkoutUrl: result.authorizationUrl,
      reference: result.transactionId,
    };
  }
  if (result.status === 'FAILED') {
    throw new AppError(402, 'Payment failed');
  }
  return null;
}
