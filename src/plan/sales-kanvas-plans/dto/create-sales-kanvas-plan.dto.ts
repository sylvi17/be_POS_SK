
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createSalesKanvasPlanSchema = z
  .object({
    employee_id: z.number().int().positive(),
    vehicle_id: z.number().int().positive().optional(),
    market_area_id: z.number().int().positive().optional(),
    departure_date: z.coerce.date(),
    return_date: z.coerce.date().optional(),
    outlet_ids: z.array(z.number().int().positive()).optional(),
  })
  .strict();

export class CreateSalesKanvasPlanDto extends createZodDto(
  createSalesKanvasPlanSchema,
) {}
