import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data: dto });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.product.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const data = await this.prisma.product.findUnique({
      where: { id },
      include: { prices: { include: { priceType: true } } },
    });
    if (!data) throw new NotFoundException(`Product ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateProductDto) {
    try {
      return await this.prisma.product.update({ where: { id }, data: dto });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Ditolak (400 Invalid reference) bila sudah dipakai transaksi.
  async remove(id: number) {
    try {
      return await this.prisma.product.delete({ where: { id } });
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
          throw new NotFoundException(`Product ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}