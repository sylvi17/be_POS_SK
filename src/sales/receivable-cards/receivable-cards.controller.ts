import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReceivableCardsService } from './receivable-cards.service';

@Controller('receivable-cards')
export class ReceivableCardsController {
  constructor(
    private readonly receivableCardsService: ReceivableCardsService,
  ) {}

  // Riwayat piutang satu outlet.
  @Get('outlet/:outletId')
  findByOutlet(@Param('outletId', ParseIntPipe) outletId: number) {
    return this.receivableCardsService.findByOutlet(outletId);
  }

  // Piutang berjalan per invoice milik satu outlet.
  @Get('outlet/:outletId/outstanding')
  outstanding(@Param('outletId', ParseIntPipe) outletId: number) {
    return this.receivableCardsService.outstanding(outletId);
  }
}