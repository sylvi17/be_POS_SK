import { Module } from '@nestjs/common';
import { SalesKanvasPlansController } from './sales-kanvas-plans.controller';
import { SalesKanvasPlansService } from './sales-kanvas-plans.service';

@Module({
  controllers: [SalesKanvasPlansController],
  providers: [SalesKanvasPlansService],
})
export class SalesKanvasPlansModule {}