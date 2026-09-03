import { z } from 'zod';
import prisma from '../database/prisma';
import { AppError, assertFound, assertAuthorized } from '../utils/errors';
import { isFarmerRole, isMarketplaceBuyerRole, canPurchaseFromMarketplace } from '../constants/roles';
import { checkoutRedirect, loadPayer, startCheckout } from './payment.checkout';
import { notifyFarmAccessPaid } from './notification.service';
import { FARM_ACCESS_PRICE_GHC } from '../constants/pricing';
import {
  computeFarmAccessExpiry,
  getFarmerOrderableListings,
  isFarmAccessRecordValid,
  resolveFarmAccessCycleId,
} from './farmAccess.service';

export const purchaseSchema = z.object({
  packageId: z.string().uuid(),
  paymentMethod: z.string().min(2).optional().default('paystack'),
});

export const packageSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  durationDays: z.number().int().positive(),
});

export const purchaseFarmAccessSchema = z.object({
  farmerId: z.string().uuid(),
  paymentMethod: z.string().min(2).optional().default('paystack'),
});

export class PaymentService {
  async getPackages() {
    return prisma.accessPackage.findMany({ orderBy: { price: 'asc' } });
  }

  async getAccessStatus(buyerId: string) {
    const access = await prisma.buyerAccess.findFirst({
      where: { buyerId, status: 'ACTIVE', endDate: { gte: new Date() } },
      include: { package: true },
      orderBy: { endDate: 'desc' },
    });
    return { hasAccess: !!access, access };
  }

  async purchase(buyerId: string, roleId: number, data: z.infer<typeof purchaseSchema>) {
    assertAuthorized(isMarketplaceBuyerRole(roleId), 'Only buyers and researchers can purchase access packages');

    const pkg = assertFound(
      await prisma.accessPackage.findUnique({ where: { id: data.packageId } }),
      'Access package not found'
    );

    const paymentMethod = data.paymentMethod || 'paystack';
    const payer = await loadPayer(buyerId);
    const result = await startCheckout({
      userId: buyerId,
      email: payer.email,
      amount: pkg.price,
      packageId: pkg.id,
      paymentMethod,
      type: 'ACCESS_PACKAGE',
      metadata: {
        kind: 'ACCESS_PACKAGE',
        userId: buyerId,
        packageId: pkg.id,
        amount: String(pkg.price),
        paymentMethod,
        returnTo: '/dashboard',
      },
    });

    const redirect = checkoutRedirect(result);
    if (redirect) return redirect;

    return this.fulfillAccessPackage({
      buyerId,
      packageId: pkg.id,
      transactionId: result.transactionId,
      paymentMethod,
    });
  }

