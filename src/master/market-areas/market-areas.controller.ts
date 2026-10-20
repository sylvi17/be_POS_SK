import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MarketAreasService } from './market-areas.service';
import { CreateMarketAreaDto } from './dto/create-market-area.dto';
import { UpdateMarketAreaDto } from './dto/update-market-area.dto';

@Controller('market-areas')
export class MarketAreasController {
  constructor(private readonly marketAreasService: MarketAreasService) {}

  @Post()
  create(@Body() dto: CreateMarketAreaDto) {
    return this.marketAreasService.create(dto);
  }

  @Get()
  findAll() {
    return this.marketAreasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.marketAreasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMarketAreaDto,
  ) {
    return this.marketAreasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.marketAreasService.remove(id);
  }
}