import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { BatchMutationsService } from './batch-mutations.service';

@Controller('batch-mutations')
export class BatchMutationsController {
  constructor(private readonly batchMutationsService: BatchMutationsService) {}

  @Get()
  findAll(
    @Query('warehouse_id', new ParseIntPipe({ optional: true }))
    warehouseId?: number,
    @Query('product_id', new ParseIntPipe({ optional: true }))
    productId?: number,
    @Query('batch') batch?: string,
  ) {
    return this.batchMutationsService.findAll(warehouseId, productId, batch);
  }

  // Saldo stok per produk + batch dalam satu gudang.
  @Get('balance')
  balance(@Query('warehouse_id', ParseIntPipe) warehouseId: number) {
    return this.batchMutationsService.balance(warehouseId);
  }
}