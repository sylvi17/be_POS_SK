import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMarketAreaDto } from './dto/create-market-area.dto';
import { UpdateMarketAreaDto } from './dto/update-market-area.dto';

@Injectable()
export class MarketAreasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMarketAreaDto) {
    try {
      return await this.prisma.marketArea.create({ data: dto });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.marketArea.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const data = await this.prisma.marketArea.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Market area ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateMarketAreaDto) {
    try {
      return await this.prisma.marketArea.update({ where: { id }, data: dto });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Ditolak (400 Invalid reference) bila sudah dipakai outlet / plan.
  async remove(id: number) {
    try {
      return await this.prisma.marketArea.delete({ where: { id } });
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
          throw new NotFoundException(`Market area ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}