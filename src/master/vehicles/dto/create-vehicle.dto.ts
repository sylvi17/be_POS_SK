import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createVehicleSchema = z
  .object({
    plate_number: z.string().min(1),
    type: z.string().optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
  })
  .strict();

export class CreateVehicleDto extends createZodDto(createVehicleSchema) {}