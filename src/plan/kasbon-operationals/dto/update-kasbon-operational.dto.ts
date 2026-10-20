import { createZodDto } from 'nestjs-zod';
import { createKasbonOperationalSchema } from './create-kasbon-operational.dto';

export class UpdateKasbonOperationalDto extends createZodDto(
  createKasbonOperationalSchema.partial(),
) {}