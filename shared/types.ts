// User types
export interface User {
  id: string;
  created_at: Date;
  telegram_id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface CreateUserDto {
  telegramId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

// Quiz Response types
export interface QuizResponse {
  id: string;
  created_at: Date;
  user_id?: string;
  size?: string;
  height?: string;
  weight?: string;
  goals?: string[];
  budget?: string;
}

export interface CreateQuizResponseDto {
  userId?: string;
  size?: string;
  height?: string;
  weight?: string;
  goals?: string[];
  budget?: string;
}

// Box types
export interface Box {
  id: string;
  created_at: Date;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  contents?: string[];
  category?: string;
  emoji?: string;
  is_available: boolean;
}

export interface CreateBoxDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  contents?: string[];
  category?: string;
  emoji?: string;
  isAvailable?: boolean;
}

// Order types
export interface Order {
  id: string;
  order_number: string;
  created_at: Date;
  user_id?: string;
  box_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_method: string;
  payment_method: string;
  total_price: number;
  status: string;
}

export interface CreateOrderDto {
  userId?: string;
  boxId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: string;
  paymentMethod: string;
  totalPrice: number;
}

// Notification types
export interface Notification {
  id: string;
  created_at: Date;
  user_id: string;
  box_id: string;
}

export interface CreateNotificationDto {
  userId: string;
  boxId: string;
}