import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createEmployeeSchema = z
  .object({
    code: z.string().min(1).optional(),
    name: z.string().min(1),
    position: z.string().optional(),
    phone: z.string().optional(),
    is_active: z.boolean().optional(),
  })
  .strict();

export class CreateEmployeeDto extends createZodDto(createEmployeeSchema) {}