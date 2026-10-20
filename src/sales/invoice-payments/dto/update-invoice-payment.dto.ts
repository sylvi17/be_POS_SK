import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoicePaymentDto } from './create-invoice-payment.dto';

export class UpdateInvoicePaymentDto extends PartialType(CreateInvoicePaymentDto) {}
