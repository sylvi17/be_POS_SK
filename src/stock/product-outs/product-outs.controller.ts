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
import { ProductOutsService } from './product-outs.service';
import { CreateProductOutDto } from './dto/create-product-out.dto';
import { UpdateProductOutDto } from './dto/update-product-out.dto';

@Controller('product-outs')
export class ProductOutsController {
  constructor(private readonly productOutsService: ProductOutsService) {}

  @Post()
  create(
    @Body() dto: CreateProductOutDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.productOutsService.create(dto, user?.id);
  }

  @Get()
  findAll() {
    return this.productOutsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productOutsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductOutDto,
  ) {
    return this.productOutsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productOutsService.remove(id);
  }
}