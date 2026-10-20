import { Module } from '@nestjs/common';
import { ProductOutsService } from './product-outs.service';
import { ProductOutsController } from './product-outs.controller';

@Module({
  controllers: [ProductOutsController],
  providers: [ProductOutsService],
})
export class ProductOutsModule {}
