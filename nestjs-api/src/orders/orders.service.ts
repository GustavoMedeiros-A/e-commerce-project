import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
@Injectable()
export class OrdersService {
  
  constructor(
  
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private amqpConnection: AmqpConnection
  ) {

  }
  async create(createOrderDto: CreateOrderDto & { client_id: number }) {

    const productIds = createOrderDto.items.map(item => item.product_id);
    const uniqueProductIds = [... new Set(productIds)]
    const products = await this.productRepository.findBy({
       id: In(uniqueProductIds) ,
    })
    if(products.length !== uniqueProductIds.length) {
      throw new Error(`Some product is missing. Pass ${productIds}, and find ${products.map(item => item.id)}`);
    }

      const order = Order.create({
        client_id: createOrderDto.client_id,
        items: createOrderDto.items.map((item) => {
          const product = products.find((product) => product.id === item.product_id);
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            price: product.price,
          }
        }),

      })

      await this.orderRepository.save(order)
      // rotear para varias filas caso necessário
      // as exchanges roteam as messagens para varias filas
      await this.amqpConnection.publish('amq.direct', 'OrderCreated', {
        order_id: order.id,
        card_hash: createOrderDto.card_hash,
        total: order.total
      });
      console.log("is publish")
      return order;
  }

  findAll(client_id: number) {
    return this.orderRepository.find({
      where: { client_id },
      relations: ['items', 'items.product'],
    });
  }

  findOne(id: string, client_id: number) {
    return this.orderRepository.findOneByOrFail({
      id, client_id
    });
  }


  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
