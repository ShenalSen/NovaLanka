import { useState } from 'react';
import { getPolicyById, patchPolicy } from '../lib/api/policiesApi';
import { makePayment } from '../lib/api/paymentsApi';
import { type Currency, formatCurrency as _formatCurrency } from '../lib/utils/currency';
import { usePaymentDetailsForm } from './usePaymentDetailsForm';

/* ── Re-export shared types so consumers don't need two imports ── */
export type { PersonalForm, CardForm, FormErrors } from './usePaymentDetailsForm';

/* ── Types ── */
export type Step = 'lookup' | 'details' | 'success';

export type PolicyStatus = 'Active' | 'Inactive' | 'Expired' | 'Cancelled';

export interface PolicyData {
  policy_id: string;
  product_id: string;
  status: PolicyStatus;
  premium_amount: number;
  policy_details: string;
  start_date: string | null;
  end_date: string | null;
  next_due_date: string | null;
}

export interface PaymentResult {
  payment_id: string;
  paid_amount: number;
  next_due_date: string;
  policy_id: string;
}

/* ── Helpers ── */
const toDateStr = (d: Date) => d.toISOString().split('T')[0];

export const inferNextDueDate = (policyDetails: string): string => {
  const text = policyDetails.toLowerCase();
  const d = new Date();
  if      (text.includes('semi-annual basis')) d.setDate(d.getDate() + 180);
  else if (text.includes('annual basis'))      d.setDate(d.getDate() + 365);
  else if (text.includes('quarterly basis'))   d.setDate(d.getDate() + 90);
  else if (text.includes('monthly basis'))     d.setDate(d.getDate() + 30);
  else                                         d.setDate(d.getDate() + 365);
  return toDateStr(d);
};

/* ── Hook ── */
export function usePolicyPayment(currency: Currency) {
  const [step, setStep] = useState<Step>('lookup');

  /* Policy Lookup */
  const [policyId, setPolicyId]         = useState('');
  const [policyIdError, setPolicyIdError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError]   = useState('');
  const [policy, setPolicy]             = useState<PolicyData | null>(null);

  /* Personal Details + Card (shared hook) */
  const detailsForm = usePaymentDetailsForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* Payment Result */
  const [result, setResult] = useState<PaymentResult | null>(null);

  /* ── Lookup handler ── */
  const handlePolicyIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyId(e.target.value.toUpperCase());
    setPolicyIdError('');
    setLookupError('');
    setPolicy(null);
  };

  const handleLookupPolicy = async () => {
    const trimmed = policyId.trim();
    if (!trimmed) { setPolicyIdError('Please enter a Policy ID.'); return; }
    if (!/^POL_\w+$/.test(trimmed)) {
      setPolicyIdError('Policy ID must start with "POL_" (e.g. POL_001).');
      return;
    }

    try {
      setLookupLoading(true);
      setLookupError('');
      const res = await getPolicyById(trimmed);
      const p = res.data?.Policy;
      if (!p || !p.policy_id) {
        setLookupError('Policy not found. Please check the ID and try again.');
        return;
      }
      setPolicy({
        policy_id:      p.policy_id,
        product_id:     p.product_id,
        status:         p.status,
        premium_amount: p.premium_amount,
        policy_details: p.policy_details,
        start_date:     p.start_date,
        end_date:       p.end_date,
        next_due_date:  p.next_due_date,
      });
    } catch (err: any) {
      setLookupError(
        err?.response?.status === 404
          ? 'Policy not found. Please check the ID and try again.'
          : 'Failed to retrieve policy. Please try again.',
      );
    } finally {
      setLookupLoading(false);
    }
  };

  /* ── Payment + patch handler ── */
  const handlePayment = async () => {
    if (!policy || !detailsForm.validatePersonalAndCard()) return;
    try {
      setSubmitting(true);
      setSubmitError('');
      const today = toDateStr(new Date());

      /* POST payment */
      const payRes = await makePayment({
        policy_id:      policy.policy_id,
        first_name:     detailsForm.personal.first_name.trim(),
        last_name:      detailsForm.personal.last_name.trim(),
        nic_number:     detailsForm.personal.nic_number.trim(),
        email:          detailsForm.personal.email.trim(),
        mobile_number:  detailsForm.personal.mobile_number.trim(),
        address:        detailsForm.personal.address.trim(),
        amount:         policy.premium_amount,
        tran_date:      today,
        payment_method: 'Card',
        status:         'Success',
      });

      const paymentId  = payRes.data.payment_id;
      const nextDue    = inferNextDueDate(policy.policy_details);

      /* PATCH policy with next due date */
      await patchPolicy(policy.policy_id, nextDue);

      setResult({
        payment_id:    paymentId,
        paid_amount:   policy.premium_amount,
        next_due_date: nextDue,
        policy_id:     policy.policy_id,
      });
      setStep('success');
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        'Payment failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => _formatCurrency(amount, currency);

  return {
    step, setStep,
    /* lookup */
    policyId, policyIdError, lookupLoading, lookupError, policy,
    handlePolicyIdChange, handleLookupPolicy,
    /* Personal Details + Card (spread from shared hook) */
    ...detailsForm,
    submitting, submitError,
    handlePayment,
    /* success */
    result,
    /* currency */
    formatCurrency,
  };
}
