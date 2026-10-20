import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createMarketAreaSchema = z
  .object({
    code: z.string().min(1).optional(),
    name: z.string().min(1),
    description: z.string().optional(),
  })
  .strict();

export class CreateMarketAreaDto extends createZodDto(createMarketAreaSchema) {}