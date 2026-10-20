import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVehicleDto) {
    try {
      return await this.prisma.vehicle.create({ data: dto });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.vehicle.findMany({ orderBy: { plate_number: 'asc' } });
  }

  async findOne(id: number) {
    const data = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Vehicle ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateVehicleDto) {
    try {
      return await this.prisma.vehicle.update({ where: { id }, data: dto });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Ditolak (400 Invalid reference) bila sudah dipakai plan.
  async remove(id: number) {
    try {
      return await this.prisma.vehicle.delete({ where: { id } });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  private handleError(e: unknown, id?: number): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          throw new BadRequestException('Plate number already exists');
        case 'P2003':
          throw new BadRequestException('Invalid reference');
        case 'P2025':
          throw new NotFoundException(`Vehicle ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}