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
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { ProductInsService } from './product-ins.service';
import { CreateProductInDto } from './dto/create-product-in.dto';
import { UpdateProductInDto } from './dto/update-product-in.dto';

@Controller('product-ins')
export class ProductInsController {
  constructor(private readonly productInsService: ProductInsService) {}

  @Post()
  create(
    @Body() dto: CreateProductInDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.productInsService.create(dto, user?.id);
  }

  @Get()
  findAll() {
    return this.productInsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productInsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductInDto,
  ) {
    return this.productInsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productInsService.remove(id);
  }
}