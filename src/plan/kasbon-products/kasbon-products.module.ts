import { Module } from '@nestjs/common';
import { KasbonProductsController } from './kasbon-products.controller';
import { KasbonProductsService } from './kasbon-products.service';

@Module({
  controllers: [KasbonProductsController],
  providers: [KasbonProductsService],
})
export class KasbonProductsModule {}