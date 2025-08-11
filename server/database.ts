import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

let pool: Pool | null = null;

export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
    
    await createTables();
    await seedDatabase();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error("Database not initialized");
  }
  return pool;
}

async function createTables() {
  const client = pool!;
  
  await client.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      telegram_id TEXT UNIQUE,
      username TEXT,
      first_name TEXT,
      last_name TEXT
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS quiz_responses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_id UUID REFERENCES users(id),
      size TEXT,
      height TEXT,
      weight TEXT,
      goals TEXT[],
      budget TEXT
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS boxes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image_url TEXT,
      contents TEXT[],
      category TEXT,
      emoji TEXT,
      is_available BOOLEAN DEFAULT true
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_number TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_id UUID REFERENCES users(id),
      box_id UUID REFERENCES boxes(id),
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      delivery_method TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      total_price INTEGER NOT NULL,
      status TEXT DEFAULT 'pending'
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_id UUID NOT NULL REFERENCES users(id),
      box_id UUID NOT NULL REFERENCES boxes(id)
    );
  `);

  console.log("Database tables created successfully");
}

async function seedDatabase() {
  const client = pool!;
  
  const { rows } = await client.query("SELECT COUNT(*) FROM boxes");
  if (parseInt(rows[0].count) > 0) {
    console.log("Database already seeded");
    return;
  }

  const boxes = [
    {
      name: "ФИТНЕС КОМПЛЕКТ",
      description: "Полный набор для тренировок в спортзале",
      price: 8990,
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      contents: ["Спортивная футболка KAVARA", "Шорты для тренировок", "Спортивные носки", "Полотенце"],
      category: "ready",
      emoji: "💪",
      is_available: true,
    },
    {
      name: "БЕГОВОЙ НАБОР",
      description: "Легкая и дышащая одежда для бега",
      price: 7490,
      image_url: "https://images.unsplash.com/photo-1506629905877-c1e5027f5b6c",
      contents: ["Беговая футболка", "Беговые шорты", "Компрессионные гетры"],
      category: "ready",
      emoji: "🏃‍♂️",
      is_available: true,
    },
    {
      name: "ЙОГА СТИЛЬ",
      description: "Комфортная одежда для йоги и растяжки",
      price: 6990,
      image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5a",
      contents: ["Топ для йоги", "Леггинсы", "Коврик для йоги"],
      category: "ready",
      emoji: "🧘‍♀️",
      is_available: true,
    },
    {
      name: "ПРЕМИУМ СПОРТ",
      description: "Элитная коллекция для профессиональных спортсменов",
      price: 15990,
      image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
      contents: ["Премиум футболка", "Компрессионные шорты", "Профессиональные аксессуары"],
      category: "ready",
      emoji: "⭐",
      is_available: false,
    },
    {
      name: "ЗИМНИЙ СПОРТ",
      description: "Теплая спортивная одежда для холодного времени года",
      price: 11990,
      image_url: "https://images.unsplash.com/photo-1594736797933-d0b22ce8cd6c",
      contents: ["Утепленная куртка", "Термобелье", "Зимние аксессуары"],
      category: "ready",
      emoji: "❄️",
      is_available: false,
    },
    // Personal boxes
    {
      name: "СИЛОВЫЕ ТРЕНИРОВКИ",
      description: "Комплект для тренировок с железом",
      price: 9990,
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      contents: ["Компрессионная футболка", "Шорты для тренировок", "Перчатки для зала"],
      category: "personal",
      emoji: "🏋️‍♂️",
      is_available: true,
    },
    {
      name: "КАРДИО МИКС",
      description: "Легкая одежда для кардио тренировок",
      price: 8490,
      image_url: "https://images.unsplash.com/photo-1506629905877-c1e5027f5b6c",
      contents: ["Дышащая футболка", "Легкие шорты", "Спортивные кроссовки"],
      category: "personal",
      emoji: "🏃‍♀️",
      is_available: true,
    },
    {
      name: "АКТИВНЫЙ СТИЛЬ",
      description: "Стильный комплект для бега и активного образа жизни",
      price: 7490,
      image_url: "https://images.unsplash.com/photo-1506629905877-c1e5027f5b6c",
      contents: ["Беговая футболка", "Спортивные шорты", "Беговые кроссовки"],
      category: "personal",
      emoji: "🏃‍♂️",
      is_available: true,
    },
    {
      name: "ПРЕМИУМ ФИТНЕС",
      description: "Профессиональный набор из премиальных материалов",
      price: 12990,
      image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5a",
      contents: ["Компрессионный топ", "Премиум леггинсы", "Профессиональные кроссовки"],
      category: "personal",
      emoji: "⭐",
      is_available: true,
    },
  ];

  for (const box of boxes) {
    await client.query(
      `INSERT INTO boxes (name, description, price, image_url, contents, category, emoji, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [box.name, box.description, box.price, box.image_url, box.contents, box.category, box.emoji, box.is_available]
    );
  }

  console.log("Database seeded with initial boxes");
}