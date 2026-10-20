import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceReturnDto } from './create-invoice-return.dto';

export class UpdateInvoiceReturnDto extends PartialType(CreateInvoiceReturnDto) {}
