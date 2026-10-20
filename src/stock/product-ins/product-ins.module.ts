import { Module } from '@nestjs/common';
import { ProductInsService } from './product-ins.service';
import { ProductInsController } from './product-ins.controller';

@Module({
  controllers: [ProductInsController],
  providers: [ProductInsService],
})
export class ProductInsModule {}
