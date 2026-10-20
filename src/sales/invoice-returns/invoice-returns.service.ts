import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { docPrefix, nextDocNo } from '../../common/utils/doc-number.util';
import { CreateInvoiceReturnDto } from './dto/create-invoice-return.dto';

const include = {
  details: {
    include: { product: { select: { id: true, code: true, name: true } } },
  },
  outlet: { select: { id: true, code: true, name: true } },
};

@Injectable()
export class InvoiceReturnsService {
  constructor(private readonly prisma: PrismaService) {}

  // Retur hanya mencatat dokumen & nilainya.
  // Stok barang retur yang masuk gudang dicatat lewat Product In.
  async create(dto: CreateInvoiceReturnDto) {
    const { details, ...header } = dto;
    try {
      return await this.prisma.$transaction(async (tx) => {
        let total = new Prisma.Decimal(0);
        const lines = details.map((d) => {
          const subtotal = new Prisma.Decimal(d.price).mul(d.qty);
          total = total.plus(subtotal);
          return { ...d, subtotal };
        });

        const prefix = docPrefix('RTR', header.date);
        const last = await tx.invoiceReturn.findFirst({
          where: { return_no: { startsWith: prefix } },
          orderBy: { return_no: 'desc' },
          select: { return_no: true },
        });

        return tx.invoiceReturn.create({
          data: {
            ...header,
            return_no: nextDocNo(prefix, last?.return_no),
            total,
            details: { create: lines },
          },
          include,
        });
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll(outletId?: number) {
    return this.prisma.invoiceReturn.findMany({
      where: { outlet_id: outletId },
      include,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.invoiceReturn.findUnique({
      where: { id },
      include,
    });
    if (!data) throw new NotFoundException(`Invoice return ${id} not found`);
    return data;
  }

  async remove(id: number) {
    try {
      return await this.prisma.invoiceReturn.delete({ where: { id } });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  private handleError(e: unknown, id?: number): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          throw new BadRequestException('Return number already exists');
        case 'P2003':
          throw new BadRequestException('Invalid reference');
        case 'P2025':
          throw new NotFoundException(`Invoice return ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}