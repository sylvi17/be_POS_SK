import { Module } from '@nestjs/common';
import { ReceivableCardsService } from './receivable-cards.service';
import { ReceivableCardsController } from './receivable-cards.controller';

@Module({
  controllers: [ReceivableCardsController],
  providers: [ReceivableCardsService],
})
export class ReceivableCardsModule {}
