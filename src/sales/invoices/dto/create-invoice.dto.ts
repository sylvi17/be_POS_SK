import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const detailSchema = z
  .object({
    product_id: z.number().int().positive(),
    batch: z.string().min(1).optional(),
    qty: z.number().int().positive(),
    // Bila kosong, harga diambil dari product-prices sesuai tipe harga outlet.
    price: z.number().min(0).optional(),
  })
  .strict();

export const createInvoiceSchema = z
  .object({
    date: z.coerce.date(),
    outlet_id: z.number().int().positive(),
    sales_kanvas_plan_id: z.number().int().positive().optional(),
    payment_type: z.enum(['CASH', 'TOP']),
    top_days: z.number().int().min(0).default(0),
    details: z.array(detailSchema).min(1),
  })
  .strict();

export class CreateInvoiceDto extends createZodDto(createInvoiceSchema) {}