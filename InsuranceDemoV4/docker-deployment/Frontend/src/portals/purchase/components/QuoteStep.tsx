import React from 'react';
import type { QuoteResponse } from '../../../lib/api/quotesApi';
import { formatFrequency } from '../../../hooks/usePolicyPurchase';
import * as S from '../../../styles/purchase/BuyPolicy.styled';

interface QuoteStepProps {
  quoteId: string;
  quoteIdError: string;
  quoteLookupLoading: boolean;
  quoteLookupError: string;
  quote: QuoteResponse | null;
  quoteExpired: boolean;
  onQuoteIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLookupQuote: () => void;
  onContinue: () => void;
  onBack: () => void;
  formatCurrency: (amount: number) => string;
}

const QuoteStep: React.FC<QuoteStepProps> = ({
  quoteId, quoteIdError, quoteLookupLoading, quoteLookupError,
  quote, quoteExpired,
  onQuoteIdChange, onLookupQuote, onContinue, onBack, formatCurrency,
}) => (
  <>
    <S.StepHeading>Verify Your Quote</S.StepHeading>
    <S.StepSubheading>
      Enter the Quote ID you received from our instant quote tool to get started.
    </S.StepSubheading>

    <S.FormCard>
      <S.FormGroup>
        <S.FormLabel htmlFor="quoteId">
          Quote ID <span style={{ color: '#ef4444' }}>*</span>
        </S.FormLabel>
        <S.QuoteInputRow>
          <S.FormInput
            id="quoteId"
            type="text"
            placeholder="e.g. QT_001"
            value={quoteId}
            onChange={onQuoteIdChange}
            hasError={!!quoteIdError}
            style={{ flex: 1 }}
            disabled={quoteLookupLoading}
            onKeyDown={e => e.key === 'Enter' && onLookupQuote()}
          />
          <S.PrimaryButton type="button" onClick={onLookupQuote} disabled={quoteLookupLoading}>
            {quoteLookupLoading ? <><S.LoadingSpinner /> Checking…</> : 'Verify'}
          </S.PrimaryButton>
        </S.QuoteInputRow>
        {quoteIdError && <S.FieldError>{quoteIdError}</S.FieldError>}
        <S.FieldHint>
          Quote IDs start with "QT_" and were provided when you generated your instant quote.
        </S.FieldHint>
      </S.FormGroup>

      {quoteLookupError && (
        <S.ErrorBanner style={{ marginTop: '16px' }}>{quoteLookupError}</S.ErrorBanner>
      )}

      {quote && quoteExpired && (
        <S.ExpiredBanner>
          <S.ExpiredTitle>⏰ Quote Expired</S.ExpiredTitle>
          <S.ExpiredText>
            This quote expired on{' '}
            {new Date(quote.valid_until).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}.
            Please generate a new quote to continue.
          </S.ExpiredText>
          <S.SecondaryButton type="button" onClick={onBack}>
            Generate New Quote
          </S.SecondaryButton>
        </S.ExpiredBanner>
      )}

      {quote && !quoteExpired && (
        <>
          <S.QuoteSummaryCard>
            <S.QuoteSummaryTitle>Quote Verified ✓</S.QuoteSummaryTitle>
            <S.QuoteSummaryName>
              {quote.product_id} — {formatFrequency(quote.frequency)} Plan
            </S.QuoteSummaryName>
            <S.QuoteSummaryGrid>
              <S.QuoteSummaryItem>
                <S.QuoteSummaryLabel>Premium</S.QuoteSummaryLabel>
                <S.QuoteSummaryValue>{formatCurrency(quote.total_premium)}</S.QuoteSummaryValue>
              </S.QuoteSummaryItem>
              <S.QuoteSummaryItem>
                <S.QuoteSummaryLabel>Coverage</S.QuoteSummaryLabel>
                <S.QuoteSummaryValue>{quote.coverage_type}</S.QuoteSummaryValue>
              </S.QuoteSummaryItem>
              <S.QuoteSummaryItem>
                <S.QuoteSummaryLabel>Term</S.QuoteSummaryLabel>
                <S.QuoteSummaryValue>{quote.term_years} years</S.QuoteSummaryValue>
              </S.QuoteSummaryItem>
              <S.QuoteSummaryItem>
                <S.QuoteSummaryLabel>Sum Assured</S.QuoteSummaryLabel>
                <S.QuoteSummaryValue>{formatCurrency(quote.sum_assured)}</S.QuoteSummaryValue>
              </S.QuoteSummaryItem>
            </S.QuoteSummaryGrid>
          </S.QuoteSummaryCard>

          <S.FormActions>
            <S.SecondaryButton type="button" onClick={onBack}>Back</S.SecondaryButton>
            <S.PrimaryButton type="button" onClick={onContinue}>Continue →</S.PrimaryButton>
          </S.FormActions>
        </>
      )}
    </S.FormCard>
  </>
);

export default QuoteStep;
