import { Module } from '@nestjs/common';
import { TraductionService } from './traduction.service';
import { TraductionController } from './traduction.controller';

@Module({
  providers: [TraductionService],
  controllers: [TraductionController]
})
export class TraductionModule {}
