import { createZodDto } from 'nestjs-zod';
import { createOutletSchema } from './create-outlet.dto';

export class UpdateOutletDto extends createZodDto(
  createOutletSchema.partial(),
) {}