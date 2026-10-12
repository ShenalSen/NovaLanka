import React from 'react';
import type { PaymentResult } from '../../../hooks/usePolicyPayment';
import * as S from '../../../styles/purchase/BuyPolicy.styled';

interface PaymentSuccessStepProps {
  result: PaymentResult;
  formatCurrency: (amount: number) => string;
  onBack: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const PaymentSuccessStep: React.FC<PaymentSuccessStepProps> = ({
  result, formatCurrency, onBack,
}) => (
  <>
    <S.StepHeading>Payment Successful!</S.StepHeading>
    <S.StepSubheading>
      Your premium payment has been recorded and your policy has been updated.
    </S.StepSubheading>

    <S.SuccessWrapper>
      <S.SuccessCard>
        <S.SuccessIconCircle>✓</S.SuccessIconCircle>
        <S.SuccessTitle>Payment Complete</S.SuccessTitle>
        <S.SuccessSubtitle>
          Your payment has been processed and the next due date has been updated.
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
            <S.SuccessDetailLabel>Amount Paid</S.SuccessDetailLabel>
            <S.SuccessDetailValue style={{ color: '#10b981' }}>
              {formatCurrency(result.paid_amount)}
            </S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Next Due Date</S.SuccessDetailLabel>
            <S.SuccessDetailValue>{formatDate(result.next_due_date)}</S.SuccessDetailValue>
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

export default PaymentSuccessStep;
