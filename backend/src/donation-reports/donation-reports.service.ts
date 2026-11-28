import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DonationReportsService {
    constructor(private prisma: PrismaService) {}

  // Ringkasan utama laporan donasi
  async getSummary() {
    const [verified, totalTransactions, largestDonation] =
      await Promise.all([
        this.prisma.donation.aggregate({
          where: { status: 'VERIFIED' },
          _sum: { amount: true },
          _avg: { amount: true },
          _count: { id: true },
        }),
        this.prisma.donation.count(),
        this.prisma.donation.findFirst({
          where: { status: 'VERIFIED' },
          orderBy: { amount: 'desc' },
          select: {
            amount: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

    return {
      totalDonations: verified._sum.amount ?? 0,
      totalTransactions,
      averageDonation: verified._avg.amount ?? 0,
      largestDonation: largestDonation?.amount ?? 0,
      largestDonor: largestDonation?.user.name ?? '-',
    };
  }

  // Tren donasi enam bulan terakhir
  async getMonthlyReport() {
    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1,
    );

    const donations = await this.prisma.donation.findMany({
      where: {
        status: 'VERIFIED',
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - 5 + index,
        1,
      );

      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        total: 0,
        transactions: 0,
      };
    });

    for (const donation of donations) {
      const month = months.find(
        (item) =>
          item.year === donation.createdAt.getFullYear() &&
          item.month === donation.createdAt.getMonth() + 1,
      );

      if (month) {
        month.total += donation.amount;
        month.transactions += 1;
      }
    }

    return months;
  }

  // Rekap berdasarkan status
  async getStatusReport() {
    const statuses = ['VERIFIED', 'PENDING', 'REJECTED'];

    const results = await Promise.all(
      statuses.map(async (status) => ({
        status,
        total: await this.prisma.donation.count({
          where: { status },
        }),
      })),
    );

    return results;
  }

  // Rekap berdasarkan metode pembayaran
  async getPaymentMethodReport() {
    const donations = await this.prisma.donation.findMany({
      where: {
        status: 'VERIFIED',
      },
      select: {
        amount: true,
        paymentMethod: true,
      },
    });

    const result = new Map<
      string,
      { paymentMethod: string; total: number; transactions: number }
    >();

    for (const donation of donations) {
      const method = donation.paymentMethod ?? 'Tidak diketahui';
      const current = result.get(method) ?? {
        paymentMethod: method,
        total: 0,
        transactions: 0,
      };

      current.total += donation.amount;
      current.transactions += 1;

      result.set(method, current);
    }

    return Array.from(result.values());
  }

  // Daftar transaksi untuk tabel laporan
  async getTransactions() {
    const donations = await this.prisma.donation.findMany({
      select: {
        id: true,
        amount: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

   return donations.map((donation: {
  id: number;
  amount: number;
  paymentMethod: string | null;
  status: string;
  createdAt: Date;
  user: {
    name: string;
  };
}) => ({
  id: donation.id,
  amount: donation.amount,
  paymentMethod: donation.paymentMethod ?? 'Tidak diketahui',
  status: donation.status,
  createdAt: donation.createdAt,
  donorName: donation.user.name,
}));
  }
}