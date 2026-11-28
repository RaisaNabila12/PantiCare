import { Module } from '@nestjs/common';

import { DonationTargetController } from './donation-target.controller.js';
import { DonationTargetService } from './donation-target.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DonationTargetController],
  providers: [DonationTargetService],
})
export class DonationTargetModule {}