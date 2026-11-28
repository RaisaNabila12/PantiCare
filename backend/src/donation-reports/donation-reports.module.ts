import { Module } from '@nestjs/common';

import { DonationReportsController } from './donation-reports.controller.js';
import { DonationReportsService } from './donation-reports.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DonationReportsController],
  providers: [DonationReportsService],
})
export class DonationReportsModule {}