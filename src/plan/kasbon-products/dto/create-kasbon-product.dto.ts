import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const detailSchema = z
  .object({
    product_id: z.number().int().positive(),
    qty: z.number().int().positive(),
    price: z.number().min(0).optional(),
  })
  .strict();

export const createKasbonProductSchema = z
  .object({
    sales_kanvas_plan_id: z.number().int().positive(),
    employee_id: z.number().int().positive(),
    date: z.coerce.date(),
    description: z.string().optional(),
    details: z.array(detailSchema).min(1),
  })
  .strict();

export class CreateKasbonProductDto extends createZodDto(
  createKasbonProductSchema,
) {}