// Event names (routing keys)
export const ORDER_CREATED = "order.created";
export const ORDER_READY_FOR_PAYMENT = "order.ready_for_payment";
export const ORDER_CANCELED = "order.canceled";

// Event payloads
export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  total: number;
}

export interface OrderReadyForPaymentEvent {
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  total: number;
}

export interface OrderCanceledEvent {
  orderId: string;
  userId: string;
  reason?: string;
}
