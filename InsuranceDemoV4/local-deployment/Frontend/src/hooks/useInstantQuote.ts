import { useState, useEffect } from 'react';
import { getAllProducts } from '../lib/api/productsApi';
import { createQuote } from '../lib/api/quotesApi';
import type { QuoteResponse, FrequencyType } from '../lib/api/quotesApi';
import { type Currency, formatCurrency as _formatCurrency } from '../lib/utils/currency';

/* ── Types ── */
export interface Product {
  product_id: string;
  name: string;
  description: string;
  coverage_type: string;
  coverage_amount: number;
}

export interface FormValues {
  age: string;
  sum_assured: string;
  term_years: string;
  frequency: FrequencyType;
}

export interface FormErrors {
  age?: string;
  sum_assured?: string;
  term_years?: string;
}

export type Step = 'select' | 'details' | 'result';

/* ── Constants ── */
export const FREQUENCY_OPTIONS: { value: FrequencyType; label: string }[] = [
  { value: 'ANNUAL',      label: 'Annual'      },
  { value: 'SEMI_ANNUAL', label: 'Semi-Annual' },
  { value: 'QUARTERLY',   label: 'Quarterly'   },
  { value: 'MONTHLY',     label: 'Monthly'     },
];

export const FREQUENCY_LABEL: Record<FrequencyType, string> = {
  ANNUAL:      'per year',
  SEMI_ANNUAL: 'per 6 months',
  QUARTERLY:   'per quarter',
  MONTHLY:     'per month',
};

/* ── Helpers ── */
export const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

/* ── Hook ── */
export function useInstantQuote(currency: Currency) {
  const [step, setStep]         = useState<Step>('select');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError]       = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm]         = useState<FormValues>({
    age: '', sum_assured: '', term_years: '', frequency: 'ANNUAL',
  });
  const [errors, setErrors]     = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [quote, setQuote]       = useState<QuoteResponse | null>(null);
  const [copied, setCopied]     = useState(false);

  /* Load products on mount */
  useEffect(() => {
    setLoadingProducts(true);
    getAllProducts()
      .then(res => {
        const raw = res.data?.Products?.Product;
        setProducts(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setProductError('Failed to load products. Please try again.'))
      .finally(() => setLoadingProducts(false));
  }, []);

  /* ── Validation ── */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const age  = Number(form.age);
    const sum  = Number(form.sum_assured);
    const term = Number(form.term_years);

    if (!form.age || isNaN(age) || age < 18 || age > 60)
      newErrors.age = 'Age must be between 18 and 60.';
    if (!form.sum_assured || isNaN(sum) || sum < 1_000_000)
      newErrors.sum_assured = 'Sum assured must be at least LKR 1,000,000.';
    if (!form.term_years || isNaN(term) || term < 5 || term > 30)
      newErrors.term_years = 'Term must be between 5 and 30 years.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Handlers ── */
  const handleSelectProduct = (product: Product) => {
    setSelected(product);
    setStep('details');
    setApiError(null);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const response = await createQuote({
        product_id:    selected.product_id,
        coverage_type: selected.coverage_type,
        age:           Number(form.age),
        sum_assured:   Number(form.sum_assured),
        term_years:    Number(form.term_years),
        frequency:     form.frequency,
      });
      setQuote(response.data);
      setStep('result');
    } catch (err: any) {
      setApiError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyQuoteId = () => {
    if (quote?.quote_id) {
      navigator.clipboard.writeText(quote.quote_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewQuote = () => {
    setStep('select');
    setSelected(null);
    setForm({ age: '', sum_assured: '', term_years: '', frequency: 'ANNUAL' });
    setErrors({});
    setQuote(null);
    setApiError(null);
  };

  const formatCurrency = (amount: number) => _formatCurrency(amount, currency);

  return {
    /* navigation */
    step, setStep,
    /* products */
    products, loadingProducts, productError, selected,
    handleSelectProduct,
    /* form */
    form, errors, submitting, apiError,
    handleFieldChange, handleGenerateQuote,
    /* result */
    quote, copied,
    handleCopyQuoteId, handleNewQuote,
    /* currency */
    formatCurrency,
  };
}
