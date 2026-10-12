import React from 'react';
import type { PolicyData, PolicyStatus } from '../../../hooks/usePolicyPayment';
import * as S from '../../../styles/purchase/BuyPolicy.styled';

interface PolicyLookupStepProps {
  policyId: string;
  policyIdError: string;
  lookupLoading: boolean;
  lookupError: string;
  policy: PolicyData | null;
  onPolicyIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLookupPolicy: () => void;
  onContinue: () => void;
  onBack: () => void;
  formatCurrency: (amount: number) => string;
}

const STATUS_CONFIG: Record<PolicyStatus, { color: string; bg: string; label: string }> = {
  Active:    { color: '#166534', bg: '#dcfce7', label: 'Active' },
  Inactive:  { color: '#92400e', bg: '#fef3c7', label: 'Inactive' },
  Expired:   { color: '#991b1b', bg: '#fee2e2', label: 'Expired' },
  Cancelled: { color: '#6b7280', bg: '#f3f4f6', label: 'Cancelled' },
};

const formatDate = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const date = new Date(iso.split('+')[0]); // strip timezone offset
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const PolicyLookupStep: React.FC<PolicyLookupStepProps> = ({
  policyId, policyIdError, lookupLoading, lookupError,
  policy, onPolicyIdChange, onLookupPolicy, onContinue, onBack, formatCurrency,
}) => {
  const canPay = policy?.status === 'Active';
  const statusCfg = policy ? STATUS_CONFIG[policy.status] : null;

  return (
    <>
      <S.StepHeading>Verify Your Policy</S.StepHeading>
      <S.StepSubheading>
        Enter your Policy ID to look up your policy and make a premium payment.
      </S.StepSubheading>

      <S.FormCard>
        <S.FormGroup>
          <S.FormLabel htmlFor="policyId">
            Policy ID <span style={{ color: '#ef4444' }}>*</span>
          </S.FormLabel>
          <S.QuoteInputRow>
            <S.FormInput
              id="policyId"
              type="text"
              placeholder="e.g. POL_001"
              value={policyId}
              onChange={onPolicyIdChange}
              hasError={!!policyIdError}
              style={{ flex: 1 }}
              disabled={lookupLoading}
              onKeyDown={e => e.key === 'Enter' && onLookupPolicy()}
            />
            <S.PrimaryButton type="button" onClick={onLookupPolicy} disabled={lookupLoading}>
              {lookupLoading ? <><S.LoadingSpinner /> Checking…</> : 'Look Up'}
            </S.PrimaryButton>
          </S.QuoteInputRow>
          {policyIdError && <S.FieldError>{policyIdError}</S.FieldError>}
          <S.FieldHint>Policy IDs start with "POL_" followed by a number (e.g. POL_001)</S.FieldHint>
        </S.FormGroup>

        {lookupError && (
          <S.ErrorBanner style={{ marginTop: '16px' }}>{lookupError}</S.ErrorBanner>
        )}

        {policy && (
          <>
            {/* Policy summary card */}
            <S.QuoteSummaryCard style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <S.QuoteSummaryTitle>Policy Found</S.QuoteSummaryTitle>
                  <S.QuoteSummaryName>{policy.policy_id} — {policy.product_id}</S.QuoteSummaryName>
                </div>
                {statusCfg && (
                  <span style={{
                    background: statusCfg.bg, color: statusCfg.color,
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '0.78rem', fontWeight: 700,
                  }}>
                    {statusCfg.label}
                  </span>
                )}
              </div>

              <S.QuoteSummaryGrid>
                <S.QuoteSummaryItem>
                  <S.QuoteSummaryLabel>Premium Amount</S.QuoteSummaryLabel>
                  <S.QuoteSummaryValue>{formatCurrency(policy.premium_amount)}</S.QuoteSummaryValue>
                </S.QuoteSummaryItem>
                <S.QuoteSummaryItem>
                  <S.QuoteSummaryLabel>Next Due Date</S.QuoteSummaryLabel>
                  <S.QuoteSummaryValue>{formatDate(policy.next_due_date)}</S.QuoteSummaryValue>
                </S.QuoteSummaryItem>
                <S.QuoteSummaryItem>
                  <S.QuoteSummaryLabel>Start Date</S.QuoteSummaryLabel>
                  <S.QuoteSummaryValue>{formatDate(policy.start_date)}</S.QuoteSummaryValue>
                </S.QuoteSummaryItem>
                <S.QuoteSummaryItem>
                  <S.QuoteSummaryLabel>End Date</S.QuoteSummaryLabel>
                  <S.QuoteSummaryValue>{formatDate(policy.end_date)}</S.QuoteSummaryValue>
                </S.QuoteSummaryItem>
              </S.QuoteSummaryGrid>

              {policy.policy_details && (
                <div style={{ marginTop: '14px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                  {policy.policy_details}
                </div>
              )}
            </S.QuoteSummaryCard>

            {/* Status note for non Active policies */}
            {!canPay && statusCfg && (
              <S.ExpiredBanner style={{ marginTop: '16px' }}>
                <S.ExpiredTitle>⚠️ This policy is {policy.status}</S.ExpiredTitle>
                <S.ExpiredText>
                  Premium payments can only be made for Active policies.
                  This policy is currently <strong>{policy.status}</strong> and cannot be paid at this time.
                </S.ExpiredText>
              </S.ExpiredBanner>
            )}

            <S.FormActions>
              <S.SecondaryButton type="button" onClick={onBack}>Back</S.SecondaryButton>
              <S.PrimaryButton type="button" onClick={onContinue} disabled={!canPay}>
                Pay Premium →
              </S.PrimaryButton>
            </S.FormActions>
          </>
        )}
      </S.FormCard>
    </>
  );
};

export default PolicyLookupStep;
