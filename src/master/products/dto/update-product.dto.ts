import { createZodDto } from 'nestjs-zod';
import { createProductSchema } from './create-product.dto';

export class UpdateProductDto extends createZodDto(
  createProductSchema.partial(),
) {}