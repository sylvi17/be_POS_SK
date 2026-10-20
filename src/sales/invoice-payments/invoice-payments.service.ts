
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateInvoicePaymentDto,
  createInvoicePaymentSchema,
} from './dto/create-invoice-payment.dto';

@Injectable()
export class InvoicePaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInvoicePaymentDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const input = createInvoicePaymentSchema.parse(dto);
        
        const invoiceId = input.invoice_outlet_id;
        const paymentDate = input.date;
        const paymentAmount = new Prisma.Decimal(input.amount);

        const invoice = await tx.invoiceOutlet.findUnique({
          where: { id: invoiceId },
        });

        if (!invoice) {
          throw new NotFoundException(
            `Invoice ${invoiceId} tidak ditemukan`,
          );
        }

        const paid = await tx.invoicePayment.aggregate({
          where: { invoice_outlet_id: invoice.id },
          _sum: { amount: true },
        });

        const totalPaid =
          paid._sum.amount ?? new Prisma.Decimal(0);

        const remaining = invoice.total.minus(totalPaid);
        const amount = new Prisma.Decimal(paymentAmount);

        if (amount.lte(0)) {
          throw new BadRequestException(
            'Jumlah pembayaran harus lebih dari 0',
          );
        }

        if (amount.gt(remaining)) {
          throw new BadRequestException(
            `Pembayaran melebihi sisa piutang (sisa ${remaining.toString()})`,
          );
        }

        const payment = await tx.invoicePayment.create({
          data: {
            invoice_outlet_id: invoiceId,
            date: paymentDate,
            amount,
          },
        });

        await tx.outletReceivableCard.create({
          data: {
            outlet_id: invoice.outlet_id,
            invoice_outlet_id: invoice.id,
            invoice_payment_id: payment.id,
            date: paymentDate,
            remaining: remaining.minus(amount),
          },
        });

        return payment;
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(invoiceId?: number) {
    return this.prisma.invoicePayment.findMany({
      where:
        invoiceId !== undefined
          ? { invoice_outlet_id: invoiceId }
          : {},
      include: {
        invoiceOutlet: {
          select: {
            id: true,
            invoice_no: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const payment = await this.prisma.invoicePayment.findUnique({
      where: { id },
      include: {
        invoiceOutlet: {
          select: {
            id: true,
            invoice_no: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(
        `Invoice payment ${id} tidak ditemukan`,
      );
    }

    return payment;
  }

  async remove(id: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const payment = await tx.invoicePayment.findUnique({
          where: { id },
        });

        if (!payment) {
          throw new NotFoundException(
            `Invoice payment ${id} tidak ditemukan`,
          );
        }

        const latest = await tx.invoicePayment.findFirst({
          where: {
            invoice_outlet_id: payment.invoice_outlet_id,
          },
          orderBy: { id: 'desc' },
          select: { id: true },
        });

        if (latest?.id !== id) {
          throw new BadRequestException(
            'Hanya pembayaran terakhir pada invoice ini yang bisa dihapus',
          );
        }

        await tx.outletReceivableCard.deleteMany({
          where: { invoice_payment_id: id },
        });

        return tx.invoicePayment.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.handleError(error, id);
    }
  }

  private handleError(error: unknown, id?: number): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003':
          throw new BadRequestException(
            'Referensi data tidak valid',
          );

        case 'P2025':
          throw new NotFoundException(
            `Invoice payment ${id ?? ''} tidak ditemukan`,
          );
      }
    }

    throw error;
  }
}
