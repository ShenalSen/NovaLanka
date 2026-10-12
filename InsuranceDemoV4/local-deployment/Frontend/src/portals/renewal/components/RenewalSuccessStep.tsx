import React from 'react';
import type { RenewPolicyResponse } from '../../../lib/api/policyLifecycleApi';
import * as S from '../../../styles/purchase/BuyPolicy.styled';

interface RenewalSuccessStepProps {
  result: RenewPolicyResponse;
  formatCurrency: (amount: number) => string;
  onBack: () => void;
}

const formatDate = (iso: string) => {
  if (!iso) return '—';
  return new Date(iso.split('+')[0]).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const RenewalSuccessStep: React.FC<RenewalSuccessStepProps> = ({ result, formatCurrency, onBack }) => (
  <>
    <S.StepHeading>Policy Renewed Successfully!</S.StepHeading>
    <S.StepSubheading>
      Your coverage has been extended. Here are your updated policy details.
    </S.StepSubheading>

    <S.SuccessWrapper>
      <S.SuccessCard>
        <S.SuccessIconCircle>✓</S.SuccessIconCircle>
        <S.SuccessTitle>Renewal Complete</S.SuccessTitle>
        <S.SuccessSubtitle>
          Your policy has been renewed and your coverage extended by{' '}
          <strong>{result.term_years_added} year{result.term_years_added !== 1 ? 's' : ''}</strong>.
        </S.SuccessSubtitle>

        <S.PolicyIdBadge>
          <span>Payment ID: <strong>{result.payment_id}</strong></span>
        </S.PolicyIdBadge>

        <S.SuccessDetailGrid>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Policy ID</S.SuccessDetailLabel>
            <S.SuccessDetailValue>{result.policy_id}</S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Status</S.SuccessDetailLabel>
            <S.SuccessDetailValue style={{ color: '#10b981' }}>{result.status}</S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>New End Date</S.SuccessDetailLabel>
            <S.SuccessDetailValue style={{ color: '#10b981' }}>
              {formatDate(result.new_end_date)}
            </S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Premium Paid</S.SuccessDetailLabel>
            <S.SuccessDetailValue>{formatCurrency(result.premium_amount)}</S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Term Extended</S.SuccessDetailLabel>
            <S.SuccessDetailValue>
              {result.term_years_added} Year{result.term_years_added !== 1 ? 's' : ''}
            </S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Payment Method</S.SuccessDetailLabel>
            <S.SuccessDetailValue>Card</S.SuccessDetailValue>
          </S.SuccessDetailItem>
        </S.SuccessDetailGrid>

        <S.SecondaryButton
          type="button"
          onClick={onBack}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Back to Login
        </S.SecondaryButton>
      </S.SuccessCard>
    </S.SuccessWrapper>
  </>
);

export default RenewalSuccessStep;
