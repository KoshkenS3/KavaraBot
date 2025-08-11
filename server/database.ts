import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { QuizResponse } from "./entities/QuizResponse";
import { Box } from "./entities/Box";
import { Order } from "./entities/Order";
import { Notification } from "./entities/Notification";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true, // Only for development
  logging: true, // Enable logging for debugging
  entities: [User, QuizResponse, Box, Order, Notification],
  // ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  dropSchema: false, // Don't drop schema automatically
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully with TypeORM");
    
    // Seed initial data using TypeORM
    await seedDatabase();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

async function seedDatabase() {
  const boxRepository = AppDataSource.getRepository(Box);
  
  const existingBoxes = await boxRepository.count();
  if (existingBoxes > 0) {
    console.log("Database already seeded");
    return;
  }

  const boxes = [
    {
      name: "ФИТНЕС КОМПЛЕКТ",
      description: "Полный набор для тренировок в спортзале",
      price: 8990,
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      contents: ["Спортивная футболка KAVARA", "Шорты для тренировок", "Спортивные носки", "Полотенце"],
      category: "ready",
      emoji: "💪",
      isAvailable: true,
    },
    {
      name: "БЕГОВОЙ НАБОР",
      description: "Легкая и дышащая одежда для бега",
      price: 7490,
      imageUrl: "https://images.unsplash.com/photo-1506629905877-c1e5027f5b6c",
      contents: ["Беговая футболка", "Беговые шорты", "Компрессионные гетры"],
      category: "ready",
      emoji: "🏃‍♂️",
      isAvailable: true,
    },
    {
      name: "ЙОГА СТИЛЬ",
      description: "Комфортная одежда для йоги и растяжки",
      price: 6990,
      imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5a",
      contents: ["Топ для йоги", "Леггинсы", "Коврик для йоги"],
      category: "ready",
      emoji: "🧘‍♀️",
      isAvailable: true,
    },
    {
      name: "ПРЕМИУМ СПОРТ",
      description: "Элитная коллекция для профессиональных спортсменов",
      price: 15990,
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
      contents: ["Премиум футболка", "Компрессионные шорты", "Профессиональные аксессуары"],
      category: "ready",
      emoji: "⭐",
      isAvailable: false,
    },
    {
      name: "ЗИМНИЙ СПОРТ",
      description: "Теплая спортивная одежда для холодного времени года",
      price: 11990,
      imageUrl: "https://images.unsplash.com/photo-1594736797933-d0b22ce8cd6c",
      contents: ["Утепленная куртка", "Термобелье", "Зимние аксессуары"],
      category: "ready",
      emoji: "❄️",
      isAvailable: false,
    },
    // Personal boxes
    {
      name: "СИЛОВЫЕ ТРЕНИРОВКИ",
      description: "Комплект для тренировок с железом",
      price: 9990,
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      contents: ["Компрессионная футболка", "Шорты для тренировок", "Перчатки для зала"],
      category: "personal",
      emoji: "🏋️‍♂️",
      isAvailable: true,
    },
    {
      name: "КАРДИО МИКС",
      description: "Легкая одежда для кардио тренировок",
      price: 8490,
      imageUrl: "https://images.unsplash.com/photo-1506629905877-c1e5027f5b6c",
      contents: ["Дышащая футболка", "Легкие шорты", "Спортивные кроссовки"],
      category: "personal",
      emoji: "🏃‍♀️",
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

  await boxRepository.save(boxes);
  console.log("Database seeded with initial boxes using TypeORM");
}