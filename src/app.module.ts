import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProduitStandardModule } from './produit-standard/produit-standard.module';
import { DemandeSurMesureModule } from './demande-sur-mesure/demande-sur-mesure.module';
import { TraductionModule } from './traduction/traduction.module';

@Module({
  imports: [AuthModule, UserModule, ProduitStandardModule, DemandeSurMesureModule, TraductionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
