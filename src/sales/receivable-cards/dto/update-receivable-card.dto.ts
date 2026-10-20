import { PartialType } from '@nestjs/mapped-types';
import { CreateReceivableCardDto } from './create-receivable-card.dto';

export class UpdateReceivableCardDto extends PartialType(CreateReceivableCardDto) {}
