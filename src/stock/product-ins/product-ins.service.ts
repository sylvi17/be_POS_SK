import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { docPrefix, nextDocNo } from '../../common/utils/doc-number.util';
import { CreateProductInDto } from './dto/create-product-in.dto';
import { UpdateProductInDto } from './dto/update-product-in.dto';

const include = {
  details: {
    include: { product: { select: { id: true, code: true, name: true } } },
  },
  warehouse: true,
};

@Injectable()
export class ProductInsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductInDto, userId?: number) {
    const { details, ...header } = dto;
    try {
      return await this.prisma.$transaction(async (tx) => {
        const transaction_no = await this.generateNo(tx, header.date);
        const created = await tx.productIn.create({
          data: {
            ...header,
            transaction_no,
            created_by: userId,
            details: { create: details },
          },
          include: { details: true },
        });

        // Catat ke buku besar stok (IN).
        await tx.batchMutation.createMany({
          data: created.details.map((d) => ({
            date: created.date,
            product_id: d.product_id,
            warehouse_id: created.warehouse_id,
            sales_kanvas_plan_id: created.sales_kanvas_plan_id,
            product_in_detail_id: d.id,
            batch: d.batch as string,
            direction: 'IN',
            qty: d.qty,
          })),
        });

        return tx.productIn.findUniqueOrThrow({
          where: { id: created.id },
          include,
        });
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.productIn.findMany({
      include,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.productIn.findUnique({
      where: { id },
      include,
    });
    if (!data) throw new NotFoundException(`Product in ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateProductInDto) {
    try {
      return await this.prisma.productIn.update({
        where: { id },
        data: dto,
        include,
      });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Menghapus dokumen sekaligus mutasi stoknya.
  async remove(id: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.batchMutation.deleteMany({
          where: { productInDetail: { product_in_id: id } },
        });
        return tx.productIn.delete({ where: { id } });
      });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  private async generateNo(tx: Prisma.TransactionClient, date: Date) {
    const prefix = docPrefix('IN', date);
    const last = await tx.productIn.findFirst({
      where: { transaction_no: { startsWith: prefix } },
      orderBy: { transaction_no: 'desc' },
      select: { transaction_no: true },
    });
    return nextDocNo(prefix, last?.transaction_no);
  }

  private handleError(e: unknown, id?: number): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          throw new BadRequestException('Transaction number already exists');
        case 'P2003':
          throw new BadRequestException('Invalid reference');
        case 'P2025':
          throw new NotFoundException(`Product in ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}