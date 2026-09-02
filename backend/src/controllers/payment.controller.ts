import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/response';
import { paymentService } from '../services/payment.service';
import { createAuditLog } from '../middleware/audit.middleware';
import { settlePaystackReference } from '../services/paystackSettlement.service';
import { getPaystackProvider } from '../services/payment.provider';
import { AppError } from '../utils/errors';

export class PaymentController {
  getPackages = async (_req: AuthRequest, res: Response) => {
    try {
      ApiResponse.success(res, await paymentService.getPackages());
    } catch (e) {
      ApiResponse.error(res, e);
    }
  };

  accessStatus = async (req: AuthRequest, res: Response) => {
    try {
      ApiResponse.success(res, await paymentService.getAccessStatus(req.user!.userId));
    } catch (e) {
      ApiResponse.error(res, e);
    }
  };

  purchase = async (req: AuthRequest, res: Response) => {
    try {
      const result = await paymentService.purchase(req.user!.userId, req.user!.roleId, req.body);
      if (!('checkoutUrl' in result && result.checkoutUrl)) {
        await createAuditLog(req, 'ACCESS_PURCHASED', 'buyer_access', { packageId: req.body.packageId });
      }
      ApiResponse.created(res, result);
    } catch (e) {
      ApiResponse.error(res, e);
    }
  };

  history = async (req: AuthRequest, res: Response) => {
    try {
      ApiResponse.success(res, await paymentService.paymentHistory(req.user!.userId));
    } catch (e) {
      ApiResponse.error(res, e);
    }
  };

  allPayments = async (_req: AuthRequest, res: Response) => {
    try {
      ApiResponse.success(res, await paymentService.allPayments());
    } catch (e) {
      ApiResponse.error(res, e);
    }
  };

  purchaseFarmAccess = async (req: AuthRequest, res: Response) => {
    try {
      const result = await paymentService.purchaseFarmAccess(
        req.user!.userId,
        req.user!.roleId,
        req.body
      );
      if (!('checkoutUrl' in result && result.checkoutUrl)) {
        await createAuditLog(req, 'FARM_ACCESS_PURCHASED', 'buyer_farmer_access', {
          farmerId: req.body.farmerId,
        });
      }
      ApiResponse.created(res, result);
    } catch (e) {
      ApiResponse.error(res, e);
    }
  };

  verifyPaystack = async (req: AuthRequest, res: Response) => {
    try {
      const reference = typeof req.query.reference === 'string' ? req.query.reference.trim() : '';
      if (!reference) {
        throw new AppError(400, 'Missing Paystack reference');
      }
      const result = await settlePaystackReference(reference);
      if (result.status === 'COMPLETED') {
        await createAuditLog(req, 'PAYSTACK_SETTLED', 'payments', {
          reference,
          kind: result.kind,
        });
      }
      ApiResponse.success(res, result);
    } catch (e) {
      ApiResponse.error(res, e);
    }
  };

  paystackWebhook = async (req: Request, res: Response) => {
    try {
      const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body ?? {}));
      const signature = req.headers['x-paystack-signature'];
      const sig = Array.isArray(signature) ? signature[0] : signature;
      if (!getPaystackProvider().verifyWebhookSignature(raw, sig)) {
        return res.status(401).json({ success: false, error: 'Invalid Paystack signature' });
      }

      const payload = JSON.parse(raw.toString('utf8')) as { event?: string; data?: { reference?: string } };
      if (payload.event === 'charge.success' && payload.data?.reference) {
        await settlePaystackReference(payload.data.reference);
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('Paystack webhook error:', e);
      return res.status(200).json({ success: true });
    }
  };

  createPackage = async (req: AuthRequest, res: Response) => {
    try {
      const pkg = await paymentService.createPackage(req.body);
      await createAuditLog(req, 'PACKAGE_CREATED', 'access_package');
      ApiResponse.created(res, pkg);
    } catch (e) {
      ApiResponse.error(res, e);
    }
  };
}

export const paymentController = new PaymentController();
