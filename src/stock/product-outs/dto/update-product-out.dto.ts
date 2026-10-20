import { createZodDto } from 'nestjs-zod';
import { createProductOutSchema } from './create-product-out.dto';

// Hanya keterangan yang boleh diubah; item stok tidak diedit (hapus lalu buat ulang).
export class UpdateProductOutDto extends createZodDto(
  createProductOutSchema.pick({ description: true }),
) {}