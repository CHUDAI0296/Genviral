'use client';

import { useEffect, useState } from 'react';
import { PaymentResult } from '@/types/payment';
import { formatCurrency } from '@/utils/currency';
import PaymentStatusBadge from './PaymentStatusBadge';

interface PaymentResultPageProps {
  result: PaymentResult;
  onRetry?: () => void;
  onBackToHome?: () => void;
  className?: string;
}

export default function PaymentResultPage({
  result,
  onRetry,
  onBackToHome,
  className = ''
}: PaymentResultPageProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (result.success && onBackToHome) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onBackToHome();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [result.success, onBackToHome]);

  return (
    <div className={`payment-result-page ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 状态图标 */}
        <div className="mb-6">
          {result.success ? (
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          <PaymentStatusBadge status={result.success ? 'success' : 'failed'} />
        </div>

        {/* 标题和消息 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {result.success ? '支付成功！' : '支付失败'}
        </h1>

        <p className="text-gray-600 mb-8">
          {result.success
            ? '感谢您的支付，订单已处理完成。'
            : result.error || '支付过程中出现了问题，请重试。'
          }
        </p>

        {/* 支付详情 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">支付详情</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">订单号：</span>
              <span className="font-mono text-gray-900">{result.orderId}</span>
            </div>

            {result.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">交易号：</span>
                <span className="font-mono text-gray-900">{result.transactionId}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">支付方式：</span>
              <span className="text-gray-900 capitalize">{result.provider}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">支付金额：</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(result.amount, result.currency)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">支付时间：</span>
              <span className="text-gray-900">
                {result.timestamp.toLocaleString('zh-CN')}
              </span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {result.success ? (
            <>
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  返回首页 ({countdown}s)
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                打印收据
              </button>
            </>
          ) : (
            <>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  重试支付
                </button>
              )}

              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  返回首页
                </button>
              )}
            </>
          )}
        </div>

        {/* 帮助链接 */}
        <div className="mt-8 text-sm text-gray-500">
          {result.success ? (
            <p>
              如果您有任何问题，请联系
              <a href="mailto:support@example.com" className="text-blue-500 hover:underline ml-1">
                客服支持
              </a>
            </p>
          ) : (
            <p>
              支付遇到问题？查看
              <a href="/help/payment" className="text-blue-500 hover:underline ml-1">
                支付帮助
              </a>
              {' '}或联系
              <a href="mailto:support@example.com" className="text-blue-500 hover:underline ml-1">
                客服支持
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}