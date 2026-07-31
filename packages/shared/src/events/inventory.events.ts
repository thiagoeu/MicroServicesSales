// Event names (routing keys)
export const INVENTORY_RESERVED = "inventory.reserved";
export const INVENTORY_FAILED = "inventory.failed";

// Event payloads
export interface InventoryReservedEvent {
  orderId: string;
  productId: string;
  quantity: number;
}

export interface InventoryFailedEvent {
  orderId: string;
  productId: string;
  quantity: number;
  reason: string;
}
