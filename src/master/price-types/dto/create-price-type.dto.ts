import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createPriceTypeSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
  })
  .strict();

export class CreatePriceTypeDto extends createZodDto(createPriceTypeSchema) {}