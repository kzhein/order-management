import { IsNotEmpty } from 'class-validator';

export class ProcessPaymentDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  orderId: string;
}
