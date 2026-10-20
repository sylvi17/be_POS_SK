import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { Authenticated } from '../../common/decorators/authenticated.decorator';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CreateKasbonProductDto } from './dto/create-kasbon-product.dto';
import { UpdateKasbonProductDto } from './dto/update-kasbon-product.dto';
import { KasbonProductsService } from './kasbon-products.service';

@Controller('plan/kasbon-products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class KasbonProductsController {
  constructor(private readonly kasbonProductsService: KasbonProductsService) {}

  @Get()
  @Authenticated()
  findAll(
    @Query('sales_kanvas_plan_id', new ParseIntPipe({ optional: true }))
    planId?: number,
  ) {
    return this.kasbonProductsService.findAll(planId);
  }

  @Get(':id')
  @Authenticated()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kasbonProductsService.findOne(id);
  }

  @Post()
  @RequirePermission('kasbon-product:write')
  create(@Body() dto: CreateKasbonProductDto) {
    return this.kasbonProductsService.create(dto);
  }

  @Patch(':id')
  @RequirePermission('kasbon-product:write')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKasbonProductDto,
  ) {
    return this.kasbonProductsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('kasbon-product:write')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kasbonProductsService.remove(id);
  }
}