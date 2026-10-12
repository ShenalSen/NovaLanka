import React from 'react';
import { useRenewPolicy } from '../../hooks/useRenewPolicy';
import ReviewStep        from './components/ReviewStep';
import RenewalDetailsStep from './components/RenewalDetailsStep';
import RenewalSuccessStep from './components/RenewalSuccessStep';
import WizardStepper from '../../components/common/WizardStepper';
import type { Currency } from '../../lib/utils/currency';
import * as S from '../../styles/purchase/BuyPolicy.styled';

const STEP_CONFIG = [
  { key: 'review',  label: 'Verify Policy'    },
  { key: 'details', label: 'Renewal Details'  },
  { key: 'success', label: 'Confirmation'     },
] as const;

interface RenewPolicyPageProps {
  policyId: string;
  currency: Currency;
  onBack: () => void;
}

const RenewPolicyPage: React.FC<RenewPolicyPageProps> = ({ policyId, currency, onBack }) => {
  const ctx = useRenewPolicy(policyId, currency);
  const currentStepIndex = STEP_CONFIG.findIndex(s => s.key === ctx.step);

  return (
    <S.PageWrapper>
      <S.TopBar>
        <S.TopBarTitle>🔄 Renew My Policy</S.TopBarTitle>
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

        {ctx.step === 'review' && (
          <ReviewStep
            policyId={policyId}
            lookupLoading={ctx.lookupLoading}
            lookupError={ctx.lookupError}
            policy={ctx.policy}
            onContinue={() => ctx.setStep('details')}
            onBack={onBack}
            formatCurrency={ctx.formatCurrency}
          />
        )}

        {ctx.step === 'details' && ctx.policy && (
          <RenewalDetailsStep
            policy={ctx.policy}
            termYears={ctx.termYears}
            personal={ctx.personal}
            cardForm={ctx.cardForm}
            formErrors={ctx.formErrors}
            isAddressValid={ctx.isAddressValid}
            submitting={ctx.submitting}
            submitError={ctx.submitError}
            onTermYearsChange={ctx.setTermYears}
            onPersonalChange={ctx.handlePersonalChange}
            onCardChange={ctx.handleCardChange}
            onCardTypeChange={ctx.handleCardTypeChange}
            onAddressChange={val => {
              ctx.setPersonal(prev => ({ ...prev, address: val }));
              ctx.setFormErrors(prev => ({ ...prev, address: undefined }));
            }}
            onAddressValidation={ctx.setIsAddressValid}
            onRenew={ctx.handleRenew}
            onBack={() => ctx.setStep('review')}
            formatCurrency={ctx.formatCurrency}
          />
        )}

        {ctx.step === 'success' && ctx.result && (
          <RenewalSuccessStep
            result={ctx.result}
            formatCurrency={ctx.formatCurrency}
            onBack={onBack}
          />
        )}
      </S.Main>
    </S.PageWrapper>
  );
};

export default RenewPolicyPage;
