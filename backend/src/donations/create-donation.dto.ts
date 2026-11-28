
import { IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDonationDto {
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Nominal donasi harus berupa angka' },
  )
  @IsPositive({ message: 'Nominal donasi harus lebih dari 0' })
  @Min(1000, { message: 'Minimal donasi adalah Rp1.000' })
  amount: number;
}
