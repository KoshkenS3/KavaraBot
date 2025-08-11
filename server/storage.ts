import { getPool } from "./database";
import type { 
  User,
  QuizResponse,
  Box,
  Order,
  Notification,
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
  private pool = getPool;

  async getUser(id: string): Promise<User | null> {
    const client = this.pool();
    const { rows } = await client.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    const client = this.pool();
    const { rows } = await client.query(
      "SELECT * FROM users WHERE telegram_id = $1",
      [telegramId]
    );
    return rows[0] || null;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const client = this.pool();
    const { rows } = await client.query(
      `INSERT INTO users (telegram_id, username, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userData.telegramId, userData.username, userData.firstName, userData.lastName]
    );
    return rows[0];
  }

  async getQuizResponse(userId: string): Promise<QuizResponse | null> {
    const client = this.pool();
    const { rows } = await client.query(
      "SELECT * FROM quiz_responses WHERE user_id = $1",
      [userId]
    );
    return rows[0] || null;
  }

  async createQuizResponse(responseData: CreateQuizResponseDto): Promise<QuizResponse> {
    const client = this.pool();
    const { rows } = await client.query(
      `INSERT INTO quiz_responses (user_id, size, height, weight, goals, budget)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [responseData.userId, responseData.size, responseData.height, responseData.weight, responseData.goals, responseData.budget]
    );
    return rows[0];
  }

  async updateQuizResponse(userId: string, updateData: Partial<CreateQuizResponseDto>): Promise<QuizResponse | null> {
    const client = this.pool();
    const existing = await this.getQuizResponse(userId);
    if (!existing) return null;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.size !== undefined) {
      fields.push(`size = $${paramIndex++}`);
      values.push(updateData.size);
    }
    if (updateData.height !== undefined) {
      fields.push(`height = $${paramIndex++}`);
      values.push(updateData.height);
    }
    if (updateData.weight !== undefined) {
      fields.push(`weight = $${paramIndex++}`);
      values.push(updateData.weight);
    }
    if (updateData.goals !== undefined) {
      fields.push(`goals = $${paramIndex++}`);
      values.push(updateData.goals);
    }
    if (updateData.budget !== undefined) {
      fields.push(`budget = $${paramIndex++}`);
      values.push(updateData.budget);
    }

    if (fields.length === 0) return existing;

    values.push(userId);
    const { rows } = await client.query(
      `UPDATE quiz_responses SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`,
      values
    );
    return rows[0];
  }

  async getAllBoxes(): Promise<Box[]> {
    const client = this.pool();
    const { rows } = await client.query("SELECT * FROM boxes ORDER BY created_at DESC");
    return rows;
  }

  async getBox(id: string): Promise<Box | null> {
    const client = this.pool();
    const { rows } = await client.query(
      "SELECT * FROM boxes WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async getBoxesByCategory(category: string): Promise<Box[]> {
    const client = this.pool();
    const { rows } = await client.query(
      "SELECT * FROM boxes WHERE category = $1 ORDER BY created_at DESC",
      [category]
    );
    return rows;
  }

  async createBox(boxData: CreateBoxDto): Promise<Box> {
    const client = this.pool();
    const { rows } = await client.query(
      `INSERT INTO boxes (name, description, price, image_url, contents, category, emoji, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [boxData.name, boxData.description, boxData.price, boxData.imageUrl, boxData.contents, boxData.category, boxData.emoji, boxData.isAvailable ?? true]
    );
    return rows[0];
  }

  async getOrder(id: string): Promise<Order | null> {
    const client = this.pool();
    const { rows } = await client.query(
      "SELECT * FROM orders WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const client = this.pool();
    const { rows } = await client.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const client = this.pool();
    const orderNumber = `KB${Date.now().toString().slice(-6)}`;
    const { rows } = await client.query(
      `INSERT INTO orders (order_number, user_id, box_id, customer_name, customer_phone, customer_email, delivery_method, payment_method, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [orderNumber, orderData.userId, orderData.boxId, orderData.customerName, orderData.customerPhone, orderData.customerEmail, orderData.deliveryMethod, orderData.paymentMethod, orderData.totalPrice, "pending"]
    );
    return rows[0];
  }

  async createNotification(notificationData: CreateNotificationDto): Promise<Notification> {
    const client = this.pool();
    const { rows } = await client.query(
      `INSERT INTO notifications (user_id, box_id)
       VALUES ($1, $2)
       RETURNING *`,
      [notificationData.userId, notificationData.boxId]
    );
    return rows[0];
  }

  async getNotificationsByBox(boxId: string): Promise<Notification[]> {
    const client = this.pool();
    const { rows } = await client.query(
      "SELECT * FROM notifications WHERE box_id = $1 ORDER BY created_at DESC",
      [boxId]
    );
    return rows;
  }
}

export const storage = new DatabaseStorage();