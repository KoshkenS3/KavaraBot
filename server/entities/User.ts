import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { QuizResponse } from "./QuizResponse";
import { Order } from "./Order";
import { Notification } from "./Notification";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "varchar", nullable: true, unique: true })
  telegramId?: string;

  @Column({ type: "varchar", nullable: true })
  username?: string;

  @Column({ type: "varchar", nullable: true })
  firstName?: string;

  @Column({ type: "varchar", nullable: true })
  lastName?: string;

  @OneToMany(() => QuizResponse, (response) => response.user)
  quizResponses!: QuizResponse[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];
}