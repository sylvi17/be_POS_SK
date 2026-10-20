import { Module } from '@nestjs/common';
import { InvoiceReturnsService } from './invoice-returns.service';
import { InvoiceReturnsController } from './invoice-returns.controller';

@Module({
  controllers: [InvoiceReturnsController],
  providers: [InvoiceReturnsService],
})
export class InvoiceReturnsModule {}
