import { createZodDto } from 'nestjs-zod';
import { createEmployeeSchema } from './create-employee.dto';

export class UpdateEmployeeDto extends createZodDto(
  createEmployeeSchema.partial(),
) {}