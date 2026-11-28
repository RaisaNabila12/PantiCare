import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  // ADMIN dapat melihat semua donasi.
  // USER hanya dapat melihat donasi miliknya sendiri.
  async findAll(userId: number, role: string) {
    return this.prisma.donation.findMany({
      where: role === 'ADMIN' ? {} : { userId },
      select: {
        id: true,
        userId: true,
        amount: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ADMIN dapat melihat semua detail donasi.
  // USER hanya dapat melihat detail donasi miliknya sendiri.
  async findOne(id: number, userId: number, role: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        amount: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!donation) {
      throw new NotFoundException('Donasi tidak ditemukan');
    }

    if (role !== 'ADMIN' && donation.userId !== userId) {
      throw new ForbiddenException(
        'Kamu tidak memiliki akses ke donasi ini',
      );
    }

    return donation;
  }

  // Membuat donasi baru.
  async create(
    userId: number,
    amount: number,
    paymentMethod: string,
  ) {
    return this.prisma.donation.create({
      data: {
        userId,
        amount,
        paymentMethod,
        status: 'PENDING',
      },
      select: {
        id: true,
        userId: true,
        amount: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // Memastikan pengguna boleh mengunggah bukti untuk donasi ini.
  async assertCanUploadProof(id: number, userId: number) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!donation) {
      throw new NotFoundException('Donasi tidak ditemukan');
    }

    if (donation.userId !== userId) {
      throw new ForbiddenException(
        'Kamu tidak memiliki akses ke donasi ini',
      );
    }

    if (donation.status !== 'PENDING') {
      throw new BadRequestException(
        'Bukti pembayaran hanya dapat diunggah untuk donasi berstatus PENDING',
      );
    }
  }

  // Mengunggah bukti pembayaran.
  async uploadProof(id: number, userId: number, proofUrl: string) {
    await this.assertCanUploadProof(id, userId);

    return this.prisma.donation.update({
      where: { id },
      data: { proofUrl },
      select: {
        id: true,
        userId: true,
        amount: true,
        status: true,
        proofUrl: true,
        updatedAt: true,
      },
    });
  }

  // Hanya pemilik donasi atau ADMIN yang boleh mengambil lokasi file bukti.
  async getProofPath(id: number, userId: number, role: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      select: {
        userId: true,
        proofUrl: true,
      },
    });

    if (!donation) {
      throw new NotFoundException('Donasi tidak ditemukan');
    }

    if (role !== 'ADMIN' && donation.userId !== userId) {
      throw new ForbiddenException(
        'Kamu tidak memiliki akses ke bukti donasi ini',
      );
    }

    if (!donation.proofUrl) {
      throw new NotFoundException('Bukti transfer belum diunggah');
    }

    return donation.proofUrl;
  }

  // Hanya ADMIN yang dapat mengubah status melalui controller.
  async updateStatus(id: number, status: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!donation) {
      throw new NotFoundException('Donasi tidak ditemukan');
    }

    return this.prisma.donation.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        userId: true,
        amount: true,
        status: true,
        updatedAt: true,
      },
    });
  }
}