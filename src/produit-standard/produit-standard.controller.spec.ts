import { Test, TestingModule } from '@nestjs/testing';
import { ProduitStandardController } from './produit-standard.controller';

describe('ProduitStandardController', () => {
  let controller: ProduitStandardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProduitStandardController],
    }).compile();

    controller = module.get<ProduitStandardController>(ProduitStandardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
