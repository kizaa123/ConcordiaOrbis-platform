export type PaymentKind = 'ACCESS_PACKAGE' | 'FARM_ACCESS' | 'PRODUCT_ORDER' | 'RESEARCH_PURCHASE';

export interface PaymentInitRequest {
  userId: string;
  email: string;
  amount: number;
  paymentMethod: string;
  packageId?: string;
  referenceId?: string;
  type: PaymentKind;
  metadata: Record<string, string>;
}

export interface PaymentResult {
  transactionId: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  authorizationUrl?: string;
  accessCode?: string;
  providerReference?: string;
  amountPesewas?: number;
  channel?: string;
  metadata?: Record<string, string>;
}

export interface PaymentProvider {
  readonly name: string;
  initiatePayment(request: PaymentInitRequest): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentResult>;
}

export function isLivePaystackCheckout(result: PaymentResult): boolean {
  return result.status === 'PENDING' && Boolean(result.authorizationUrl || result.accessCode);
}
