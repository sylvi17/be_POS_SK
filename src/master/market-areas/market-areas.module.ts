import { Module } from '@nestjs/common';
import { MarketAreasService } from './market-areas.service';
import { MarketAreasController } from './market-areas.controller';

@Module({
  controllers: [MarketAreasController],
  providers: [MarketAreasService],
})
export class MarketAreasModule {}