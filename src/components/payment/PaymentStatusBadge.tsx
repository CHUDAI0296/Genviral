'use client';

import { PaymentStatus } from '@/types/payment';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export default function PaymentStatusBadge({ status, className = '' }: PaymentStatusBadgeProps) {
  const statusConfig = {
    idle: {
      label: '待支付',
      color: 'bg-gray-100 text-gray-800',
      icon: '⏳'
    },
    selecting: {
      label: '选择中',
      color: 'bg-blue-100 text-blue-800',
      icon: '🔄'
    },
    processing: {
      label: '处理中',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⚡'
    },
    success: {
      label: '支付成功',
      color: 'bg-green-100 text-green-800',
      icon: '✅'
    },
    failed: {
      label: '支付失败',
      color: 'bg-red-100 text-red-800',
      icon: '❌'
    },
    cancelled: {
      label: '已取消',
      color: 'bg-gray-100 text-gray-800',
      icon: '🚫'
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${config.color} ${className}
      `}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}