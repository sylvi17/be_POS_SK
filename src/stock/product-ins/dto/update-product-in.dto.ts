import { createZodDto } from 'nestjs-zod';
import { createProductInSchema } from './create-product-in.dto';

// Hanya keterangan yang boleh diubah.
export class UpdateProductInDto extends createZodDto(
  createProductInSchema.pick({ description: true }),
) {}