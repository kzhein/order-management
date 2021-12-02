import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';

const mockOrderModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
});

const mockClient = () => ({
  emit: jest.fn(),
});

const mockOrder = {
  product: 'product',
  price: 100,
  quantity: 1,
  totalPrice: 1,
  state: 'created',
};

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let orderModel;
  let client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken('Order'),
          useFactory: mockOrderModel,
        },
        {
          provide: 'PAYMENT_SERVICE',
          useFactory: mockClient,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    orderModel = module.get(getModelToken('Order'));
    client = module.get('PAYMENT_SERVICE');
  });

  describe('getOrders', () => {
    it('should call orderModel find method', async () => {
      orderModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockOrder]),
      });
      const orders = await ordersService.getOrders();
      expect(orders).toEqual([mockOrder]);
    });
  });

  describe('getOrder', () => {
    it('should throw BadRequestExcepion if mongodb id is invalid', async () => {
      expect(ordersService.getOrder('hello')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if order is not found', async () => {
      orderModel.findById.mockResolvedValue(null);
      expect(
        ordersService.getOrder('61a7650a11930412c40cd4ac'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return the order if found', async () => {
      orderModel.findById.mockResolvedValue(mockOrder);
      const order = await ordersService.getOrder('61a7650a11930412c40cd4ac');
      expect(order).toEqual(mockOrder);
    });
  });

  describe('createOrder', () => {
    it('should emit order_created event with token, amount, orderId and return created order', async () => {
      orderModel.create.mockResolvedValue({
        _id: {
          toString: () => '61a7650a11930412c40cd4ac',
        },
      });
      await ordersService.createOrder({
        product: 'product',
        price: 100,
        quantity: 3,
      });
      expect(client.emit.mock.calls).toEqual([
        [
          'order_created',
          {
            token: 'this-is-a-valid-token',
            amount: 300,
            orderId: '61a7650a11930412c40cd4ac',
          },
        ],
      ]);
    });
  });

  describe('receivePaymentResult', () => {
    it('should update order state according to status returned from payment result', async () => {
      await ordersService.receivePaymentResult({
        status: 'confirmed',
        orderId: '61a7650a11930412c40cd4ac',
      });
      await ordersService.receivePaymentResult({
        status: 'declined',
        orderId: '61a7650a11930412c40cd4ac',
      });

      expect(orderModel.findByIdAndUpdate.mock.calls).toEqual([
        ['61a7650a11930412c40cd4ac', { state: 'confirmed' }],
        ['61a7650a11930412c40cd4ac', { state: 'cancelled' }],
      ]);
    });
  });

  describe('cancelOrder', () => {
    it('should update order with cancelled state', async () => {
      orderModel.findByIdAndUpdate.mockReturnValue({
        exec: () => {},
      });
      await ordersService.cancelOrder('61a7650a11930412c40cd4ac');
      expect(orderModel.findByIdAndUpdate.mock.calls).toEqual([
        ['61a7650a11930412c40cd4ac', { state: 'cancelled' }, { new: true }],
      ]);
    });
  });
});
