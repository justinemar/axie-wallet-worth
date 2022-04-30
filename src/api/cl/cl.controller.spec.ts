import { Test, TestingModule } from '@nestjs/testing';
import { ClController } from './cl.controller';
import { ClService } from './cl.service';

describe('ClController', () => {
  let controller: ClController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClController],
      providers: [ClService],
    }).compile();

    controller = module.get<ClController>(ClController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
