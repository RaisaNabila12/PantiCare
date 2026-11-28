import { Test, TestingModule } from '@nestjs/testing';
import { DonationTargetService } from './donation-target.service.js';

describe('DonationTargetService', () => {
  let service: DonationTargetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationTargetService],
    }).compile();

    service = module.get<DonationTargetService>(DonationTargetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
