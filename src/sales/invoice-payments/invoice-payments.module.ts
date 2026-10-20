import { Module } from '@nestjs/common';
import { InvoicePaymentsService } from './invoice-payments.service';
import { InvoicePaymentsController } from './invoice-payments.controller';

@Module({
  controllers: [InvoicePaymentsController],
  providers: [InvoicePaymentsService],
})
export class InvoicePaymentsModule {}
