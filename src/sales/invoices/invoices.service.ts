import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { docPrefix, nextDocNo } from '../../common/utils/doc-number.util';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

const outletSelect = { select: { id: true, code: true, name: true } };
const include = {
  details: {
    include: { product: { select: { id: true, code: true, name: true } } },
  },
  outlet: outletSelect,
  payments: true,
};

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInvoiceDto) {
    const { details, ...header } = dto;
    try {
      return await this.prisma.$transaction(async (tx) => {
        const outlet = await tx.outlet.findUniqueOrThrow({
          where: { id: header.outlet_id },
        });

        // Harga: dari input, kalau kosong dari product-prices (tipe harga outlet).
        const priceRows = await tx.productPrice.findMany({
          where: {
            price_type_id: outlet.price_type_id,
            product_id: { in: details.map((d) => d.product_id) },
          },
        });
        const priceMap = new Map(priceRows.map((p) => [p.product_id, p.price]));

        let total = new Prisma.Decimal(0);
        const lines = details.map((d) => {
          const price =
            d.price !== undefined
              ? new Prisma.Decimal(d.price)
              : priceMap.get(d.product_id);
          if (!price) {
            throw new BadRequestException(
              `Harga produk ${d.product_id} untuk tipe harga outlet belum diatur`,
            );
          }
          const subtotal = price.mul(d.qty);
          total = total.plus(subtotal);
          return { ...d, price, subtotal };
        });

        const isTop = header.payment_type === 'TOP';

        // Cek limit piutang untuk penjualan tempo.
        if (isTop && outlet.receivable_limit && outlet.receivable_limit.gt(0)) {
          const [inv, paid] = await Promise.all([
            tx.invoiceOutlet.aggregate({
              where: { outlet_id: outlet.id },
              _sum: { total: true },
            }),
            tx.invoicePayment.aggregate({
              where: { invoiceOutlet: { outlet_id: outlet.id } },
              _sum: { amount: true },
            }),
          ]);
          const running = (inv._sum.total ?? new Prisma.Decimal(0)).minus(
            paid._sum.amount ?? 0,
          );
          if (running.plus(total).gt(outlet.receivable_limit)) {
            throw new BadRequestException(
              `Melebihi limit piutang outlet (limit ${outlet.receivable_limit}, piutang berjalan ${running})`,
            );
          }
        }

        const due_date = isTop ? new Date(header.date) : null;
        if (due_date) {
          due_date.setUTCDate(due_date.getUTCDate() + header.top_days);
        }

        const prefix = docPrefix('INV', header.date);
        const last = await tx.invoiceOutlet.findFirst({
          where: { invoice_no: { startsWith: prefix } },
          orderBy: { invoice_no: 'desc' },
          select: { invoice_no: true },
        });

        const invoice = await tx.invoiceOutlet.create({
          data: {
            ...header,
            top_days: isTop ? header.top_days : 0,
            due_date,
            invoice_no: nextDocNo(prefix, last?.invoice_no),
            total,
            details: { create: lines },
          },
        });

        if (isTop) {
          // Piutang awal = total invoice.
          await tx.outletReceivableCard.create({
            data: {
              outlet_id: outlet.id,
              invoice_outlet_id: invoice.id,
              date: header.date,
              remaining: total,
            },
          });
        } else {
          // Tunai: langsung tercatat lunas.
          await tx.invoicePayment.create({
            data: {
              invoice_outlet_id: invoice.id,
              date: header.date,
              amount: total,
            },
          });
        }

        return tx.invoiceOutlet.findUniqueOrThrow({
          where: { id: invoice.id },
          include,
        });
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll(outletId?: number, planId?: number) {
    return this.prisma.invoiceOutlet.findMany({
      where: { outlet_id: outletId, sales_kanvas_plan_id: planId },
      include: { outlet: outletSelect, payments: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.invoiceOutlet.findUnique({
      where: { id },
      include,
    });
    if (!data) throw new NotFoundException(`Invoice ${id} not found`);
    return data;
  }

  async remove(id: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const invoice = await tx.invoiceOutlet.findUniqueOrThrow({
          where: { id },
          include: { _count: { select: { payments: true, returns: true } } },
        });

        if (invoice._count.returns > 0) {
          throw new BadRequestException('Invoice sudah memiliki retur');
        }
        if (invoice.payment_type === 'TOP' && invoice._count.payments > 0) {
          throw new BadRequestException(
            'Invoice tempo sudah memiliki pembayaran, hapus pembayaran terlebih dahulu',
          );
        }

        await tx.outletReceivableCard.deleteMany({
          where: { invoice_outlet_id: id },
        });
        await tx.invoicePayment.deleteMany({ where: { invoice_outlet_id: id } });
        return tx.invoiceOutlet.delete({ where: { id } }); // detail ikut terhapus
      });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  private handleError(e: unknown, id?: number): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          throw new BadRequestException('Invoice number already exists');
        case 'P2003':
          throw new BadRequestException('Invalid reference');
        case 'P2025':
          throw new NotFoundException(`Invoice ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}