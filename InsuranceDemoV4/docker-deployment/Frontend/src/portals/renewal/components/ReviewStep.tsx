import React from 'react';
import type { PolicySummary } from '../../../hooks/useRenewPolicy';
import * as S from '../../../styles/purchase/BuyPolicy.styled';

interface ReviewStepProps {
  policyId: string;
  lookupLoading: boolean;
  lookupError: string;
  policy: PolicySummary | null;
  onContinue: () => void;
  onBack: () => void;
  formatCurrency: (amount: number) => string;
}

const formatDate = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const date = new Date(iso.split('+')[0]);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ReviewStep: React.FC<ReviewStepProps> = ({
  policyId, lookupLoading, lookupError, policy, onContinue, onBack, formatCurrency,
}) => {
  const canRenew = policy?.status === 'Active';

  return (
    <>
      <S.StepHeading>Verify Your Policy</S.StepHeading>
      <S.StepSubheading>
        Review the details of your policy before proceeding with renewal.
      </S.StepSubheading>

      <S.FormCard>
        {lookupLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px 0', color: '#6b7280' }}>
            <S.LoadingSpinner />
            Loading policy {policyId}…
          </div>
        )}

        {lookupError && (
          <S.ErrorBanner style={{ marginTop: '8px' }}>{lookupError}</S.ErrorBanner>
        )}

        {policy && (
          <>
            <S.QuoteSummaryCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <S.QuoteSummaryTitle>Policy Details</S.QuoteSummaryTitle>
                  <S.QuoteSummaryName>{policy.policy_id} — {policy.product_id}</S.QuoteSummaryName>
                </div>
                <span style={{
                  background: canRenew ? '#dcfce7' : '#fee2e2',
                  color:      canRenew ? '#166534' : '#991b1b',
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.78rem', fontWeight: 700,
                }}>
                  {policy.status}
                </span>
              </div>

              <S.QuoteSummaryGrid>
                <S.QuoteSummaryItem>
                  <S.QuoteSummaryLabel>Premium Amount</S.QuoteSummaryLabel>
                  <S.QuoteSummaryValue>{formatCurrency(policy.premium_amount)}</S.QuoteSummaryValue>
                </S.QuoteSummaryItem>
                <S.QuoteSummaryItem>
                  <S.QuoteSummaryLabel>Current End Date</S.QuoteSummaryLabel>
                  <S.QuoteSummaryValue>{formatDate(policy.end_date)}</S.QuoteSummaryValue>
                </S.QuoteSummaryItem>
                <S.QuoteSummaryItem>
                  <S.QuoteSummaryLabel>Start Date</S.QuoteSummaryLabel>
                  <S.QuoteSummaryValue>{formatDate(policy.start_date)}</S.QuoteSummaryValue>
                </S.QuoteSummaryItem>
                <S.QuoteSummaryItem>
                  <S.QuoteSummaryLabel>Customer ID</S.QuoteSummaryLabel>
                  <S.QuoteSummaryValue>{policy.customer_id}</S.QuoteSummaryValue>
                </S.QuoteSummaryItem>
              </S.QuoteSummaryGrid>

              {policy.policy_details && (
                <div style={{ marginTop: '14px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                  {policy.policy_details}
                </div>
              )}
            </S.QuoteSummaryCard>

            {!canRenew && (
              <S.ExpiredBanner style={{ marginTop: '16px' }}>
                <S.ExpiredTitle>⚠️ Policy Not Eligible for Renewal</S.ExpiredTitle>
                <S.ExpiredText>
                  Only <strong>Active</strong> policies can be renewed.
                  This policy is currently <strong>{policy.status}</strong>.
                  Please contact support if you believe this is an error.
                </S.ExpiredText>
              </S.ExpiredBanner>
            )}

            <S.FormActions>
              <S.SecondaryButton type="button" onClick={onBack}>Back to Login</S.SecondaryButton>
              <S.PrimaryButton type="button" onClick={onContinue} disabled={!canRenew}>
                Continue to Renewal →
              </S.PrimaryButton>
            </S.FormActions>
          </>
        )}

        {!lookupLoading && !lookupError && !policy && (
          <div style={{ padding: '24px 0', color: '#6b7280' }}>
            No policy data available. Please check the renewal link.
          </div>
        )}
      </S.FormCard>
    </>
  );
};

export default ReviewStep;
