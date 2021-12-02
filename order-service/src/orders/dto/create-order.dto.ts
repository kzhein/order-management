import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  product: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;
}
