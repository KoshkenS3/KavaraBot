import { Repository } from "typeorm";
import { AppDataSource } from "./database";
import { User } from "./entities/User";
import { QuizResponse } from "./entities/QuizResponse";
import { Box } from "./entities/Box";
import { Order } from "./entities/Order";
import { Notification } from "./entities/Notification";
import type { 
  CreateUserDto, 
  CreateQuizResponseDto, 
  CreateBoxDto, 
  CreateOrderDto, 
  CreateNotificationDto 
} from "@shared/types";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | null>;
  getUserByTelegramId(telegramId: string): Promise<User | null>;
  createUser(user: CreateUserDto): Promise<User>;

  // Quiz Responses
  getQuizResponse(userId: string): Promise<QuizResponse | null>;
  createQuizResponse(response: CreateQuizResponseDto): Promise<QuizResponse>;
  updateQuizResponse(userId: string, response: Partial<CreateQuizResponseDto>): Promise<QuizResponse | null>;

  // Boxes
  getAllBoxes(): Promise<Box[]>;
  getBox(id: string): Promise<Box | null>;
  getBoxesByCategory(category: string): Promise<Box[]>;
  createBox(box: CreateBoxDto): Promise<Box>;

  // Orders
  getOrder(id: string): Promise<Order | null>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: CreateOrderDto): Promise<Order>;

  // Notifications
  createNotification(notification: CreateNotificationDto): Promise<Notification>;
  getNotificationsByBox(boxId: string): Promise<Notification[]>;
}

export class DatabaseStorage implements IStorage {
  private userRepository: Repository<User>;
  private quizResponseRepository: Repository<QuizResponse>;
  private boxRepository: Repository<Box>;
  private orderRepository: Repository<Order>;
  private notificationRepository: Repository<Notification>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.quizResponseRepository = AppDataSource.getRepository(QuizResponse);
    this.boxRepository = AppDataSource.getRepository(Box);
    this.orderRepository = AppDataSource.getRepository(Order);
    this.notificationRepository = AppDataSource.getRepository(Notification);
  }

  async getUser(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ telegramId });
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      telegramId: userData.telegramId,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
    return await this.userRepository.save(user);
  }

  async getQuizResponse(userId: string): Promise<QuizResponse | null> {
    return await this.quizResponseRepository.findOneBy({ userId });
  }

  async getQuizResponseByTelegramId(telegramId: string): Promise<QuizResponse | null> {
    const user = await this.getUserByTelegramId(telegramId);
    if (!user) return null;
    return await this.quizResponseRepository.findOneBy({ userId: user.id });
  }

  async createQuizResponse(responseData: CreateQuizResponseDto): Promise<QuizResponse> {
    // If userId looks like telegramId (numeric string), find the actual user
    let actualUserId = responseData.userId;
    if (responseData.userId && /^\d+$/.test(responseData.userId)) {
      const user = await this.getUserByTelegramId(responseData.userId);
      if (user) {
        actualUserId = user.id;
      }
    }

    const response = this.quizResponseRepository.create({
      userId: actualUserId,
      size: responseData.size,
      height: responseData.height,
      weight: responseData.weight,
      goals: responseData.goals,
      budget: responseData.budget,
    });
    return await this.quizResponseRepository.save(response);
  }

  async updateQuizResponse(userId: string, updateData: Partial<CreateQuizResponseDto>): Promise<QuizResponse | null> {
    // If userId looks like telegramId (numeric string), find the actual user
    let actualUserId = userId;
    if (userId && /^\d+$/.test(userId)) {
      const user = await this.getUserByTelegramId(userId);
      if (user) {
        actualUserId = user.id;
      }
    }

    const existing = await this.getQuizResponse(actualUserId);
    if (!existing) return null;
    
    Object.assign(existing, {
      size: updateData.size ?? existing.size,
      height: updateData.height ?? existing.height,
      weight: updateData.weight ?? existing.weight,
      goals: updateData.goals ?? existing.goals,
      budget: updateData.budget ?? existing.budget,
    });
    
    return await this.quizResponseRepository.save(existing);
  }

  async getAllBoxes(): Promise<Box[]> {
    return await this.boxRepository.find({
      order: { createdAt: "DESC" }
    });
  }

  async getBox(id: string): Promise<Box | null> {
    return await this.boxRepository.findOneBy({ id });
  }

  async getBoxesByCategory(category: string): Promise<Box[]> {
    return await this.boxRepository.find({
      where: { category },
      order: { createdAt: "DESC" }
    });
  }

  async createBox(boxData: CreateBoxDto): Promise<Box> {
    const box = this.boxRepository.create({
      name: boxData.name,
      description: boxData.description,
      price: boxData.price,
      imageUrl: boxData.imageUrl,
      contents: boxData.contents,
      category: boxData.category,
      emoji: boxData.emoji,
      isAvailable: boxData.isAvailable ?? true,
    });
    return await this.boxRepository.save(box);
  }

  async getOrder(id: string): Promise<Order | null> {
    return await this.orderRepository.findOneBy({ id });
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    // If userId looks like telegramId (numeric string), find the actual user
    let actualUserId = userId;
    if (userId && /^\d+$/.test(userId)) {
      const user = await this.getUserByTelegramId(userId);
      if (user) {
        actualUserId = user.id;
      }
    }

    return await this.orderRepository.find({
      where: { userId: actualUserId },
      order: { createdAt: "DESC" }
    });
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    // If userId looks like telegramId (numeric string), find the actual user
    let actualUserId = orderData.userId;
    if (orderData.userId && /^\d+$/.test(orderData.userId)) {
      const user = await this.getUserByTelegramId(orderData.userId);
      if (user) {
        actualUserId = user.id;
      }
    }

    const orderNumber = `KB${Date.now().toString().slice(-6)}`;
    const order = this.orderRepository.create({
      orderNumber,
      userId: actualUserId,
      boxId: orderData.boxId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryMethod: orderData.deliveryMethod,
      paymentMethod: orderData.paymentMethod,
      totalPrice: orderData.totalPrice,
      status: "pending",
    });
    return await this.orderRepository.save(order);
  }

  async createNotification(notificationData: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: notificationData.userId,
      boxId: notificationData.boxId,
    });
    return await this.notificationRepository.save(notification);
  }

  async getNotificationsByBox(boxId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { boxId },
      order: { createdAt: "DESC" }
    });
  }
}

export const storage = new DatabaseStorage();