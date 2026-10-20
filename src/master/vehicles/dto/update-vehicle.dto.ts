import { createZodDto } from 'nestjs-zod';
import { createVehicleSchema } from './create-vehicle.dto';

export class UpdateVehicleDto extends createZodDto(
  createVehicleSchema.partial(),
) {}