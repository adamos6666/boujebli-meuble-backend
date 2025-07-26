import { Test, TestingModule } from '@nestjs/testing';
import { DemandeSurMesureController } from './demande-sur-mesure.controller';

describe('DemandeSurMesureController', () => {
  let controller: DemandeSurMesureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandeSurMesureController],
    }).compile();

    controller = module.get<DemandeSurMesureController>(DemandeSurMesureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
