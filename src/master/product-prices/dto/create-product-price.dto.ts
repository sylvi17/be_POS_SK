import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createProductPriceSchema = z
  .object({
    product_id: z.number().int().positive(),
    price_type_id: z.number().int().positive(),
    price: z.number().min(0),
  })
  .strict();

export class CreateProductPriceDto extends createZodDto(
  createProductPriceSchema,
) {}