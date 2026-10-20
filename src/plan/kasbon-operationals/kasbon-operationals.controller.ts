
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { KasbonOperationalsService } from './kasbon-operationals.service';

import { CreateKasbonOperationalDto } from './dto/create-kasbon-operational.dto';

import { UpdateKasbonOperationalDto } from './dto/update-kasbon-operational.dto';

@Controller('plan/kasbon-operationals')
export class KasbonOperationalsController {
  constructor(
    private readonly kasbonOperationalsService: KasbonOperationalsService,
  ) {}

  @Get()
  findAll(@Query('sales_kanvas_plan_id') planId?: string) {
    let parsedPlanId: number | undefined;

    if (planId !== undefined) {
      parsedPlanId = Number(planId);

      if (!Number.isInteger(parsedPlanId) || parsedPlanId <= 0) {
        throw new BadRequestException(
          'sales_kanvas_plan_id harus berupa angka positif',
        );
      }
    }

    return this.kasbonOperationalsService.findAll(parsedPlanId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kasbonOperationalsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateKasbonOperationalDto) {
    return this.kasbonOperationalsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKasbonOperationalDto,
  ) {
    return this.kasbonOperationalsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kasbonOperationalsService.remove(id);
  }
}
