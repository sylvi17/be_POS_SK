import { createZodDto } from 'nestjs-zod';
import { createPriceTypeSchema } from './create-price-type.dto';

export class UpdatePriceTypeDto extends createZodDto(
  createPriceTypeSchema.partial(),
) {}