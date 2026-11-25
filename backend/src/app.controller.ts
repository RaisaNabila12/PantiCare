
import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';
import { RolesGuard } from './auth/roles.guard.js';
import { Roles } from './auth/roles.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile-test')
  getProfile(@Request() req: any) {
    return {
      message: 'Token valid, akses berhasil!',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin-test')
  getAdmin() {
    return {
      message: 'Akses ADMIN berhasil!',
    };
  }
}
