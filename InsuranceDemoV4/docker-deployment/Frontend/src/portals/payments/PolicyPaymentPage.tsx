import React from 'react';
import { usePolicyPayment } from '../../hooks/usePolicyPayment';
import PolicyLookupStep    from './components/PolicyLookupStep';
import PremiumPaymentStep  from './components/PremiumPaymentStep';
import PaymentSuccessStep  from './components/PaymentSuccessStep';
import WizardStepper from '../../components/common/WizardStepper';
import type { Currency } from '../../lib/utils/currency';
import * as S from '../../styles/purchase/BuyPolicy.styled';

const STEP_CONFIG = [
  { key: 'lookup',  label: 'Verify Policy' },
  { key: 'details', label: 'Your Details'  },
  { key: 'success', label: 'Confirmation'  },
] as const;

interface PolicyPaymentPageProps {
  onBack: () => void;
  currency: Currency;
}

const PolicyPaymentPage: React.FC<PolicyPaymentPageProps> = ({ onBack, currency }) => {
  const ctx = usePolicyPayment(currency);
  const currentStepIndex = STEP_CONFIG.findIndex(s => s.key === ctx.step);

  return (
    <S.PageWrapper>
      <S.TopBar>
        <S.TopBarTitle>💳 Policy Payments</S.TopBarTitle>
        <S.BackButton onClick={onBack}>← Back to Login</S.BackButton>
      </S.TopBar>

      <S.Main>
        <WizardStepper
          steps={STEP_CONFIG}
          currentStepIndex={currentStepIndex}
          StepperRow={S.StepperRow}
          StepItem={S.StepItem}
          StepDot={S.StepDot}
          StepLabel={S.StepLabel}
          StepConnector={S.StepConnector}
        />

        {ctx.step === 'lookup' && (
          <PolicyLookupStep
            policyId={ctx.policyId}
            policyIdError={ctx.policyIdError}
            lookupLoading={ctx.lookupLoading}
            lookupError={ctx.lookupError}
            policy={ctx.policy}
            onPolicyIdChange={ctx.handlePolicyIdChange}
            onLookupPolicy={ctx.handleLookupPolicy}
            onContinue={() => ctx.setStep('details')}
            onBack={onBack}
            formatCurrency={ctx.formatCurrency}
          />
        )}

        {ctx.step === 'details' && ctx.policy && (
          <PremiumPaymentStep
            policy={ctx.policy}
            personal={ctx.personal}
            cardForm={ctx.cardForm}
            formErrors={ctx.formErrors}
            isAddressValid={ctx.isAddressValid}
            submitting={ctx.submitting}
            submitError={ctx.submitError}
            onPersonalChange={ctx.handlePersonalChange}
            onCardChange={ctx.handleCardChange}
            onCardTypeChange={ctx.handleCardTypeChange}
            onAddressChange={val => {
              ctx.setPersonal(prev => ({ ...prev, address: val }));
              ctx.setFormErrors(prev => ({ ...prev, address: undefined }));
            }}
            onAddressValidation={ctx.setIsAddressValid}
            onPayment={ctx.handlePayment}
            onBack={() => ctx.setStep('lookup')}
            formatCurrency={ctx.formatCurrency}
          />
        )}

        {ctx.step === 'success' && ctx.result && (
          <PaymentSuccessStep
            result={ctx.result}
            formatCurrency={ctx.formatCurrency}
            onBack={onBack}
          />
        )}
      </S.Main>
    </S.PageWrapper>
  );
};

export default PolicyPaymentPage;
