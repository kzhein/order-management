import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthGuard } from './auth.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(AuthGuard) // Verify the mock token using AuthGuard
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @EventPattern('order_created')
  processPayment(data: Record<string, any>) {
    return this.paymentsService.processPayment(data);
  }
}
