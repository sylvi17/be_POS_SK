import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createInvoicePaymentSchema = z
  .object({
    invoice_outlet_id: z.number().int().positive(),
    date: z.coerce.date(),
    amount: z.number().positive(),
  })
  .strict();

export class CreateInvoicePaymentDto extends createZodDto(
  createInvoicePaymentSchema,
) {}