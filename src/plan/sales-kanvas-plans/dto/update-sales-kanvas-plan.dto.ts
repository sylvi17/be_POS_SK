
import { createZodDto } from 'nestjs-zod';
import { createSalesKanvasPlanSchema } from './create-sales-kanvas-plan.dto';

export const updateSalesKanvasPlanSchema =
  createSalesKanvasPlanSchema.partial();

export class UpdateSalesKanvasPlanDto extends createZodDto(
  updateSalesKanvasPlanSchema,
) {}
