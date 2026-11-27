
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ChildrenService } from './children.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('children')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  // ADMIN dan USER dapat melihat semua data anak
  @Get()
  @Roles('ADMIN', 'USER')
  findAll() {
    return this.childrenService.findAll();
  }

  // ADMIN dan USER dapat melihat detail anak
  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.childrenService.findOne(id);
  }

  // Hanya ADMIN dapat menambahkan data anak
  @Post()
  @Roles('ADMIN')
  create(@Body() body: {
    name: string;
    age: number;
    educationLevel: string;
    grade: string;
    admissionDate: string;
    status?: string;
  }) {
    return this.childrenService.create(body);
  }

  // Hanya ADMIN dapat mengubah data anak
  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      name?: string;
      age?: number;
      educationLevel?: string;
      grade?: string;
      admissionDate?: string;
      status?: string;
    },
  ) {
    return this.childrenService.update(id, body);
  }

  // Hanya ADMIN dapat menghapus data anak
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.childrenService.remove(id);
  }
}
