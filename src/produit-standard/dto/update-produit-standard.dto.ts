import { PartialType } from '@nestjs/swagger';
import { CreateProduitStandardDto } from './create-produit-standard.dto';
 
export class UpdateProduitStandardDto extends PartialType(CreateProduitStandardDto) {} 