import { NextRequest, NextResponse } from 'next/server';
import { PaymentProvider, PaymentData, PaymentResult } from '@/types/payment';

export async function POST(request: NextRequest) {
  try {
    const { provider, paymentData }: { provider: PaymentProvider; paymentData: PaymentData } =
      await request.json();

    // 模拟支付处理逻辑
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟随机成功/失败 (80%成功率)
    const success = Math.random() > 0.2;

    const result: PaymentResult = {
      success,
      orderId: paymentData.orderId,
      transactionId: success ? `tx_${Date.now()}_${provider}` : undefined,
      provider,
      amount: paymentData.amount,
      currency: paymentData.currency,
      timestamp: new Date(),
      error: success ? undefined : '支付处理失败，请重试',
    };

    return NextResponse.json(result);

  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '服务器错误'
      },
      { status: 500 }
    );
  }
}