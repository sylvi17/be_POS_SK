import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createWarehouseSchema = z
  .object({
    code: z.string().min(1).optional(),
    name: z.string().min(1),
    type: z.string().min(1), // contoh: UTAMA, KANVAS, RETUR
    description: z.string().optional(),
  })
  .strict();

export class CreateWarehouseDto extends createZodDto(createWarehouseSchema) {}