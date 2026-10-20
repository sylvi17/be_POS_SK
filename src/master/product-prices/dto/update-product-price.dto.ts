import { createZodDto } from 'nestjs-zod';
import { createProductPriceSchema } from './create-product-price.dto';

export class UpdateProductPriceDto extends createZodDto(
  createProductPriceSchema.partial(),
) {}