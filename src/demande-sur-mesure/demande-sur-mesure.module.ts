import { Module } from '@nestjs/common';
import { DemandeSurMesureService } from './demande-sur-mesure.service';
import { DemandeSurMesureController } from './demande-sur-mesure.controller';

@Module({
  providers: [DemandeSurMesureService],
  controllers: [DemandeSurMesureController]
})
export class DemandeSurMesureModule {}
