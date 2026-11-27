
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  // Menampilkan semua data anak
  async findAll() {
    return this.prisma.child.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Menampilkan detail anak berdasarkan ID
  async findOne(id: number) {
    const child = await this.prisma.child.findUnique({
      where: { id },
    });

    if (!child) {
      throw new NotFoundException('Data anak tidak ditemukan');
    }

    return child;
  }

  // Menambahkan data anak
  async create(data: {
    name: string;
    age: number;
    educationLevel: string;
    grade: string;
    admissionDate: string;
    status?: string;
  }) {
    return this.prisma.child.create({
      data: {
        name: data.name,
        age: data.age,
        educationLevel: data.educationLevel,
        grade: data.grade,
        admissionDate: new Date(data.admissionDate),
        status: data.status ?? 'ACTIVE',
      },
    });
  }

  // Mengubah data anak
  async update(
    id: number,
    data: {
      name?: string;
      age?: number;
      educationLevel?: string;
      grade?: string;
      admissionDate?: string;
      status?: string;
    },
  ) {
    await this.findOne(id);

    return this.prisma.child.update({
      where: { id },
      data: {
        ...data,
        admissionDate: data.admissionDate
          ? new Date(data.admissionDate)
          : undefined,
      },
    });
  }

  // Menghapus data anak
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.child.delete({
      where: { id },
    });
  }
}
