import { PartialType } from '@nestjs/swagger';
import { CreateTraductionDto } from './create-traduction.dto';
 
export class UpdateTraductionDto extends PartialType(CreateTraductionDto) {} 