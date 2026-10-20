import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePriceTypeDto } from './dto/create-price-type.dto';
import { UpdatePriceTypeDto } from './dto/update-price-type.dto';

@Injectable()
export class PriceTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePriceTypeDto) {
    try {
      return await this.prisma.priceType.create({ data: dto });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.priceType.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const data = await this.prisma.priceType.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Price type ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdatePriceTypeDto) {
    try {
      return await this.prisma.priceType.update({ where: { id }, data: dto });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Ditolak (400 Invalid reference) bila sudah dipakai outlet / harga produk.
  async remove(id: number) {
    try {
      return await this.prisma.priceType.delete({ where: { id } });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  private handleError(e: unknown, id?: number): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          throw new BadRequestException('Data already exists');
        case 'P2003':
          throw new BadRequestException('Invalid reference');
        case 'P2025':
          throw new NotFoundException(`Price type ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}