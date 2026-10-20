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
} from '@nestjs/common';
import { ProductPricesService } from './product-prices.service';
import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';

@Controller('product-prices')
export class ProductPricesController {
  constructor(private readonly productPricesService: ProductPricesService) {}

  @Post()
  create(@Body() dto: CreateProductPriceDto) {
    return this.productPricesService.create(dto);
  }

  @Get()
  findAll(
    @Query('product_id', new ParseIntPipe({ optional: true }))
    productId?: number,
    @Query('price_type_id', new ParseIntPipe({ optional: true }))
    priceTypeId?: number,
  ) {
    return this.productPricesService.findAll(productId, priceTypeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productPricesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductPriceDto,
  ) {
    return this.productPricesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productPricesService.remove(id);
  }
}