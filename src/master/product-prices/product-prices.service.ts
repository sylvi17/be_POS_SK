import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';

const include = {
  product: { select: { id: true, code: true, name: true } },
  priceType: true,
};

@Injectable()
export class ProductPricesService {
  constructor(private readonly prisma: PrismaService) {}

  // Kombinasi product_id + price_type_id unik (duplikat -> 400).
  async create(dto: CreateProductPriceDto) {
    try {
      return await this.prisma.productPrice.create({ data: dto, include });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll(productId?: number, priceTypeId?: number) {
    return this.prisma.productPrice.findMany({
      where: { product_id: productId, price_type_id: priceTypeId },
      include,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.productPrice.findUnique({
      where: { id },
      include,
    });
    if (!data) throw new NotFoundException(`Product price ${id} not found`);
    return data;
  }

  async update(id: number, dto: UpdateProductPriceDto) {
    try {
      return await this.prisma.productPrice.update({
        where: { id },
        data: dto,
        include,
      });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.productPrice.delete({ where: { id } });
    } catch (e) {
      this.handleError(e, id);
    }
  }

  private handleError(e: unknown, id?: number): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          throw new BadRequestException(
            'Price for this product and price type already exists',
          );
        case 'P2003':
          throw new BadRequestException('Invalid reference');
        case 'P2025':
          throw new NotFoundException(`Product price ${id ?? ''} not found`);
      }
    }
    throw e;
  }
}