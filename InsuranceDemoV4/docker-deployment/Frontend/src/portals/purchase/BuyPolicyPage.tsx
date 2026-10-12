import React from 'react';
import { usePolicyPurchase } from '../../hooks/usePolicyPurchase';
import QuoteStep   from './components/QuoteStep';
import DetailsStep from './components/DetailsStep';
import SuccessStep from './components/SuccessStep';
import WizardStepper from '../../components/common/WizardStepper';
import type { Currency } from '../../lib/utils/currency';
import * as S from '../../styles/purchase/BuyPolicy.styled';

const STEP_CONFIG = [
  { key: 'quote',   label: 'Verify Quote' },
  { key: 'details', label: 'Your Details' },
  { key: 'success', label: 'Confirmation' },
] as const;

interface BuyPolicyPageProps {
  onBack: () => void;
  currency: Currency;
  initialQuoteId?: string;
}

const BuyPolicyPage: React.FC<BuyPolicyPageProps> = ({ onBack, currency, initialQuoteId }) => {
  const ctx = usePolicyPurchase(currency, initialQuoteId);
  const currentStepIndex = STEP_CONFIG.findIndex(s => s.key === ctx.step);

  return (
    <S.PageWrapper>
      <S.TopBar>
        <S.TopBarTitle>📋 Buy a Policy</S.TopBarTitle>
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

        {ctx.step === 'quote' && (
          <QuoteStep
            quoteId={ctx.quoteId}
            quoteIdError={ctx.quoteIdError}
            quoteLookupLoading={ctx.quoteLookupLoading}
            quoteLookupError={ctx.quoteLookupError}
            quote={ctx.quote}
            quoteExpired={ctx.quoteExpired}
            onQuoteIdChange={ctx.handleQuoteIdChange}
            onLookupQuote={ctx.handleLookupQuote}
            onContinue={() => ctx.setStep('details')}
            onBack={onBack}
            formatCurrency={ctx.formatCurrency}
          />
        )}

        {ctx.step === 'details' && ctx.quote && (
          <DetailsStep
            quote={ctx.quote}
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
            onPurchase={ctx.handlePurchase}
            onBack={() => ctx.setStep('quote')}
            formatCurrency={ctx.formatCurrency}
          />
        )}

        {ctx.step === 'success' && ctx.result && (
          <SuccessStep
            result={ctx.result}
            copied={ctx.copied}
            onCopyPolicyId={ctx.handleCopyPolicyId}
            onBack={onBack}
          />
        )}
      </S.Main>
    </S.PageWrapper>
  );
};

export default BuyPolicyPage;
