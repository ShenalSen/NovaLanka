export type Currency = 'USD' | 'LKR' | 'EUR' | 'GBP' | 'AUD';

export const DEFAULT_CURRENCY: Currency = 'USD';

// Format a number as a currency string
export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'USD', label: '$ USD' },
  { value: 'LKR', label: 'Rs LKR' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'AUD', label: 'A$ AUD' },
];

export const formatCurrency = (amount: number, currency: Currency): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
