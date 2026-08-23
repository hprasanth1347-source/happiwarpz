import { Product } from "./product";
import { User } from "./user";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  productName: string;
  quantity: number;
  price: number;
  variant?: string;
  customMessage?: string;
  specialInstructions?: string;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  note?: string;
  updatedBy: string;
  createdAt: string;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: "CUSTOMER" | "ADMIN";
  sender?: Partial<User>;
  message: string;
  attachments?: string[];
  isRead?: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: string;
  trackingCarrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  items: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  messages?: OrderMessage[];
}
