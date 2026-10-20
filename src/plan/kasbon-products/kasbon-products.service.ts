import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { docPrefix, nextDocNo } from '../../common/utils/doc-number.util';
import { CreateKasbonProductDto } from './dto/create-kasbon-product.dto';
import { UpdateKasbonProductDto } from './dto/update-kasbon-product.dto';

const include = {
  details: { include: { product: { select: { id: true, code: true, name: true } } } },
  employee: { select: { id: true, name: true } },
};

@Injectable()
export class KasbonProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(planId?: number) {
    return this.prisma.salesKanvasKasbonProduct.findMany({
      where: { sales_kanvas_plan_id: planId },
      include,
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.salesKanvasKasbonProduct.findUniqueOrThrow({
      where: { id },
      include,
    });
  }

  create(dto: CreateKasbonProductDto) {
    const { details, ...header } = dto;
    return this.prisma.$transaction(async (tx) => {
      const kasbon_no = await this.generateNo(tx, header.date);
      return tx.salesKanvasKasbonProduct.create({
        data: { ...header, kasbon_no, details: { create: details } },
        include,
      });
    });
  }

  update(id: number, dto: UpdateKasbonProductDto) {
    const { details, ...header } = dto;
    return this.prisma.$transaction(async (tx) => {
      if (details) {
        await tx.salesKanvasKasbonProductDetail.deleteMany({
          where: { sales_kanvas_kasbon_product_id: id },
        });
      }
      return tx.salesKanvasKasbonProduct.update({
        where: { id },
        data: { ...header, ...(details && { details: { create: details } }) },
        include,
      });
    });
  }

  // Ditolak (400 Invalid reference) bila sudah dipakai Product Out.
  remove(id: number) {
    return this.prisma.salesKanvasKasbonProduct.delete({ where: { id } });
  }

  private async generateNo(tx: Prisma.TransactionClient, date: Date) {
    const prefix = docPrefix('KBP', date);
    const last = await tx.salesKanvasKasbonProduct.findFirst({
      where: { kasbon_no: { startsWith: prefix } },
      orderBy: { kasbon_no: 'desc' },
      select: { kasbon_no: true },
    });
    return nextDocNo(prefix, last?.kasbon_no);
  }
}