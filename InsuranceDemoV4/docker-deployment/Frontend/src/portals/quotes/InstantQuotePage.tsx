import React from 'react';
import { useInstantQuote } from '../../hooks/useInstantQuote';
import SelectStep  from './components/SelectStep';
import DetailsStep from './components/DetailsStep';
import ResultStep  from './components/ResultStep';
import WizardStepper from '../../components/common/WizardStepper';
import type { Currency } from '../../lib/utils/currency';
import * as S from '../../styles/quotes/InstantQuote.styled';

const STEP_CONFIG = [
  { key: 'select',  label: 'Select Plan'  },
  { key: 'details', label: 'Your Details' },
  { key: 'result',  label: 'Your Quote'   },
] as const;

interface InstantQuotePageProps {
  onBack: () => void;
  onBuyPolicy: (quoteId: string) => void;
  currency: Currency;
}

const InstantQuotePage: React.FC<InstantQuotePageProps> = ({ onBack, onBuyPolicy, currency }) => {
  const ctx = useInstantQuote(currency);
  const currentStepIndex = STEP_CONFIG.findIndex(s => s.key === ctx.step);

  return (
    <S.PageWrapper>
      <S.TopBar>
        <S.TopBarTitle>⚡ Instant Quote</S.TopBarTitle>
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

        {ctx.step === 'select' && (
          <SelectStep
            products={ctx.products}
            loadingProducts={ctx.loadingProducts}
            productError={ctx.productError}
            selectedId={ctx.selected?.product_id}
            onSelect={ctx.handleSelectProduct}
            formatCurrency={ctx.formatCurrency}
          />
        )}

        {ctx.step === 'details' && ctx.selected && (
          <DetailsStep
            selected={ctx.selected}
            form={ctx.form}
            errors={ctx.errors}
            submitting={ctx.submitting}
            apiError={ctx.apiError}
            onFieldChange={ctx.handleFieldChange}
            onSubmit={ctx.handleGenerateQuote}
            onBack={() => ctx.setStep('select')}
            onChangePlan={() => ctx.setStep('select')}
          />
        )}

        {ctx.step === 'result' && ctx.quote && (
          <ResultStep
            quote={ctx.quote}
            selected={ctx.selected}
            copied={ctx.copied}
            onCopyQuoteId={ctx.handleCopyQuoteId}
            onNewQuote={ctx.handleNewQuote}
            onBuyPolicy={onBuyPolicy}
            formatCurrency={ctx.formatCurrency}
          />
        )}
      </S.Main>
    </S.PageWrapper>
  );
};

export default InstantQuotePage;
