
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { InvoicePaymentsService } from './invoice-payments.service';

import { CreateInvoicePaymentDto } from './dto/create-invoice-payment.dto';

@Controller('sales/invoice-payments')
export class InvoicePaymentsController {
  constructor(
    private readonly invoicePaymentsService: InvoicePaymentsService,
  ) {}

  @Post()
  create(@Body() dto: CreateInvoicePaymentDto) {
    return this.invoicePaymentsService.create(dto);
  }

  @Get()
  findAll(@Query('invoice_outlet_id') invoiceId?: string) {
    let parsedInvoiceId: number | undefined;

    if (invoiceId !== undefined) {
      parsedInvoiceId = Number(invoiceId);

      if (
        !Number.isInteger(parsedInvoiceId) ||
        parsedInvoiceId <= 0
      ) {
        throw new BadRequestException(
          'invoice_outlet_id harus berupa angka positif',
        );
      }
    }

    return this.invoicePaymentsService.findAll(parsedInvoiceId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoicePaymentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoicePaymentsService.remove(id);
  }
}
