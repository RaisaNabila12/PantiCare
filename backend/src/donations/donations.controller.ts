import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join, resolve, sep } from 'path';
import {
  existsSync,
  mkdirSync,
  createReadStream,
  unlinkSync,
} from 'fs';
import { randomUUID } from 'crypto';

import { DonationsService } from './donations.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

interface AuthenticatedRequest {
  user: {
    id: number;
    role: string;
  };
}

@Controller('donations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
  ) {}

  // GET semua donasi
  @Get()
  @Roles('ADMIN', 'USER')
  findAll(@Req() req: AuthenticatedRequest) {
    return this.donationsService.findAll(
      req.user.id,
      req.user.role,
    );
  }

  // GET detail donasi
  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.donationsService.findOne(
      id,
      req.user.id,
      req.user.role,
    );
  }

  // POST membuat donasi baru
  @Post()
  @Roles('USER')
  create(
    @Req() req: AuthenticatedRequest,
    @Body() body: { amount: unknown },
  ) {
    const amount = Number(body?.amount);

    if (
      body?.amount === undefined ||
      body?.amount === null ||
      body?.amount === '' ||
      !Number.isSafeInteger(amount) ||
      amount <= 0
    ) {
      throw new BadRequestException(
        'Nominal donasi harus berupa bilangan bulat lebih dari 0',
      );
    }

    return this.donationsService.create(
      req.user.id,
      amount,
    );
  }

  // POST upload bukti donasi
  @Post(':id/proof')
  @Roles('USER')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = join(
            process.cwd(),
            'uploads',
            'donations',
          );

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const extension = extname(
            file.originalname,
          ).toLowerCase();

          callback(
            null,
            `${randomUUID()}${extension}`,
          );
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'application/pdf',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Format file harus JPG, PNG, atau PDF',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadProof(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'File bukti donasi wajib diunggah',
      );
    }

    const extension = extname(
      file.originalname,
    ).toLowerCase();

    const validExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.pdf',
    ];

    if (!validExtensions.includes(extension)) {
      unlinkSync(file.path);

      throw new BadRequestException(
        'Format file tidak valid',
      );
    }

    const chunks: Buffer[] = [];

    const stream = createReadStream(file.path);

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    const isJpeg =
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;

    const isPng =
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(
        Buffer.from([
          0x89, 0x50, 0x4e, 0x47,
          0x0d, 0x0a, 0x1a, 0x0a,
        ]),
      );

    const isPdf =
      buffer.length >= 5 &&
      buffer.subarray(0, 5).toString() === '%PDF-';

    const validFile =
      extension === '.jpg' || extension === '.jpeg'
        ? isJpeg
        : extension === '.png'
          ? isPng
          : extension === '.pdf'
            ? isPdf
            : false;

    if (!validFile) {
      unlinkSync(file.path);

      throw new BadRequestException(
        'Isi file tidak sesuai dengan format yang diizinkan',
      );
    }

    const proofUrl = `/uploads/donations/${file.filename}`;

    try {
      return await this.donationsService.uploadProof(
        id,
        req.user.id,
        proofUrl,
      );
    } catch (error) {
      if (existsSync(file.path)) {
        unlinkSync(file.path);
      }

      throw error;
    }
  }

  // GET bukti donasi
  @Get(':id/proof')
  @Roles('ADMIN', 'USER')
  async getProof(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const proofPath =
      await this.donationsService.getProofPath(
        id,
        req.user.id,
        req.user.role,
      );

    const fileName = proofPath.split('/').pop();

    if (!fileName) {
      throw new BadRequestException(
        'Path bukti donasi tidak valid',
      );
    }

    const extension = extname(fileName).toLowerCase();

    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.pdf': 'application/pdf',
    };

    if (!contentTypes[extension]) {
      throw new BadRequestException(
        'Format bukti donasi tidak valid',
      );
    }

    const uploadDirectory = resolve(
      process.cwd(),
      'uploads',
      'donations',
    );

    const absolutePath = resolve(
      uploadDirectory,
      fileName,
    );

    if (
      !absolutePath.startsWith(
        uploadDirectory + sep,
      )
    ) {
      throw new BadRequestException(
        'Path file tidak valid',
      );
    }

    if (!existsSync(absolutePath)) {
      throw new BadRequestException(
        'File bukti donasi tidak ditemukan',
      );
    }

    res.set({
      'Content-Type': contentTypes[extension],
      'Content-Disposition': `inline; filename="${fileName}"`,
      'X-Content-Type-Options': 'nosniff',
    });

    return new StreamableFile(
      createReadStream(absolutePath),
    );
  }

 // PATCH update status donasi (ADMIN saja)
  @Patch(':id/status')
  @Roles('ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    const allowedStatuses = [
      'PENDING',
      'VERIFIED',
      'REJECTED',
    ];

    if (!body?.status) {
      throw new BadRequestException(
        'Status donasi wajib diisi',
      );
    }

    if (!allowedStatuses.includes(body.status)) {
      throw new BadRequestException(
        'Status donasi harus PENDING, VERIFIED, atau REJECTED',
      );
    }

    return this.donationsService.updateStatus(
      id,
      body.status,
    );
  }
}