import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const detailSchema = z
  .object({
    product_id: z.number().int().positive(),
    batch: z.string().min(1),
    qty: z.number().int().positive(),
  })
  .strict();

export const createProductInSchema = z
  .object({
    date: z.coerce.date(),
    warehouse_id: z.number().int().positive(),
    sales_kanvas_plan_id: z.number().int().positive().optional(),
    description: z.string().optional(),
    details: z.array(detailSchema).min(1),
  })
  .strict();

export class CreateProductInDto extends createZodDto(createProductInSchema) {}