'use client';

import { useState } from 'react';
import { PaymentProvider, PaymentMethod } from '@/types/payment';
import { usePayment } from '@/contexts/PaymentContext';
import Image from 'next/image';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  onSelect?: (provider: PaymentProvider) => void;
  className?: string;
}

export default function PaymentMethodSelector({
  methods,
  onSelect,
  className = ''
}: PaymentMethodSelectorProps) {
  const { selectedProvider, selectProvider } = usePayment();
  const [hoveredProvider, setHoveredProvider] = useState<PaymentProvider | null>(null);

  const handleSelect = (provider: PaymentProvider) => {
    selectProvider(provider);
    onSelect?.(provider);
  };

  return (
    <div className={`payment-method-selector ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        选择支付方式
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => method.enabled && handleSelect(method.id)}
            onMouseEnter={() => setHoveredProvider(method.id)}
            onMouseLeave={() => setHoveredProvider(null)}
            disabled={!method.enabled}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200
              ${!method.enabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                : selectedProvider === method.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
              }
            `}
          >
            {selectedProvider === method.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 flex items-center justify-center">
                {method.icon ? (
                  <Image src={method.icon} alt={method.name} width={32} height={32} className="object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      {method.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="font-medium text-sm text-gray-900">
                  {method.name}
                </div>
                {method.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {method.description}
                  </div>
                )}
              </div>
            </div>

            {hoveredProvider === method.id && method.enabled && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-5 rounded-lg pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {methods.filter(method => !method.enabled).length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          * 灰色选项暂不可用
        </div>
      )}
    </div>
  );
}