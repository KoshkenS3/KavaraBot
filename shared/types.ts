// User types
export interface User {
  id: string;
  createdAt: Date;
  telegramId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
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
  createdAt: Date;
  userId?: string;
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

// Sport types enum
export enum SportType {
  running = "running",
  power = "power",  
  yoga = "yoga",
  cycling = "cycling",
  command_sports = "command_sports",
}

// Box types
export interface Box {
  id: string;
  createdAt: Date;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  contents?: string[];
  category?: string;
  sportTypes?: SportType[];
  emoji?: string;
  isAvailable: boolean;
}

export interface CreateBoxDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  contents?: string[];
  category?: string;
  sportTypes?: SportType[];
  emoji?: string;
  isAvailable?: boolean;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  userId?: string;
  boxId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: string;
  paymentMethod: string;
  totalPrice: number;
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
  createdAt: Date;
  userId: string;
  boxId: string;
}

export interface CreateNotificationDto {
  userId: string;
  boxId: string;
}