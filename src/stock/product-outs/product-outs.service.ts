import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { docPrefix, nextDocNo } from '../../common/utils/doc-number.util';
import { getBatchBalance } from '../batch-mutations/stock.util';
import { CreateProductOutDto } from './dto/create-product-out.dto';
import { UpdateProductOutDto } from './dto/update-product-out.dto';

const include = {
  details: {
    include: { product: { select: { id: true, code: true, name: true } } },
  },
  warehouse: true,
};

@Injectable()
export class ProductOutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductOutDto, userId?: number) {
    const { details, ...header } = dto;
    try {
      return await this.prisma.$transaction(async (tx) => {
        await this.assertStock(tx, header.warehouse_id, details);

        const transaction_no = await this.generateNo(tx, header.date);
        const created = await tx.productOut.create({
          data: {
            ...header,
            transaction_no,
            created_by: userId,
            details: { create: details },
          },
          include: { details: true },
        });

        // Catat ke buku besar stok (OUT).
        await tx.batchMutation.createMany({
          data: created.details.map((d) => ({
            date: created.date,
            product_id: d.product_id,
            warehouse_id: created.warehouse_id,
            sales_kanvas_plan_id: created.sales_kanvas_plan_id,
            product_out_detail_id: d.id,
            batch: d.batch as string,
            direction: 'OUT',
            qty: d.qty,
          })),
        });

        return tx.productOut.findUniqueOrThrow({
          where: { id: created.id },
          include,
        });
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.productOut.findMany({
      include,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.productOut.findUnique({
      where: { id },
      include,
    });
    if (!data) throw new NotFoundException(`Product out ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateProductOutDto) {
    try {
      return await this.prisma.productOut.update({
        where: { id },
        data: dto,
        include,
      });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  // Menghapus dokumen sekaligus mutasi stoknya (stok kembali).
  async remove(id: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.batchMutation.deleteMany({
          where: { productOutDetail: { product_out_id: id } },
        });
        return tx.productOut.delete({ where: { id } });
      });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  private async assertStock(
    tx: Prisma.TransactionClient,
    warehouseId: number,
    details: CreateProductOutDto['details'],
  ) {
    // Gabungkan baris dengan produk+batch yang sama sebelum cek saldo.
    const need = new Map<
      string,
      { product_id: number; batch: string; qty: number }
    >();
    for (const d of details) {
      const key = `${d.product_id}|${d.batch}`;
      const cur = need.get(key) ?? {
        product_id: d.product_id,
        batch: d.batch,
        qty: 0,
      };
      cur.qty += d.qty;
      need.set(key, cur);
    }
    for (const n of need.values()) {
      const balance = await getBatchBalance(tx, {
        warehouse_id: warehouseId,
        product_id: n.product_id,
        batch: n.batch,
      });
      if (balance < n.qty) {
        throw new BadRequestException(
          `Stok tidak cukup untuk produk ${n.product_id} batch ${n.batch} (tersedia ${balance}, diminta ${n.qty})`,
        );
      }
    }
  }

  private async generateNo(tx: Prisma.TransactionClient, date: Date) {
    const prefix = docPrefix('OUT', date);
    const last = await tx.productOut.findFirst({
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
          throw new NotFoundException(`Product out ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}