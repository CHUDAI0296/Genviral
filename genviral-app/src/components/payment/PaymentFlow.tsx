'use client';

import { useState, useEffect } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { PaymentMethod, PaymentData } from '@/types/payment';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentSummary from './PaymentSummary';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PaymentFlowProps {
  paymentData: PaymentData;
  availableMethods: PaymentMethod[];
  onSuccess?: (result: PaymentData) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
}

export default function PaymentFlow({
  paymentData,
  availableMethods,
  onSuccess,
  onError,
  onCancel,
  className = ''
}: PaymentFlowProps) {
  const {
    status,
    selectedProvider,
    result,
    error,
    isLoading,
    setPaymentData,
    processPayment,
    cancelPayment,
    resetPayment,
  } = usePayment();

  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'complete'>('select');

  useEffect(() => {
    setPaymentData(paymentData);
  }, [paymentData, setPaymentData]);

  useEffect(() => {
    switch (status) {
      case 'selecting':
        setStep('confirm');
        break;
      case 'processing':
        setStep('processing');
        break;
      case 'success':
      case 'failed':
        setStep('complete');
        break;
      case 'cancelled':
        setStep('select');
        break;
    }
  }, [status]);

  useEffect(() => {
    if (result && result.success) {
      onSuccess?.(result);
    } else if (error) {
      onError?.(error);
    }
  }, [result, error, onSuccess, onError]);

  const handleConfirmPayment = async () => {
    if (!selectedProvider) return;
    await processPayment();
  };

  const handleCancel = () => {
    cancelPayment();
    onCancel?.();
  };

  const handleRetry = () => {
    resetPayment();
    setStep('select');
  };

  return (
    <div className={`payment-flow ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {['选择支付', '确认支付', '支付处理', '支付完成'].map((stepName, index) => {
              const stepIndex = ['select', 'confirm', 'processing', 'complete'].indexOf(step);
              const isActive = index <= stepIndex;
              const isCurrent = index === stepIndex;

              return (
                <div key={stepName} className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }
                      ${isCurrent ? 'ring-2 ring-blue-300' : ''}
                    `}
                  >
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {stepName}
                  </span>
                  {index < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-4 ${
                        index < stepIndex ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 步骤内容 */}
        {step === 'select' && (
          <div className="space-y-6">
            <PaymentSummary
              items={paymentData.items}
              currency={paymentData.currency}
            />
            <PaymentMethodSelector
              methods={availableMethods}
              onSelect={() => {}} // 状态管理在context中处理
            />
            {selectedProvider && (
              <div className="flex justify-end">
                <button
                  onClick={() => setStep('confirm')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  继续
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <PaymentSummary
              items={paymentData.items}
              currency={paymentData.currency}
            />

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">支付方式</h4>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
                <span className="text-blue-800">
                  {availableMethods.find(m => m.id === selectedProvider)?.name}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('select')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                返回
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={isLoading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isLoading && <LoadingSpinner size="sm" />}
                <span>确认支付</span>
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">处理支付中...</h3>
            <p className="text-gray-500">请稍候，不要关闭页面</p>
            <button
              onClick={handleCancel}
              className="mt-4 px-4 py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              取消支付
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-12">
            {result?.success ? (
              <div>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">支付成功！</h3>
                <p className="text-gray-500 mb-4">
                  订单号: {result.orderId}
                </p>
                <p className="text-gray-500">
                  交易号: {result.transactionId}
                </p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">支付失败</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  重试支付
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}