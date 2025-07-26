import { PartialType } from '@nestjs/swagger';
import { CreateDemandeSurMesureDto } from './create-demande-sur-mesure.dto';
 
export class UpdateDemandeSurMesureDto extends PartialType(CreateDemandeSurMesureDto) {} 