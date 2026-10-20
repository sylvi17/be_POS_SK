
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

import { SalesKanvasPlansService } from './sales-kanvas-plans.service';
import { CreateSalesKanvasPlanDto } from './dto/create-sales-kanvas-plan.dto';
import { UpdateSalesKanvasPlanDto } from './dto/update-sales-kanvas-plan.dto';

@Controller('sales-kanvas-plans')
export class SalesKanvasPlansController {
  constructor(
    private readonly salesKanvasPlansService: SalesKanvasPlansService,
  ) {}

  @Post()
  create(@Body() dto: CreateSalesKanvasPlanDto) {
    return this.salesKanvasPlansService.create(dto);
  }

  @Get()
  findAll() {
    return this.salesKanvasPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salesKanvasPlansService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSalesKanvasPlanDto,
  ) {
    return this.salesKanvasPlansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salesKanvasPlansService.remove(id);
  }
}
