import { Test, TestingModule } from '@nestjs/testing';
import { DemandeSurMesureService } from './demande-sur-mesure.service';

describe('DemandeSurMesureService', () => {
  let service: DemandeSurMesureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandeSurMesureService],
    }).compile();

    service = module.get<DemandeSurMesureService>(DemandeSurMesureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
