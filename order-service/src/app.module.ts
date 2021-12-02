import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/tractive'),
    OrdersModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
