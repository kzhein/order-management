import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  getOrders(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async getOrder(id: string): Promise<Order> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException('Order Not Found!');
    }

    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { price, quantity } = createOrderDto;
    const totalPrice = price * quantity;
    const state = 'created';
    const order = await this.orderModel.create({
      ...createOrderDto,
      totalPrice,
      state,
    });

    // trigger payments service to process payment
    this.client.emit('order_created', {
      token: 'this-is-a-valid-token', // send the mock token to payments service
      amount: totalPrice,
      orderId: order._id.toString(),
    });

    return order;
  }

  async receivePaymentResult(data: Record<string, any>) {
    console.log('order processed result: ', data);
    const { status, orderId } = data;

    // update order state based on the response from payments service
    await this.orderModel.findByIdAndUpdate(orderId, {
      state: status === 'confirmed' ? 'confirmed' : 'cancelled',
    });

    // Move order state to delivered after 15 seconds of confirmed unless it is already cancelled by the user
    if (status === 'confirmed') {
      setTimeout(async () => {
        const order = await this.orderModel.findById(orderId);
        if (order.state === 'cancelled') {
          return;
        }

        console.log(`moving the order:${orderId} to delivered state`);
        await this.orderModel.findByIdAndUpdate(orderId, {
          state: 'delivered',
        });
      }, 20000);
    }
  }

  cancelOrder(id: string): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(id, { state: 'cancelled' }, { new: true })
      .exec();
  }
}
