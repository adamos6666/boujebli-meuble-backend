import { Test, TestingModule } from '@nestjs/testing';
import { TraductionService } from './traduction.service';

describe('TraductionService', () => {
  let service: TraductionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TraductionService],
    }).compile();

    service = module.get<TraductionService>(TraductionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
