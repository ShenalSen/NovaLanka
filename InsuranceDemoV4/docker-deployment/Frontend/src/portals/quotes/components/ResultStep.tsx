import React from 'react';
import type { QuoteResponse, FrequencyType } from '../../../lib/api/quotesApi';
import type { Product } from '../../../hooks/useInstantQuote';
import { FREQUENCY_LABEL, formatDate } from '../../../hooks/useInstantQuote';
import * as S from '../../../styles/quotes/InstantQuote.styled';

interface ResultStepProps {
  quote: QuoteResponse;
  selected: Product | null;
  copied: boolean;
  onCopyQuoteId: () => void;
  onNewQuote: () => void;
  onBuyPolicy: (quoteId: string) => void;
  formatCurrency: (amount: number) => string;
}

const ResultStep: React.FC<ResultStepProps> = ({
  quote, selected, copied, onCopyQuoteId, onNewQuote, onBuyPolicy, formatCurrency,
}) => (
  <>
    <S.StepHeading>Your Quote is Ready!</S.StepHeading>
    <S.StepSubheading>Here's your personalised insurance premium estimate.</S.StepSubheading>

    <S.ResultCard>
      <S.ResultHeader>
        <S.ResultIcon>📋</S.ResultIcon>
        <div>
          <S.ResultTitle>{selected?.name}</S.ResultTitle>
          <S.ResultSubtitle>Quote generated · Status: {quote.status}</S.ResultSubtitle>
        </div>
      </S.ResultHeader>

      <S.PremiumHighlight>
        <S.PremiumLabel>
          Your {quote.frequency.replace('_', '-').toLowerCase()} premium
        </S.PremiumLabel>
        <S.PremiumAmount>{formatCurrency(quote.total_premium)}</S.PremiumAmount>
        <S.PremiumFrequency>{FREQUENCY_LABEL[quote.frequency as FrequencyType]}</S.PremiumFrequency>
      </S.PremiumHighlight>

      <S.QuoteIdBadge>
        <span>Quote ID: <strong>{quote.quote_id}</strong></span>
        <S.CopyButton onClick={onCopyQuoteId}>
          {copied ? '✓ Copied' : 'Copy'}
        </S.CopyButton>
      </S.QuoteIdBadge>

      <S.DetailGrid>
        <S.DetailItem>
          <S.DetailLabel>Annual Base Premium</S.DetailLabel>
          <S.DetailValue>{formatCurrency(quote.base_premium)}</S.DetailValue>
        </S.DetailItem>
        <S.DetailItem>
          <S.DetailLabel>Sum Assured</S.DetailLabel>
          <S.DetailValue>{formatCurrency(quote.sum_assured)}</S.DetailValue>
        </S.DetailItem>
        <S.DetailItem>
          <S.DetailLabel>Policy Term</S.DetailLabel>
          <S.DetailValue>{quote.term_years} years</S.DetailValue>
        </S.DetailItem>
        <S.DetailItem>
          <S.DetailLabel>Coverage Type</S.DetailLabel>
          <S.DetailValue style={{ textTransform: 'capitalize' }}>{quote.coverage_type}</S.DetailValue>
        </S.DetailItem>
        <S.DetailItem>
          <S.DetailLabel>Age at Entry</S.DetailLabel>
          <S.DetailValue>{quote.age} years</S.DetailValue>
        </S.DetailItem>
        <S.DetailItem>
          <S.DetailLabel>Payment Frequency</S.DetailLabel>
          <S.DetailValue style={{ textTransform: 'capitalize' }}>
            {quote.frequency.replace('_', '-').toLowerCase()}
          </S.DetailValue>
        </S.DetailItem>
      </S.DetailGrid>

      <S.ValidUntilNote>
        ⏱ This quote is valid until {formatDate(quote.valid_until)}. Save your Quote ID to continue later.
      </S.ValidUntilNote>

      <S.FormActions>
        <S.SecondaryButton onClick={onNewQuote}>Get Another Quote</S.SecondaryButton>
        <S.PrimaryButton onClick={() => onBuyPolicy(quote.quote_id)}>Buy Policy →</S.PrimaryButton>
      </S.FormActions>
    </S.ResultCard>
  </>
);

export default ResultStep;
