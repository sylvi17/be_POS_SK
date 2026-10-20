
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { docPrefix, nextDocNo } from '../../common/utils/doc-number.util';
import { CreateKasbonOperationalDto } from './dto/create-kasbon-operational.dto';
import { UpdateKasbonOperationalDto } from './dto/update-kasbon-operational.dto';

const include = {
  employee: {
    select: {
      id: true,
      name: true,
    },
  },
};

@Injectable()
export class KasbonOperationalsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(planId?: number) {
    return this.prisma.salesKanvasKasbonOperational.findMany({
      where: planId ? { sales_kanvas_plan_id: planId } : {},
      include,
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.salesKanvasKasbonOperational.findUniqueOrThrow({
      where: { id },
      include,
    });
  }

  async create(dto: CreateKasbonOperationalDto) {
    const prefix = docPrefix('KBO', dto.date);

    const last = await this.prisma.salesKanvasKasbonOperational.findFirst({
      where: {
        kasbon_no: { startsWith: prefix },
      },
      orderBy: { kasbon_no: 'desc' },
      select: { kasbon_no: true },
    });

    return this.prisma.salesKanvasKasbonOperational.create({
      data: {
        kasbon_no: nextDocNo(prefix, last?.kasbon_no),
        date: dto.date,
        amount: dto.amount,
        purpose: dto.purpose,
        salesKanvasPlan: {
          connect: { id: dto.sales_kanvas_plan_id },
        },
        employee: {
          connect: { id: dto.employee_id },
        },
      },
      include,
    });
  }

  update(id: number, dto: UpdateKasbonOperationalDto) {
    return this.prisma.salesKanvasKasbonOperational.update({
      where: { id },
      data: {
        ...(dto.sales_kanvas_plan_id !== undefined && {
          salesKanvasPlan: {
            connect: { id: dto.sales_kanvas_plan_id },
          },
        }),
        ...(dto.employee_id !== undefined && {
          employee: {
            connect: { id: dto.employee_id },
          },
        }),
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.purpose !== undefined && { purpose: dto.purpose }),
      },
      include,
    });
  }

  remove(id: number) {
    return this.prisma.salesKanvasKasbonOperational.delete({
      where: { id },
    });
  }
}
