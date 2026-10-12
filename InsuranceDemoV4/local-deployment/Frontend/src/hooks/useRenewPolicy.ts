import { useState, useEffect } from 'react';
import { getPolicyById } from '../lib/api/policiesApi';
import { renewPolicy } from '../lib/api/policyLifecycleApi';
import type { RenewPolicyResponse } from '../lib/api/policyLifecycleApi';
import { type Currency, formatCurrency as _formatCurrency } from '../lib/utils/currency';
import { usePaymentDetailsForm } from './usePaymentDetailsForm';

/* ── Re-export shared types so consumers don't need two imports ── */
export type { PersonalForm, CardForm, FormErrors } from './usePaymentDetailsForm';

/* ── Types ── */
export type RenewStep = 'review' | 'details' | 'success';

export interface PolicySummary {
  policy_id: string;
  product_id: string;
  customer_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  premium_amount: number;
  policy_details: string;
}

/* ── Hook ── */
export function useRenewPolicy(initialPolicyId: string, currency: Currency) {
  const [step, setStep]           = useState<RenewStep>('review');

  /* Policy auto-lookup */
  const [policy, setPolicy]         = useState<PolicySummary | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError]     = useState('');

  /* Term years */
  const [termYears, setTermYears] = useState(1);

  /* Personal Details + Card (shared hook) */
  const detailsForm = usePaymentDetailsForm();

  /* Submission */
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* Result */
  const [result, setResult] = useState<RenewPolicyResponse | null>(null);

  /* Auto-lookup the policy from the URL policy_id on mount */
  useEffect(() => {
    if (!initialPolicyId) return;
    const fetchPolicy = async () => {
      try {
        setLookupLoading(true);
        setLookupError('');
        const res = await getPolicyById(initialPolicyId);
        const p = res.data?.Policy;
        if (!p || !p.policy_id) {
          setLookupError('Policy not found. Please check the link and try again.');
          return;
        }
        setPolicy({
          policy_id:      p.policy_id,
          product_id:     p.product_id,
          customer_id:    p.customer_id,
          status:         p.status,
          start_date:     p.start_date,
          end_date:       p.end_date,
          premium_amount: Number(p.premium_amount) || 0,
          policy_details: p.policy_details,
        });
      } catch (err: any) {
        setLookupError(
          err?.response?.status === 404
            ? 'Policy not found. The renewal link may be invalid.'
            : 'Failed to load policy details. Please try again later.',
        );
      } finally {
        setLookupLoading(false);
      }
    };
    fetchPolicy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Renew Handler ── */
  const handleRenew = async () => {
    if (!policy || !detailsForm.validatePersonalAndCard()) return;
    try {
      setSubmitting(true);
      setSubmitError('');
      const res = await renewPolicy(policy.policy_id, {
        term_years: termYears,
        payment_details: {
          first_name:     detailsForm.personal.first_name.trim(),
          last_name:      detailsForm.personal.last_name.trim(),
          nic_number:     detailsForm.personal.nic_number.trim(),
          email:          detailsForm.personal.email.trim(),
          mobile_number:  detailsForm.personal.mobile_number.trim(),
          address:        detailsForm.personal.address.trim(),
          payment_method: 'Card',
        },
      });
      setResult(res.data);
      setStep('success');
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.error   ||
        err?.response?.data?.message ||
        'Renewal failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => _formatCurrency(amount, currency);

  return {
    step, setStep,
    policy, lookupLoading, lookupError,
    termYears, setTermYears,
    /* Personal Details + Card (spread from shared hook) */
    ...detailsForm,
    submitting, submitError,
    handleRenew,
    result,
    formatCurrency,
  };
}
