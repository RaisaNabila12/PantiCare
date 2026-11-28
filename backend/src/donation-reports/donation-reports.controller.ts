import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { DonationReportsService } from './donation-reports.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('donation-reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DonationReportsController {
  constructor(
    private readonly donationReportsService: DonationReportsService,
  ) {}

  // GET ringkasan utama laporan
  @Get()
  getSummary() {
    return this.donationReportsService.getSummary();
  }

  // GET tren donasi enam bulan terakhir
  @Get('monthly')
  getMonthlyReport() {
    return this.donationReportsService.getMonthlyReport();
  }

  // GET rekap berdasarkan status
  @Get('status')
  getStatusReport() {
    return this.donationReportsService.getStatusReport();
  }

  // GET rekap berdasarkan metode pembayaran
  @Get('payment-method')
  getPaymentMethodReport() {
    return this.donationReportsService.getPaymentMethodReport();
  }

  // GET seluruh transaksi untuk tabel laporan
  @Get('transactions')
  getTransactions() {
    return this.donationReportsService.getTransactions();
  }
}