import { createZodDto } from 'nestjs-zod';
import { createMarketAreaSchema } from './create-market-area.dto';

export class UpdateMarketAreaDto extends createZodDto(
  createMarketAreaSchema.partial(),
) {}