import React from 'react';
import type { PolicyPurchaseResponse } from '../../../lib/api/policyLifecycleApi';
import * as S from '../../../styles/purchase/BuyPolicy.styled';

interface SuccessStepProps {
  result: PolicyPurchaseResponse;
  copied: boolean;
  onCopyPolicyId: () => void;
  onBack: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ result, copied, onCopyPolicyId, onBack }) => (
  <>
    <S.StepHeading>Policy Purchased Successfully!</S.StepHeading>
    <S.StepSubheading>
      Your policy is now active. Please save the details below for your records.
    </S.StepSubheading>

    <S.SuccessWrapper>
      <S.SuccessCard>
        <S.SuccessIconCircle>✓</S.SuccessIconCircle>
        <S.SuccessTitle>Welcome aboard!</S.SuccessTitle>
        <S.SuccessSubtitle>
          Your policy has been activated and payment has been recorded.
        </S.SuccessSubtitle>

        <S.PolicyIdBadge>
          <span>Policy ID: <strong>{result.policy_id}</strong></span>
          <S.ExternalLinkButton
            as="button"
            onClick={onCopyPolicyId}
            style={{
              background: 'none',
              color: '#166534',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '2px 8px',
              boxShadow: 'none',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </S.ExternalLinkButton>
        </S.PolicyIdBadge>

        <S.SuccessDetailGrid>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Policy Status</S.SuccessDetailLabel>
            <S.SuccessDetailValue style={{ color: '#10b981' }}>
              {result.policy_status}
            </S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Payment ID</S.SuccessDetailLabel>
            <S.SuccessDetailValue>{result.payment_id}</S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Next Due Date</S.SuccessDetailLabel>
            <S.SuccessDetailValue>
              {new Date(result.next_due_date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Payment Date</S.SuccessDetailLabel>
            <S.SuccessDetailValue>{result.payment_time}</S.SuccessDetailValue>
          </S.SuccessDetailItem>
          <S.SuccessDetailItem>
            <S.SuccessDetailLabel>Payment Status</S.SuccessDetailLabel>
            <S.SuccessDetailValue style={{ color: '#10b981', textTransform: 'capitalize' }}>
              {result.payment_status}
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

export default SuccessStep;
