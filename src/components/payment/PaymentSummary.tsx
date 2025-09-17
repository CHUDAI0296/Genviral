'use client';

import { PaymentItem } from '@/types/payment';
import { formatCurrency } from '@/utils/currency';

interface PaymentSummaryProps {
  items: PaymentItem[];
  currency?: string;
  className?: string;
  showDetails?: boolean;
}

export default function PaymentSummary({
  items,
  currency = 'CNY',
  className = '',
  showDetails = true
}: PaymentSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const total = subtotal; // 可以在这里添加税费、折扣等计算

  return (
    <div className={`payment-summary bg-gray-50 rounded-lg p-4 ${className}`}>
      <h4 className="font-semibold text-gray-900 mb-3">订单摘要</h4>

      {showDetails && (
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex-1">
                <div className="text-gray-900">{item.name}</div>
                {item.description && (
                  <div className="text-gray-500 text-xs">{item.description}</div>
                )}
                {item.quantity && item.quantity > 1 && (
                  <div className="text-gray-500 text-xs">数量: {item.quantity}</div>
                )}
              </div>
              <div className="text-gray-900 font-medium ml-2">
                {formatCurrency(item.price * (item.quantity || 1), currency)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between text-base font-semibold text-gray-900">
          <span>总计</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          暂无订单项目
        </div>
      )}
    </div>
  );
}