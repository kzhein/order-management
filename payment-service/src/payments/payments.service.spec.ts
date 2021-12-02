import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';

const mockClient = () => ({
  emit: jest.fn(),
});

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: 'ORDER_SERVICE',
          useFactory: mockClient,
        },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
    client = module.get('ORDER_SERVICE');
  });

  describe('processPayment', () => {
    it('should emit order_processed event with given orderId', async () => {
      await paymentsService.processPayment({ orderId: 'abc' });
      expect(client.emit.mock.calls[0][1].orderId).toBe('abc');
    });
  });
});
