import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

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

}
