// Event names (routing keys)
export const PAYMENT_APPROVED = "payment.approved";
export const PAYMENT_FAILED = "payment.failed";

// Event payloads
export interface PaymentApprovedEvent {
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentFailedEvent {
  orderId: string;
  userId: string;
  amount: number;
  reason: string;
}
