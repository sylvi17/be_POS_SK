import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWarehouseDto) {
    try {
      return await this.prisma.warehouse.create({ data: dto });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.warehouse.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const data = await this.prisma.warehouse.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Warehouse ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateWarehouseDto) {
    try {
      return await this.prisma.warehouse.update({ where: { id }, data: dto });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Ditolak (400 Invalid reference) bila sudah dipakai transaksi stok.
  async remove(id: number) {
    try {
      return await this.prisma.warehouse.delete({ where: { id } });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  private handleError(e: unknown, id?: number): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          throw new BadRequestException('Code already exists');
        case 'P2003':
          throw new BadRequestException('Invalid reference');
        case 'P2025':
          throw new NotFoundException(`Warehouse ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}