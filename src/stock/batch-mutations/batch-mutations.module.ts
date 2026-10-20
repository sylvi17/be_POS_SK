import { Module } from '@nestjs/common';
import { BatchMutationsService } from './batch-mutations.service';
import { BatchMutationsController } from './batch-mutations.controller';

@Module({
  controllers: [BatchMutationsController],
  providers: [BatchMutationsService],
})
export class BatchMutationsModule {}