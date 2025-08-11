import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Box } from "./Box";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  orderNumber!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "uuid", nullable: true })
  userId?: string;

  @Column({ type: "uuid", nullable: true })
  boxId?: string;

  @Column({ type: "varchar" })
  customerName!: string;

  @Column({ type: "varchar" })
  customerPhone!: string;

  @Column({ type: "varchar", nullable: true })
  customerEmail?: string;

  @Column({ type: "varchar" })
  deliveryMethod!: string;

  @Column({ type: "varchar" })
  paymentMethod!: string;

  @Column({ type: "integer" })
  totalPrice!: number;

  @Column({ type: "varchar", default: "pending" })
  status!: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Box, (box) => box.orders, { onDelete: "SET NULL" })
  @JoinColumn({ name: "boxId" })
  box!: Box;
}