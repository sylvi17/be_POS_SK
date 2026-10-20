import { Module } from '@nestjs/common';
import { PriceTypesService } from './price-types.service';
import { PriceTypesController } from './price-types.controller';

@Module({
  controllers: [PriceTypesController],
  providers: [PriceTypesService],
})
export class PriceTypesModule {}