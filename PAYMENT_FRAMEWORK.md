# 支付框架文档

## 概述

这是一个完整的支付框架，支持多种支付方式的集成。框架采用模块化设计，可以轻松扩展和自定义。

## 文件结构

```
src/
├── types/
│   └── payment.ts              # 支付相关类型定义
├── contexts/
│   └── PaymentContext.tsx      # 支付状态管理Context
├── components/
│   ├── payment/
│   │   ├── PaymentFlow.tsx           # 主支付流程组件
│   │   ├── PaymentMethodSelector.tsx # 支付方式选择组件
│   │   ├── PaymentSummary.tsx        # 订单摘要组件
│   │   ├── PaymentStatusBadge.tsx    # 支付状态徽章
│   │   └── PaymentResultPage.tsx     # 支付结果页面
│   └── ui/
│       └── LoadingSpinner.tsx        # 加载动画组件
├── lib/
│   └── PaymentStatusManager.ts       # 支付状态管理器
├── utils/
│   └── currency.ts                   # 货币格式化工具
└── app/
    ├── payment/
    │   └── page.tsx                  # 支付页面示例
    └── api/
        └── payment/
            └── process/
                └── route.ts          # 支付处理API
```

## 主要功能

### 1. 支付类型定义 (`types/payment.ts`)
- PaymentProvider: 支付提供商类型
- PaymentStatus: 支付状态类型
- PaymentMethod: 支付方式接口
- PaymentData: 支付数据接口
- PaymentResult: 支付结果接口

### 2. 状态管理 (`contexts/PaymentContext.tsx`)
- 使用React Context管理支付状态
- 支持支付方式选择、数据设置、支付处理等操作
- 统一的错误处理和状态更新

### 3. 核心组件

#### PaymentFlow (支付流程组件)
- 完整的支付流程管理
- 步骤指示器显示当前进度
- 支持取消、重试等操作

#### PaymentMethodSelector (支付方式选择)
- 网格布局显示可用支付方式
- 支持启用/禁用状态
- 选中状态视觉反馈

#### PaymentSummary (订单摘要)
- 显示订单项目和总金额
- 支持多货币格式化
- 可选择显示详细信息

#### PaymentResultPage (支付结果页面)
- 成功/失败状态展示
- 支付详情显示
- 自动倒计时返回
- 打印收据功能

### 4. 工具函数
- `formatCurrency`: 货币格式化
- `PaymentStatusManager`: 支付状态管理器

## 使用方法

### 1. 基本使用

```tsx
import { PaymentProvider } from '@/contexts/PaymentContext';
import { PaymentFlow } from '@/components';

function App() {
  return (
    <PaymentProvider>
      <PaymentFlow
        paymentData={paymentData}
        availableMethods={methods}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </PaymentProvider>
  );
}
```

### 2. 配置支付方式

```tsx
const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '/icons/stripe.svg',
    description: '信用卡支付',
    enabled: true,
  },
  // 更多支付方式...
];
```

### 3. 设置支付数据

```tsx
const paymentData: PaymentData = {
  orderId: 'ORDER_123',
  amount: 99.99,
  currency: 'CNY',
  items: [
    {
      id: '1',
      name: '商品名称',
      price: 99.99,
      quantity: 1,
    }
  ],
};
```

## API接口

### POST /api/payment/process
支付处理接口

**请求参数:**
```json
{
  "provider": "stripe",
  "paymentData": {
    "orderId": "ORDER_123",
    "amount": 99.99,
    "currency": "CNY",
    // ...
  }
}
```

**响应:**
```json
{
  "success": true,
  "orderId": "ORDER_123",
  "transactionId": "tx_1234567890",
  "provider": "stripe",
  "amount": 99.99,
  "currency": "CNY",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

## 扩展支持

### 添加新的支付方式

1. 在 `PaymentProvider` 类型中添加新的提供商
2. 在支付方式配置中添加新选项
3. 在支付处理API中添加相应逻辑

### 自定义样式

所有组件都支持 `className` 属性，可以轻松自定义样式。

### 状态监听

```tsx
import { usePayment } from '@/contexts/PaymentContext';

function PaymentStatus() {
  const { status, selectedProvider, isLoading } = usePayment();

  return (
    <div>
      当前状态: {status}
      选中方式: {selectedProvider}
      加载中: {isLoading ? '是' : '否'}
    </div>
  );
}
```

## 注意事项

1. 当前为框架版本，未集成实际支付API
2. 支付处理采用模拟逻辑，实际使用时需要替换为真实API调用
3. 建议在生产环境中添加更完善的错误处理和安全验证
4. 可根据实际需求扩展更多支付方式和功能