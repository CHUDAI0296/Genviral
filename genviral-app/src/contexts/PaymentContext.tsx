'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { PaymentData, PaymentProvider, PaymentResult, PaymentStatus } from '@/types/payment';

interface PaymentState {
  status: PaymentStatus;
  selectedProvider: PaymentProvider | null;
  paymentData: PaymentData | null;
  result: PaymentResult | null;
  error: string | null;
  isLoading: boolean;
}

type PaymentAction =
  | { type: 'SELECT_PROVIDER'; provider: PaymentProvider }
  | { type: 'SET_PAYMENT_DATA'; data: PaymentData }
  | { type: 'SET_STATUS'; status: PaymentStatus }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_RESULT'; result: PaymentResult }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' };

const initialState: PaymentState = {
  status: 'idle',
  selectedProvider: null,
  paymentData: null,
  result: null,
  error: null,
  isLoading: false,
};

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case 'SELECT_PROVIDER':
      return {
        ...state,
        selectedProvider: action.provider,
        status: 'selecting',
        error: null,
      };
    case 'SET_PAYMENT_DATA':
      return {
        ...state,
        paymentData: action.data,
        error: null,
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.loading,
      };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        status: action.result.success ? 'success' : 'failed',
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        status: 'failed',
        isLoading: false,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface PaymentContextType extends PaymentState {
  selectProvider: (provider: PaymentProvider) => void;
  setPaymentData: (data: PaymentData) => void;
  processPayment: () => Promise<void>;
  cancelPayment: () => void;
  resetPayment: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const selectProvider = (provider: PaymentProvider) => {
    dispatch({ type: 'SELECT_PROVIDER', provider });
  };

  const setPaymentData = (data: PaymentData) => {
    dispatch({ type: 'SET_PAYMENT_DATA', data });
  };

  const processPayment = async () => {
    if (!state.selectedProvider || !state.paymentData) {
      dispatch({ type: 'SET_ERROR', error: '缺少支付提供商或支付数据' });
      return;
    }

    dispatch({ type: 'SET_STATUS', status: 'processing' });
    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      // 这里将来集成实际的支付API
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: state.selectedProvider,
          paymentData: state.paymentData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        dispatch({ type: 'SET_RESULT', result });
      } else {
        throw new Error(result.error || '支付处理失败');
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        error: error instanceof Error ? error.message : '支付处理出错',
      });
    }
  };

  const cancelPayment = () => {
    dispatch({ type: 'SET_STATUS', status: 'cancelled' });
    dispatch({ type: 'SET_LOADING', loading: false });
  };

  const resetPayment = () => {
    dispatch({ type: 'RESET' });
  };

  const value: PaymentContextType = {
    ...state,
    selectProvider,
    setPaymentData,
    processPayment,
    cancelPayment,
    resetPayment,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}