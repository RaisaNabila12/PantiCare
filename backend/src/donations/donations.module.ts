
import { Module } from '@nestjs/common';
import { DonationsController } from './donations.controller.js';
import { DonationsService } from './donations.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule {}
