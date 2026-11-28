import { Test, TestingModule } from '@nestjs/testing';
import { DonationReportsService } from './donation-reports.service.js';

describe('DonationReportsService', () => {
  let service: DonationReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationReportsService],
    }).compile();

    service = module.get<DonationReportsService>(DonationReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
