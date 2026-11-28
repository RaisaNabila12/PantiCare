import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DonationTargetService {
  constructor(private prisma: PrismaService) {}

  async findCurrent() {
    const target = await this.prisma.donationTarget.findUnique({
      where: { id: 1 },
    });

    if (!target) {
      throw new NotFoundException(
        'Target donasi belum dibuat',
      );
    }

    const aggregate = await this.prisma.donation.aggregate({
      where: { status: 'VERIFIED' },
      _sum: { amount: true },
    });

    const collectedAmount = aggregate._sum.amount ?? 0;

    const percentage =
      target.targetAmount > 0
        ? Math.min(
            100,
            Number(
              (collectedAmount / target.targetAmount * 100).toFixed(2),
            ),
          )
        : 0;

    return {
      id: target.id,
      title: target.title,
      targetAmount: target.targetAmount,
      collectedAmount,
      percentage,
      updatedAt: target.updatedAt,
    };
  }

  async update(title: string, targetAmount: number) {
    return this.prisma.donationTarget.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        title,
        targetAmount,
      },
      update: {
        title,
        targetAmount,
      },
    });
  }
}