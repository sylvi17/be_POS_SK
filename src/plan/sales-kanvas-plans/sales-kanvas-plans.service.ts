
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateSalesKanvasPlanDto } from './dto/create-sales-kanvas-plan.dto';
import { UpdateSalesKanvasPlanDto } from './dto/update-sales-kanvas-plan.dto';

@Injectable()
export class SalesKanvasPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSalesKanvasPlanDto) {
    const outletIds = dto.outlet_ids ?? [];

    if (new Set(outletIds).size !== outletIds.length) {
      throw new BadRequestException(
        'outlet_ids tidak boleh berisi ID duplikat',
      );
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employee_id },
    });

    if (!employee) {
      throw new NotFoundException(
        `Karyawan ${dto.employee_id} tidak ditemukan`,
      );
    }

    if (dto.vehicle_id != null) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: dto.vehicle_id },
      });

      if (!vehicle) {
        throw new NotFoundException(
          `Kendaraan ${dto.vehicle_id} tidak ditemukan`,
        );
      }
    }

    if (dto.market_area_id != null) {
      const marketArea = await this.prisma.marketArea.findUnique({
        where: { id: dto.market_area_id },
      });

      if (!marketArea) {
        throw new NotFoundException(
          `Wilayah kanvas ${dto.market_area_id} tidak ditemukan`,
        );
      }
    }

    if (outletIds.length > 0) {
      const outlets = await this.prisma.outlet.findMany({
        where: { id: { in: outletIds } },
        select: { id: true },
      });

      if (outlets.length !== outletIds.length) {
        throw new BadRequestException(
          'Satu atau lebih ID outlet tidak ditemukan',
        );
      }
    }

    const planNo = `RKN-${Date.now()}`;

    return this.prisma.$transaction(async (tx) => {
      const plan = await tx.salesKanvasPlan.create({
        data: {
          plan_no: planNo,
          employee_id: dto.employee_id,
          vehicle_id: dto.vehicle_id ?? null,
          market_area_id: dto.market_area_id ?? null,
          departure_date: dto.departure_date,
          return_date: dto.return_date ?? null,
        },
      });

      if (outletIds.length > 0) {
        await tx.salesKanvasPlanOutlet.createMany({
          data: outletIds.map((outletId: number) => ({
            sales_kanvas_plan_id: plan.id,
            outlet_id: outletId,
          })),
        });
      }

      return tx.salesKanvasPlan.findUnique({
        where: { id: plan.id },
        include: {
          employee: true,
          vehicle: true,
          marketArea: true,
          outlets: {
            include: { outlet: true },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.salesKanvasPlan.findMany({
      include: {
        employee: true,
        vehicle: true,
        marketArea: true,
        outlets: {
          include: { outlet: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const plan = await this.prisma.salesKanvasPlan.findUnique({
      where: { id },
      include: {
        employee: true,
        vehicle: true,
        marketArea: true,
        outlets: {
          include: { outlet: true },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException(
        `Sales Kanvas Plan dengan ID ${id} tidak ditemukan`,
      );
    }

    return plan;
  }

  async update(id: number, dto: UpdateSalesKanvasPlanDto) {
    await this.findOne(id);

    if (dto.employee_id !== undefined) {
      const employee = await this.prisma.employee.findUnique({
        where: { id: dto.employee_id },
      });

      if (!employee) {
        throw new NotFoundException(
          `Karyawan ${dto.employee_id} tidak ditemukan`,
        );
      }
    }

    if (dto.vehicle_id != null) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: dto.vehicle_id },
      });

      if (!vehicle) {
        throw new NotFoundException(
          `Kendaraan ${dto.vehicle_id} tidak ditemukan`,
        );
      }
    }

    if (dto.market_area_id != null) {
      const marketArea = await this.prisma.marketArea.findUnique({
        where: { id: dto.market_area_id },
      });

      if (!marketArea) {
        throw new NotFoundException(
          `Wilayah kanvas ${dto.market_area_id} tidak ditemukan`,
        );
      }
    }

    const outletIds = dto.outlet_ids;
    const updateData: {
      employee_id?: number;
      vehicle_id?: number | null;
      market_area_id?: number | null;
      departure_date?: Date;
      return_date?: Date | null;
    } = {};

    if (dto.employee_id !== undefined) {
      updateData.employee_id = dto.employee_id;
    }
    if (dto.vehicle_id !== undefined) {
      updateData.vehicle_id = dto.vehicle_id;
    }
    if (dto.market_area_id !== undefined) {
      updateData.market_area_id = dto.market_area_id;
    }
    if (dto.departure_date !== undefined) {
      updateData.departure_date = dto.departure_date;
    }
    if (dto.return_date !== undefined) {
      updateData.return_date = dto.return_date;
    }

    if (outletIds !== undefined) {
      if (new Set(outletIds).size !== outletIds.length) {
        throw new BadRequestException(
          'outlet_ids tidak boleh berisi ID duplikat',
        );
      }

      if (outletIds.length > 0) {
        const outlets = await this.prisma.outlet.findMany({
          where: { id: { in: outletIds } },
          select: { id: true },
        });

        if (outlets.length !== outletIds.length) {
          throw new BadRequestException(
            'Satu atau lebih ID outlet tidak ditemukan',
          );
        }
      }
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.salesKanvasPlan.update({
        where: { id },
        data: updateData,
      });

      if (outletIds !== undefined) {
        await tx.salesKanvasPlanOutlet.deleteMany({
          where: { sales_kanvas_plan_id: id },
        });

        if (outletIds.length > 0) {
          await tx.salesKanvasPlanOutlet.createMany({
            data: outletIds.map((outletId: number) => ({
              sales_kanvas_plan_id: id,
              outlet_id: outletId,
            })),
          });
        }
      }

      return tx.salesKanvasPlan.findUnique({
        where: { id },
        include: {
          employee: true,
          vehicle: true,
          marketArea: true,
          outlets: {
            include: { outlet: true },
          },
        },
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.salesKanvasPlan.delete({
      where: { id },
    });
  }
}
