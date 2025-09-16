'use client';

import { PaymentProvider } from '@/contexts/PaymentContext';
import {
  PaymentFlow,
  PaymentResultPage
} from '@/components';
import { PaymentData, PaymentMethod } from '@/types/payment';
import { useState } from 'react';

// 示例支付方式配置
const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '/icons/stripe.svg',
    description: '信用卡支付',
    enabled: true,
  },
  {
    id: 'alipay',
    name: '支付宝',
    icon: '/icons/alipay.svg',
    description: '支付宝快捷支付',
    enabled: true,
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: '/icons/wechat.svg',
    description: '微信扫码支付',
    enabled: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '/icons/paypal.svg',
    description: 'PayPal支付',
    enabled: false,
  },
];

// 示例支付数据
const samplePaymentData: PaymentData = {
  orderId: `ORDER_${Date.now()}`,
  amount: 99.99,
  currency: 'CNY',
  items: [
    {
      id: '1',
      name: 'Premium 会员',
      description: '1个月高级会员权限',
      price: 99.99,
      quantity: 1,
    },
  ],
  customerInfo: {
    email: 'user@example.com',
    name: '张三',
  },
};

export default function PaymentPage() {
  const [showResult, setShowResult] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handlePaymentSuccess = (result: any) => {
    setPaymentResult(result);
    setShowResult(true);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const handleRetry = () => {
    setShowResult(false);
    setPaymentResult(null);
  };

  const handleBackToHome = () => {
    // 这里可以导航到首页
    window.location.href = '/';
  };

  return (
    <PaymentProvider>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            支付中心
          </h1>

          {!showResult ? (
            <PaymentFlow
              paymentData={samplePaymentData}
              availableMethods={paymentMethods}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={() => console.log('Payment cancelled')}
            />
          ) : (
            <PaymentResultPage
              result={paymentResult}
              onRetry={handleRetry}
              onBackToHome={handleBackToHome}
            />
          )}
        </div>
      </div>
    </PaymentProvider>
  );
}