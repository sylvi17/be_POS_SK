import { createZodDto } from 'nestjs-zod';
import { createWarehouseSchema } from './create-warehouse.dto';

export class UpdateWarehouseDto extends createZodDto(
  createWarehouseSchema.partial(),
) {}