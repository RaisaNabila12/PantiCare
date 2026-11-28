import { Test, TestingModule } from '@nestjs/testing';
import { DonationReportsController } from './donation-reports.controller.js';

describe('DonationReportsController', () => {
  let controller: DonationReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationReportsController],
    }).compile();

    controller = module.get<DonationReportsController>(DonationReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
