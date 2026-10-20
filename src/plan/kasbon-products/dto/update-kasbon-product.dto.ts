import { createZodDto } from 'nestjs-zod';
import { createKasbonProductSchema } from './create-kasbon-product.dto';

// Bila `details` dikirim, seluruh detail lama diganti.
export class UpdateKasbonProductDto extends createZodDto(
  createKasbonProductSchema.partial(),
) {}