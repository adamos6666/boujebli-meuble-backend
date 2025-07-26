import { Module } from '@nestjs/common';
import { ProduitStandardService } from './produit-standard.service';
import { ProduitStandardController } from './produit-standard.controller';

@Module({
  providers: [ProduitStandardService],
  controllers: [ProduitStandardController]
})
export class ProduitStandardModule {}
