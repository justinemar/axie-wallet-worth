import { Test, TestingModule } from '@nestjs/testing';
import { ClService } from './cl.service';

describe('ClService', () => {
  let service: ClService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClService],
    }).compile();

    service = module.get<ClService>(ClService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
