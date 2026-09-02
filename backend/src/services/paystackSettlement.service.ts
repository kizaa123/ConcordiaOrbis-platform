import { AppError } from '../utils/errors';
import { getPaymentProvider, getPaystackProvider } from './payment.provider';
import { paystackAmountMatches } from './paystack.provider';
import { paymentService } from './payment.service';
import { orderService } from './order.service';
import { researcherService } from './researcher.service';

export type SettledPayment = {
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  kind?: string;
  returnTo: string;
  message: string;
  reference: string;
  orderId?: string;
  farmerId?: string;
  publicationId?: string;
};

export async function settlePaystackReference(reference: string): Promise<SettledPayment> {
  const verified = await getPaymentProvider().verifyPayment(reference);
  if (verified.status !== 'COMPLETED') {
    return {
      status: verified.status,
      returnTo: '/marketplace',
      message:
        verified.status === 'FAILED'
          ? 'Payment did not go through. You were not charged.'
          : 'Payment is still pending. If you paid, wait a moment and refresh.',
      reference,
    };
  }

  const meta = verified.metadata ?? {};
  const kind = meta.kind;
  const userId = meta.userId;
  const paymentMethod = meta.paymentMethod || verified.channel || 'paystack';
  const expectedAmount = Number(meta.amount);

  if (!kind || !userId) {
    throw new AppError(400, 'This Paystack payment is missing checkout details.', 'PAYSTACK_METADATA');
  }

  if (Number.isFinite(expectedAmount) && !paystackAmountMatches(expectedAmount, verified.amountPesewas)) {
    await getPaystackProvider().refund(reference, 'Amount mismatch');
    throw new AppError(402, 'Paid amount did not match the checkout total. The charge is being reversed.');
  }

  try {
    if (kind === 'FARM_ACCESS') {
      const farmerId = meta.farmerId;
      if (!farmerId) throw new AppError(400, 'Farm access checkout is incomplete.');
      const data = await paymentService.fulfillFarmAccess({
        buyerId: userId,
        farmerId,
        transactionId: reference,
        paymentMethod,
      });
      return {
        status: 'COMPLETED',
        kind,
        returnTo: meta.returnTo || '/marketplace',
        message: data.message,
        reference,
        farmerId,
      };
    }

    if (kind === 'PRODUCT_ORDER') {
      const listingId = meta.listingId;
      const quantity = Number(meta.quantity);
      if (!listingId || !Number.isFinite(quantity) || quantity <= 0) {
        throw new AppError(400, 'Product checkout is incomplete.');
      }
      const data = await orderService.fulfillProductOrder({
        buyerId: userId,
        listingId,
        quantity,
        transactionId: reference,
        paymentMethod,
      });
      return {
        status: 'COMPLETED',
        kind,
        returnTo: meta.returnTo || '/orders',
        message: data.message,
        reference,
        orderId: data.orderId,
      };
    }

    if (kind === 'RESEARCH_PURCHASE') {
      const publicationId = meta.publicationId;
      if (!publicationId) throw new AppError(400, 'Publication checkout is incomplete.');
      const data = await researcherService.fulfillResearchPurchase({
        studentId: userId,
        publicationId,
        transactionId: reference,
        paymentMethod,
      });
      return {
        status: 'COMPLETED',
        kind,
        returnTo: meta.returnTo || '/library',
        message: data.message,
        reference,
        publicationId,
      };
    }

    if (kind === 'ACCESS_PACKAGE') {
      const packageId = meta.packageId;
      if (!packageId) throw new AppError(400, 'Access package checkout is incomplete.');
      const data = await paymentService.fulfillAccessPackage({
        buyerId: userId,
        packageId,
        transactionId: reference,
        paymentMethod,
      });
      return {
        status: 'COMPLETED',
        kind,
        returnTo: meta.returnTo || '/dashboard',
        message: data.message,
        reference,
      };
    }
  } catch (error) {
    if (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500) {
      await getPaystackProvider().refund(reference, error.message);
    }
    throw error;
  }

  throw new AppError(400, 'Unknown Paystack checkout type.');
}
