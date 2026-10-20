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
import { PriceTypesService } from './price-types.service';
import { CreatePriceTypeDto } from './dto/create-price-type.dto';
import { UpdatePriceTypeDto } from './dto/update-price-type.dto';

@Controller('price-types')
export class PriceTypesController {
  constructor(private readonly priceTypesService: PriceTypesService) {}

  @Post()
  create(@Body() dto: CreatePriceTypeDto) {
    return this.priceTypesService.create(dto);
  }

  @Get()
  findAll() {
    return this.priceTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.priceTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePriceTypeDto,
  ) {
    return this.priceTypesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.priceTypesService.remove(id);
  }
}