import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const detailSchema = z
  .object({
    product_id: z.number().int().positive(),
    batch: z.string().min(1).optional(),
    qty: z.number().int().positive(),
    price: z.number().min(0),
  })
  .strict();

export const createInvoiceReturnSchema = z
  .object({
    date: z.coerce.date(),
    outlet_id: z.number().int().positive(),
    invoice_outlet_id: z.number().int().positive().optional(),
    warehouse_id: z.number().int().positive().optional(),
    details: z.array(detailSchema).min(1),
  })
  .strict();

export class CreateInvoiceReturnDto extends createZodDto(
  createInvoiceReturnSchema,
) {}