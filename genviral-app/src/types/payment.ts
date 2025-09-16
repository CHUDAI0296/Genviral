export type PaymentProvider = 'stripe' | 'alipay' | 'wechat' | 'paypal';

export type PaymentStatus =
  | 'idle'
  | 'selecting'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled';

export interface PaymentMethod {
  id: PaymentProvider;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface PaymentItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
}

export interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  items: PaymentItem[];
  customerInfo?: {
    email?: string;
    name?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  transactionId?: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  timestamp: Date;
  error?: string;
}

export interface PaymentConfig {
  providers: PaymentMethod[];
  defaultCurrency: string;
  returnUrl?: string;
  cancelUrl?: string;
  webhookUrl?: string;
}