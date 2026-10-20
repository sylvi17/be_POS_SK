import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createOutletSchema = z
  .object({
    code: z.string().min(1).optional(),
    name: z.string().min(1),
    address: z.string().optional(),
    phone: z.string().optional(),
    market_area_id: z.number().int().positive().optional(),
    price_type_id: z.number().int().positive(),
    receivable_limit: z.number().min(0).optional(),
    is_active: z.boolean().optional(),
  })
  .strict();

export class CreateOutletDto extends createZodDto(createOutletSchema) {}