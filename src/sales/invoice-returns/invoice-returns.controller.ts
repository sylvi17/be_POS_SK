import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { InvoiceReturnsService } from './invoice-returns.service';
import { CreateInvoiceReturnDto } from './dto/create-invoice-return.dto';

@Controller('invoice-returns')
export class InvoiceReturnsController {
  constructor(private readonly invoiceReturnsService: InvoiceReturnsService) {}

  @Post()
  create(@Body() dto: CreateInvoiceReturnDto) {
    return this.invoiceReturnsService.create(dto);
  }

  @Get()
  findAll(
    @Query('outlet_id', new ParseIntPipe({ optional: true })) outletId?: number,
  ) {
    return this.invoiceReturnsService.findAll(outletId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceReturnsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceReturnsService.remove(id);
  }
}