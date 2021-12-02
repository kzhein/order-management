import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  constructor(@Inject('ORDER_SERVICE') private readonly client: ClientProxy) {}

  processPayment(data): void {
    const { orderId } = data;
    const processResult = Math.random() < 0.5; // mock payment process success or fail

    this.client.emit('order_processed', {
      status: processResult ? 'confirmed' : 'declined',
      orderId,
    });
  }
}
