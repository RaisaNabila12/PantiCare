import { Module } from '@nestjs/common';
import { DonationsModule } from './donations/donations.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ChildrenModule } from './children/children.module.js';

@Module({
  imports: [
  PrismaModule,
  AuthModule,
  UsersModule,
  ChildrenModule,
  DonationsModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
