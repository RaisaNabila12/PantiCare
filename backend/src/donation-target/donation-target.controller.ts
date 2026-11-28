import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';

import { DonationTargetService } from './donation-target.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('donation-target')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonationTargetController {
  constructor(
    private readonly donationTargetService: DonationTargetService,
  ) {}

  @Get()
  @Roles('ADMIN', 'USER')
  findCurrent() {
    return this.donationTargetService.findCurrent();
  }

  @Put()
  @Roles('ADMIN')
  update(
    @Body() body: {
      title: string;
      targetAmount: unknown;
    },
  ) {
    const title = body?.title?.trim();
    const targetAmount = Number(body?.targetAmount);

    if (!title) {
      throw new BadRequestException(
        'Judul target donasi wajib diisi',
      );
    }

    if (
      body?.targetAmount === undefined ||
      body?.targetAmount === null ||
      body?.targetAmount === '' ||
      !Number.isSafeInteger(targetAmount) ||
      targetAmount <= 0
    ) {
      throw new BadRequestException(
        'Nominal target harus berupa bilangan bulat lebih dari 0',
      );
    }

    return this.donationTargetService.update(
      title,
      targetAmount,
    );
  }
}