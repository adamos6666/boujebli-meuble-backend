import { Test, TestingModule } from '@nestjs/testing';
import { ProduitStandardService } from './produit-standard.service';

describe('ProduitStandardService', () => {
  let service: ProduitStandardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProduitStandardService],
    }).compile();

    service = module.get<ProduitStandardService>(ProduitStandardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
