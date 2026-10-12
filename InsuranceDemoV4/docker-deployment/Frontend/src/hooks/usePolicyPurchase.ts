import { useState, useEffect } from 'react';
import { getQuoteById } from '../lib/api/quotesApi';
import type { QuoteResponse } from '../lib/api/quotesApi';
import { purchasePolicy } from '../lib/api/policyLifecycleApi';
import type { PolicyPurchaseResponse } from '../lib/api/policyLifecycleApi';
import { type Currency, formatCurrency as _formatCurrency } from '../lib/utils/currency';
import { usePaymentDetailsForm } from './usePaymentDetailsForm';

/* ── Re-export shared types so consumers don't need two imports ── */
export type { PersonalForm, CardForm, FormErrors } from './usePaymentDetailsForm';

/* ── Types ── */
export type Step = 'quote' | 'details' | 'success';

/* ── Helpers ── */
export const formatFrequency = (f: string) =>
  f.replace('_', '-').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

const isQuoteValid = (validUntil: string): boolean =>
  new Date(validUntil).getTime() > Date.now();

/* ── Hook ── */
export function usePolicyPurchase(currency: Currency, initialQuoteId?: string) {
  const [step, setStep] = useState<Step>('quote');

  /* Quote Lookup */
  const [quoteId, setQuoteId] = useState(initialQuoteId ?? '');
  const [quoteIdError, setQuoteIdError] = useState('');
  const [quoteLookupLoading, setQuoteLookupLoading] = useState(false);
  const [quoteLookupError, setQuoteLookupError] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteExpired, setQuoteExpired] = useState(false);

  /* Personal Details + Card (shared hook) */
  const detailsForm = usePaymentDetailsForm();

  /* Submission */
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* Policy Purchase Result */
  const [result, setResult] = useState<PolicyPurchaseResponse | null>(null);
  const [copied, setCopied] = useState(false);

  /* Auto-lookup when a quoteId is pre-filled from the quote flow */
  useEffect(() => {
    if (!initialQuoteId) return;
    setQuoteLookupLoading(true);
    getQuoteById(initialQuoteId)
      .then(res => {
        const q = res.data;
        setQuote(q);
        setQuoteExpired(!isQuoteValid(q.valid_until));
      })
      .catch(() => setQuoteLookupError('Failed to retrieve quote. Please try again.'))
      .finally(() => setQuoteLookupLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Handlers ── */
  const handleQuoteIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setQuoteId(val);
    setQuoteIdError('');
    setQuoteLookupError('');
    setQuote(null);
    setQuoteExpired(false);
  };

  const handleLookupQuote = async () => {
    const trimmed = quoteId.trim();
    if (!trimmed) { setQuoteIdError('Please enter a Quote ID.'); return; }
    if (!/^QT_\w+$/.test(trimmed)) {
      setQuoteIdError('Quote ID must start with "QT_" (e.g. QT_001).');
      return;
    }
    try {
      setQuoteLookupLoading(true);
      setQuoteLookupError('');
      const res = await getQuoteById(trimmed);
      const q = res.data;
      setQuote(q);
      setQuoteExpired(!isQuoteValid(q.valid_until));
    } catch (err: any) {
      setQuoteLookupError(
        err?.response?.status === 404
          ? 'Quote not found. Please check the ID and try again.'
          : 'Failed to retrieve quote. Please try again.',
      );
    } finally {
      setQuoteLookupLoading(false);
    }
  };

  /* ── Purchase Handler ── */
  const handlePurchase = async () => {
    if (!quote || !detailsForm.validatePersonalAndCard()) return;
    if (quoteExpired) {
      setSubmitError('This quote has expired and can no longer be used to purchase a policy.');
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError('');
      const res = await purchasePolicy({
        quote_id: quote.quote_id,
        personal_details: {
          first_name:    detailsForm.personal.first_name.trim(),
          last_name:     detailsForm.personal.last_name.trim(),
          nic_number:    detailsForm.personal.nic_number.trim(),
          email:         detailsForm.personal.email.trim(),
          mobile_number: detailsForm.personal.mobile_number.trim(),
          address:       detailsForm.personal.address.trim(),
        },
        payment_method: 'Card',
      });
      setResult(res.data);
      setStep('success');
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPolicyId = () => {
    if (result?.policy_id) {
      navigator.clipboard.writeText(result.policy_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (amount: number) => _formatCurrency(amount, currency);

  return {
    /* navigation */
    step, setStep,
    /* Quote Lookup */
    quoteId, quoteIdError, quoteLookupLoading, quoteLookupError,
    quote, quoteExpired,
    handleQuoteIdChange, handleLookupQuote,
    /* Personal Details + Card (spread from shared hook) */
    ...detailsForm,
    submitting, submitError,
    handlePurchase,
    /* Policy Purchase Result */
    result, copied, handleCopyPolicyId,
    /* currency */
    formatCurrency,
  };
}
