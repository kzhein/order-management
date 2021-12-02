import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    required: true,
    enum: ['created', 'confirmed', 'delivered', 'cancelled'],
  })
  state: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
