import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.schema';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @EventPattern('order_processed')
  receivePaymentResult(data: Record<string, any>) {
    return this.ordersService.receivePaymentResult(data);
  }

  @Get()
  getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }

  @Get('/:id')
  getOrder(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrder(id);
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Patch('/:id/cancel')
  cancelOrder(@Param('id') id: string): Promise<Order> {
    return this.ordersService.cancelOrder(id);
  }
}
