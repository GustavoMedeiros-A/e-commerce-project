import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { CreateOrderDto } from "../dto/create-order.dto";

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

export type CreateOrderItemCommand = {
  product_id: string;
  quantity: number;
  price: number;
}


export type CreateOrderCommand = {
  client_id: number;
  items: CreateOrderItemCommand[]
}

@Entity()
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;
  
    @Column()
    client_id: number; //usuário autenticado
  
    @Column()
    status: OrderStatus = OrderStatus.PENDING;
  
    @CreateDateColumn()
    created_at: Date;
  
    @OneToMany(() => OrderItem, (item) => item.order, {
      cascade: ['insert'],
      eager: true,
    })
    items: OrderItem[];


    static create(input: CreateOrderCommand): Order {
      const order = new Order();
      order.client_id = input.client_id;
      order.items = input.items.map(item => {
          const orderItem = new OrderItem();
          orderItem.product_id = item.product_id;
          orderItem.quantity = item.quantity;
          orderItem.price = item.price;
          return orderItem;
      })

      order.total = order.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)

      return order;
    }

}
