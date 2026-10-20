import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReceivableCardsService {
  constructor(private readonly prisma: PrismaService) {}

  findByOutlet(outletId: number) {
    return this.prisma.outletReceivableCard.findMany({
      where: { outlet_id: outletId },
      include: {
        invoiceOutlet: {
          select: { id: true, invoice_no: true, due_date: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async outstanding(outletId: number) {
    const invoices = await this.prisma.invoiceOutlet.findMany({
      where: { outlet_id: outletId, payment_type: 'TOP' },
      include: { payments: { select: { amount: true } } },
      orderBy: { date: 'asc' },
    });

    return invoices
      .map((inv) => {
        const paid = inv.payments.reduce(
          (acc, p) => acc.plus(p.amount),
          inv.total.mul(0),
        );
        return {
          invoice_outlet_id: inv.id,
          invoice_no: inv.invoice_no,
          due_date: inv.due_date,
          total: inv.total,
          paid,
          remaining: inv.total.minus(paid),
        };
      })
      .filter((i) => i.remaining.gt(0));
  }
}