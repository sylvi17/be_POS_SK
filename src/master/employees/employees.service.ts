import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto) {
    try {
      return await this.prisma.employee.create({ data: dto });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.employee.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const data = await this.prisma.employee.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Employee ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    try {
      return await this.prisma.employee.update({ where: { id }, data: dto });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Ditolak (400 Invalid reference) bila sudah dipakai plan / kasbon / user.
  async remove(id: number) {
    try {
      return await this.prisma.employee.delete({ where: { id } });
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
          throw new NotFoundException(`Employee ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}