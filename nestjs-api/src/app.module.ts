import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { AuthModule } from './auth/auth.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'root',
      database: 'orders',
      entities: [Product, Order, OrderItem],
      synchronize: true,
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
    RabbitmqModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
