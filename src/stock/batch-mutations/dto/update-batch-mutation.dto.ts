import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchMutationDto } from './create-batch-mutation.dto';

export class UpdateBatchMutationDto extends PartialType(CreateBatchMutationDto) {}
