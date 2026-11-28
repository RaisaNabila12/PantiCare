import { Test, TestingModule } from '@nestjs/testing';
import { DonationTargetController } from './donation-target.controller.js';

describe('DonationTargetController', () => {
  let controller: DonationTargetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationTargetController],
    }).compile();

    controller = module.get<DonationTargetController>(DonationTargetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
