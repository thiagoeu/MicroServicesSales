// Order status enum
export enum OrderStatus {
  PENDING = "PENDING",
  RESERVED = "RESERVED",
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

// User role enum
export enum UserRole {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER",
}

// RabbitMQ exchange configuration
export const COMMERCE_EXCHANGE = "commerce.exchange";
export const EXCHANGE_TYPE = "topic";

// DTOs
export interface CreateOrderDto {
  productId: string;
  quantity: number;
  paymentMethod: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
