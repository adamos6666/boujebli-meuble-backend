import { Test, TestingModule } from '@nestjs/testing';
import { TraductionController } from './traduction.controller';

describe('TraductionController', () => {
  let controller: TraductionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TraductionController],
    }).compile();

    controller = module.get<TraductionController>(TraductionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