  async fulfillAccessPackage(input: {
    buyerId: string;
    packageId: string;
    transactionId: string;
    paymentMethod: string;
  }) {
    const existing = await prisma.payment.findUnique({
      where: { transactionId: input.transactionId },
    });
    if (existing?.status === 'COMPLETED') {
      const access = await prisma.buyerAccess.findFirst({
        where: { buyerId: input.buyerId, packageId: input.packageId },
        include: { package: true },
        orderBy: { endDate: 'desc' },
      });
      return { payment: existing, access, message: 'Access already activated' };
    }

    const pkg = assertFound(
      await prisma.accessPackage.findUnique({ where: { id: input.packageId } }),
      'Access package not found'
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + pkg.durationDays);

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId: input.buyerId,
          amount: pkg.price,
          paymentMethod: input.paymentMethod,
          transactionId: input.transactionId,
          status: 'COMPLETED',
          packageId: pkg.id,
        },
      });

      const access = await tx.buyerAccess.create({
        data: {
          buyerId: input.buyerId,
          packageId: pkg.id,
          startDate,
          endDate,
          status: 'ACTIVE',
        },
        include: { package: true },
      });

      return { payment, access, message: `Access activated for ${pkg.durationDays} days` };
    });
  }

  async paymentHistory(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: { package: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async allPayments() {
    return prisma.payment.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPackage(data: z.infer<typeof packageSchema>) {
    return prisma.accessPackage.create({ data });
  }

  async purchaseFarmAccess(buyerId: string, roleId: number, data: z.infer<typeof purchaseFarmAccessSchema>) {
    assertAuthorized(canPurchaseFromMarketplace(roleId), 'Only marketplace purchasers can purchase farm access');

    if (data.farmerId === buyerId) {
      throw new AppError(400, 'You cannot purchase access to your own farm');
    }

    const farmer = assertFound(
      await prisma.user.findUnique({
        where: { id: data.farmerId },
        include: { farmerProfile: true },
      }),
      'Farmer not found'
    );
    assertAuthorized(isFarmerRole(farmer.roleId), 'Target user is not a farmer');
    assertAuthorized(!!farmer.farmerProfile, 'Farmer profile not found');

    const orderableListings = await getFarmerOrderableListings(data.farmerId);
    if (orderableListings.length === 0) {
      throw new AppError(
        400,
        'This farm has no products available right now. Access can only be purchased during an active harvest period.'
      );
    }

    const farmerProfile = farmer.farmerProfile!;
    const farmerAccessCycleId = resolveFarmAccessCycleId(
      farmerProfile.farmAccessCycleId,
      farmerProfile.id
    );

    const existing = await prisma.buyerFarmerAccess.findUnique({
      where: { buyerId_farmerId: { buyerId, farmerId: data.farmerId } },
    });
    const newestListing = await prisma.commodityListing.findFirst({
      where: {
        farmer: { userId: data.farmerId },
        status: { in: ['ACTIVE', 'SOLD'] },
      },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    if (
      existing?.status === 'COMPLETED' &&
      isFarmAccessRecordValid(
        existing,
        farmerAccessCycleId,
        computeFarmAccessExpiry(orderableListings),
        newestListing?.createdAt ?? null
      )
    ) {
      throw new AppError(409, 'You already have access to this farm');
    }

    const farmAccessPrice = FARM_ACCESS_PRICE_GHC;
    const paymentMethod = data.paymentMethod || 'paystack';
    const payer = await loadPayer(buyerId);
    const result = await startCheckout({
      userId: buyerId,
      email: payer.email,
      amount: farmAccessPrice,
      paymentMethod,
      referenceId: data.farmerId,
      type: 'FARM_ACCESS',
      metadata: {
        kind: 'FARM_ACCESS',
        userId: buyerId,
        farmerId: data.farmerId,
        amount: String(farmAccessPrice),
        paymentMethod,
        returnTo: '/marketplace',
      },
    });

    const redirect = checkoutRedirect(result);
    if (redirect) return redirect;

    return this.fulfillFarmAccess({
      buyerId,
      farmerId: data.farmerId,
      transactionId: result.transactionId,
      paymentMethod,
    });
  }

  async fulfillFarmAccess(input: {
    buyerId: string;
    farmerId: string;
    transactionId: string;
    paymentMethod: string;
  }) {
    const existingPaid = await prisma.buyerFarmerAccess.findFirst({
      where: { transactionId: input.transactionId, status: 'COMPLETED' },
    });
    if (existingPaid) {
      return {
        farmAccess: existingPaid,
        message: 'Farm access is already active',
        amountPaid: existingPaid.amount,
        farmerName: '',
        pendingApproval: false,
        accessGranted: true,
      };
    }

    if (input.farmerId === input.buyerId) {
      throw new AppError(400, 'You cannot purchase access to your own farm');
    }

    const farmer = assertFound(
      await prisma.user.findUnique({
        where: { id: input.farmerId },
        include: { farmerProfile: true },
      }),
      'Farmer not found'
    );
    assertAuthorized(isFarmerRole(farmer.roleId), 'Target user is not a farmer');
    assertAuthorized(!!farmer.farmerProfile, 'Farmer profile not found');

    const orderableListings = await getFarmerOrderableListings(input.farmerId);
    if (orderableListings.length === 0) {
      throw new AppError(
        400,
        'This farm has no products available right now. Access can only be purchased during an active harvest period.'
      );
    }

    const farmerProfile = farmer.farmerProfile!;
    const accessCycleId = resolveFarmAccessCycleId(farmerProfile.farmAccessCycleId, farmerProfile.id);
    const farmAccessPrice = FARM_ACCESS_PRICE_GHC;
    const accessExpiresAt = computeFarmAccessExpiry(orderableListings);

    const current = await prisma.buyerFarmerAccess.findUnique({
      where: { buyerId_farmerId: { buyerId: input.buyerId, farmerId: input.farmerId } },
    });
    if (
      current?.status === 'COMPLETED' &&
      current.transactionId !== input.transactionId &&
      isFarmAccessRecordValid(current, accessCycleId, accessExpiresAt)
    ) {
      throw new AppError(409, 'You already have access to this farm');
    }

    const txResult = await prisma.$transaction(async (tx) => {
      const farmAccess = await tx.buyerFarmerAccess.upsert({
        where: { buyerId_farmerId: { buyerId: input.buyerId, farmerId: input.farmerId } },
        create: {
          buyerId: input.buyerId,
          farmerId: input.farmerId,
          amount: farmAccessPrice,
          paymentMethod: input.paymentMethod,
          transactionId: input.transactionId,
          status: 'COMPLETED',
          expiresAt: accessExpiresAt,
          accessCycleId,
        },
        update: {
          amount: farmAccessPrice,
          paymentMethod: input.paymentMethod,
          transactionId: input.transactionId,
          status: 'COMPLETED',
          expiresAt: accessExpiresAt,
          accessCycleId,
          createdAt: new Date(),
        },
      });

      await tx.connectionRequest.upsert({
        where: { buyerId_farmerId: { buyerId: input.buyerId, farmerId: input.farmerId } },
        create: { buyerId: input.buyerId, farmerId: input.farmerId, status: 'ACCEPTED' },
        update: { status: 'ACCEPTED' },
      });

      return {
        farmAccess,
        message: `Access granted. You can now view ${farmer.firstName}'s farm and products`,
        amountPaid: farmAccessPrice,
        farmerName: `${farmer.firstName} ${farmer.lastName}`,
        pendingApproval: false,
        accessGranted: true,
      };
    });

    const buyer = await prisma.user.findUnique({
      where: { id: input.buyerId },
      select: { firstName: true, lastName: true, country: true },
    });
    const buyerName = buyer ? `${buyer.firstName} ${buyer.lastName}` : 'A buyer';
    await notifyFarmAccessPaid(
      input.buyerId,
      input.farmerId,
      buyerName,
      `${farmer.firstName} ${farmer.lastName}`,
      farmAccessPrice,
      true,
      buyer?.country
    );

    return txResult;
  }
}

export const paymentService = new PaymentService();
