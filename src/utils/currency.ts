export function formatCurrency(amount: number, currency: string = 'CNY'): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    CNY: new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }),
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }),
    EUR: new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }),
  };

  const formatter = formatters[currency.toUpperCase()];
  if (formatter) {
    return formatter.format(amount);
  }

  // 默认格式
  return `${currency} ${amount.toFixed(2)}`;
}

export function parseCurrency(value: string): number {
  const cleanValue = value.replace(/[^\d.-]/g, '');
  return parseFloat(cleanValue) || 0;
}