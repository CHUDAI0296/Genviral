import { PaymentProvider, PaymentResult, PaymentStatus } from '@/types/payment';

export class PaymentStatusManager {
  private listeners: Array<(status: PaymentStatus, result?: PaymentResult) => void> = [];
  private currentStatus: PaymentStatus = 'idle';

  subscribe(callback: (status: PaymentStatus, result?: PaymentResult) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  setStatus(status: PaymentStatus, result?: PaymentResult) {
    this.currentStatus = status;
    this.listeners.forEach(listener => listener(status, result));
  }

  getCurrentStatus(): PaymentStatus {
    return this.currentStatus;
  }

  // 模拟支付状态变化
  async simulatePaymentFlow(provider: PaymentProvider, orderId: string): Promise<PaymentResult> {
    this.setStatus('processing');

    // 模拟支付处理时间
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟随机成功/失败
    const success = Math.random() > 0.2; // 80% 成功率

    const result: PaymentResult = {
      success,
      orderId,
      transactionId: success ? `tx_${Date.now()}` : undefined,
      provider,
      amount: 0, // 将在实际使用时填充
      currency: 'CNY',
      timestamp: new Date(),
      error: success ? undefined : '模拟支付失败'
    };

    this.setStatus(success ? 'success' : 'failed', result);
    return result;
  }
}

// 单例实例
export const paymentStatusManager = new PaymentStatusManager();