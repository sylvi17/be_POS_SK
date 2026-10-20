import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';

const include = { marketArea: true, priceType: true };

@Injectable()
export class OutletsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOutletDto) {
    try {
      return await this.prisma.outlet.create({ data: dto, include });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.outlet.findMany({ include, orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const data = await this.prisma.outlet.findUnique({
      where: { id },
      include,
    });
    if (!data) throw new NotFoundException(`Outlet ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateOutletDto) {
    try {
      return await this.prisma.outlet.update({
        where: { id },
        data: dto,
        include,
      });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Ditolak (400 Invalid reference) bila sudah dipakai invoice / plan.
  async remove(id: number) {
    try {
      return await this.prisma.outlet.delete({ where: { id } });
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
          throw new NotFoundException(`Outlet ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}