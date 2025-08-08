import { 
  type User, 
  type InsertUser,
  type QuizResponse,
  type InsertQuizResponse,
  type Box,
  type InsertBox,
  type Order,
  type InsertOrder,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Quiz Responses
  getQuizResponse(userId: string): Promise<QuizResponse | undefined>;
  createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse>;
  updateQuizResponse(userId: string, response: Partial<InsertQuizResponse>): Promise<QuizResponse | undefined>;

  // Boxes
  getAllBoxes(): Promise<Box[]>;
  getBox(id: string): Promise<Box | undefined>;
  getBoxesByCategory(category: string): Promise<Box[]>;
  createBox(box: InsertBox): Promise<Box>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByBox(boxId: string): Promise<Notification[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private quizResponses: Map<string, QuizResponse> = new Map();
  private boxes: Map<string, Box> = new Map();
  private orders: Map<string, Order> = new Map();
  private notifications: Map<string, Notification> = new Map();

  constructor() {
    this.initializeBoxes();
  }

  private initializeBoxes() {
    // Ready boxes - KAVARA martial arts collections
    const readyBoxes: InsertBox[] = [
      {
        name: "FIGHTER BOX",
        description: "Полный комплект для бойца - рашгард, шорты и защита",
        price: 12990,
        imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed",
        contents: ["Рашгард KAVARA Fighter", "Шорты для ММА", "Защита голени", "Мундштук"],
        category: "ready",
        emoji: "🥊",
        isAvailable: true,
      },
      {
        name: "GRAPPLER BOX",
        description: "Специально для грэпплинга и борьбы на земле",
        price: 10990,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        contents: ["Рашгард компрессионный", "Шорты для грэпплинга", "Наколенники"],
        category: "ready",
        emoji: "🤼",
        isAvailable: true,
      },
      {
        name: "STRIKER BOX",
        description: "Для ударных тренировок - бокс, муай тай, кикбоксинг",
        price: 11990,
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5a",
        contents: ["Футболка KAVARA Strike", "Шорты для бокса", "Бинты боксерские", "Перчатки тренировочные"],
        category: "ready",
        emoji: "👊",
        isAvailable: true,
      },
      // Coming soon boxes
      {
        name: "WARRIOR BOX",
        description: "Премиум комплект для профессиональных бойцов",
        price: 18990,
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
        contents: ["Рашгард Pro Series", "Шорты Pro Series", "Профессиональная защита", "Именная нашивка"],
        category: "ready",
        emoji: "⚔️",
        isAvailable: false,
      },
      {
        name: "BEGINNER BOX",
        description: "Стартовый набор для новичков в боевых искусствах",
        price: 7990,
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0b22ce8cd6c",
        contents: ["Базовая футболка KAVARA", "Шорты для тренировок", "Защитный набор", "Руководство новичка"],
        category: "ready",
        emoji: "🌱",
        isAvailable: false,
      },
      {
        name: "БОКС БЕГ",
        description: "Специализированный набор для бегунов",
        price: 10490,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        contents: ["Беговая майка", "Компрессионные тайтсы", "Беговые кроссовки"],
        category: "ready",
        emoji: "🏃‍♂️",
        isAvailable: false,
      },
    ];

    // Personal boxes templates
    const personalBoxes: InsertBox[] = [
      {
        name: "ФИТНЕС КОМФОРТ",
        description: "Идеальный набор для кардио и силовых тренировок",
        price: 8990,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        contents: ["Спортивный топ", "Леггинсы high-waist", "Спортивные кроссовки"],
        category: "personal",
        emoji: "💪",
        isAvailable: true,
      },
      {
        name: "АКТИВНЫЙ СТИЛЬ",
        description: "Стильный комплект для бега и активного образа жизни",
        price: 7490,
        imageUrl: "https://images.unsplash.com/photo-1506629905877-c1e5027f5b6c",
        contents: ["Беговая футболка", "Спортивные шорты", "Беговые кроссовки"],
        category: "personal",
        emoji: "🏃‍♂️",
        isAvailable: true,
      },
      {
        name: "ПРЕМИУМ ФИТНЕС",
        description: "Профессиональный набор из премиальных материалов",
        price: 12990,
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5a",
        contents: ["Компрессионный топ", "Премиум леггинсы", "Профессиональные кроссовки"],
        category: "personal",
        emoji: "⭐",
        isAvailable: true,
      },
    ];

    [...readyBoxes, ...personalBoxes].forEach(insertBox => {
      const id = randomUUID();
      const box: Box = {
        id, 
        createdAt: new Date(),
        name: insertBox.name,
        description: insertBox.description ?? null,
        price: insertBox.price,
        imageUrl: insertBox.imageUrl ?? null,
        contents: insertBox.contents ?? null,
        category: insertBox.category ?? null,
        emoji: insertBox.emoji ?? null,
        isAvailable: insertBox.isAvailable ?? true,
      };
      this.boxes.set(id, box);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.telegramId === telegramId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id, 
      createdAt: new Date(),
      telegramId: insertUser.telegramId ?? null,
      username: insertUser.username ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getQuizResponse(userId: string): Promise<QuizResponse | undefined> {
    return Array.from(this.quizResponses.values()).find(response => response.userId === userId);
  }

  async createQuizResponse(insertResponse: InsertQuizResponse): Promise<QuizResponse> {
    const id = randomUUID();
    const response: QuizResponse = { 
      id, 
      createdAt: new Date(),
      userId: insertResponse.userId ?? null,
      size: insertResponse.size ?? null,
      height: insertResponse.height ?? null,
      weight: insertResponse.weight ?? null,
      goals: insertResponse.goals ?? null,
      budget: insertResponse.budget ?? null,
    };
    this.quizResponses.set(id, response);
    return response;
  }

  async updateQuizResponse(userId: string, updateData: Partial<InsertQuizResponse>): Promise<QuizResponse | undefined> {
    const existing = await this.getQuizResponse(userId);
    if (!existing) return undefined;
    
    const updated: QuizResponse = { 
      ...existing, 
      size: updateData.size !== undefined ? updateData.size ?? null : existing.size,
      height: updateData.height !== undefined ? updateData.height ?? null : existing.height,
      weight: updateData.weight !== undefined ? updateData.weight ?? null : existing.weight,
      goals: updateData.goals !== undefined ? updateData.goals ?? null : existing.goals,
      budget: updateData.budget !== undefined ? updateData.budget ?? null : existing.budget,
    };
    this.quizResponses.set(existing.id, updated);
    return updated;
  }

  async getAllBoxes(): Promise<Box[]> {
    return Array.from(this.boxes.values());
  }

  async getBox(id: string): Promise<Box | undefined> {
    return this.boxes.get(id);
  }

  async getBoxesByCategory(category: string): Promise<Box[]> {
    return Array.from(this.boxes.values()).filter(box => box.category === category);
  }

  async createBox(insertBox: InsertBox): Promise<Box> {
    const id = randomUUID();
    const box: Box = { 
      id, 
      createdAt: new Date(),
      name: insertBox.name,
      description: insertBox.description ?? null,
      price: insertBox.price,
      imageUrl: insertBox.imageUrl ?? null,
      contents: insertBox.contents ?? null,
      category: insertBox.category ?? null,
      emoji: insertBox.emoji ?? null,
      isAvailable: insertBox.isAvailable ?? true,
    };
    this.boxes.set(id, box);
    return box;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNumber = `KB${Date.now().toString().slice(-6)}`;
    const order: Order = { 
      id, 
      orderNumber,
      createdAt: new Date(),
      userId: insertOrder.userId ?? null,
      boxId: insertOrder.boxId ?? null,
      customerName: insertOrder.customerName,
      customerPhone: insertOrder.customerPhone,
      customerEmail: insertOrder.customerEmail ?? null,
      deliveryMethod: insertOrder.deliveryMethod,
      paymentMethod: insertOrder.paymentMethod,
      totalPrice: insertOrder.totalPrice,
      status: "pending",
    };
    this.orders.set(id, order);
    return order;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { 
      id, 
      createdAt: new Date(),
      userId: insertNotification.userId ?? null,
      boxId: insertNotification.boxId ?? null,
      email: insertNotification.email ?? null,
      phone: insertNotification.phone ?? null,
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByBox(boxId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(notification => notification.boxId === boxId);
  }
}

export const storage = new MemStorage();
