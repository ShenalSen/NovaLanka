import React from 'react';
import type { QuoteResponse } from '../../../lib/api/quotesApi';
import type { PersonalForm, CardForm, FormErrors } from '../../../hooks/usePolicyPurchase';
import type { CardType } from '../../../lib/utils/cardValidation';
import { maxInputLength, getCardConfig } from '../../../lib/utils/cardValidation';
import AddressInput from '../../../components/common/AddressInput';
import CardTypeSelector from '../../../components/common/CardTypeSelector';
import * as S from '../../../styles/purchase/BuyPolicy.styled';

interface DetailsStepProps {
  quote: QuoteResponse;
  personal: PersonalForm;
  cardForm: CardForm;
  formErrors: FormErrors;
  isAddressValid: boolean | null;
  submitting: boolean;
  submitError: string;
  onPersonalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardTypeChange: (type: CardType) => void;
  onAddressChange: (val: string) => void;
  onAddressValidation: (isValid: boolean) => void;
  onPurchase: () => void;
  onBack: () => void;
  formatCurrency: (amount: number) => string;
}

const Req = () => <span style={{ color: '#ef4444' }}>*</span>;

const DetailsStep: React.FC<DetailsStepProps> = ({
  quote, personal, cardForm, formErrors, isAddressValid,
  submitting, submitError,
  onPersonalChange, onCardChange, onCardTypeChange, onAddressChange, onAddressValidation,
  onPurchase, onBack, formatCurrency,
}) => (
  <>
    <S.StepHeading>Your Details &amp; Payment</S.StepHeading>
    <S.StepSubheading>
      Fill in your personal information and complete the card payment below.
    </S.StepSubheading>

    <S.FormCard>
      {submitError && <S.ErrorBanner>{submitError}</S.ErrorBanner>}

      <S.SectionTitle>Personal Information</S.SectionTitle>
      <S.FormGrid>
        <S.FormGroup>
          <S.FormLabel htmlFor="first_name">First Name <Req /></S.FormLabel>
          <S.FormInput
            id="first_name" name="first_name" type="text" placeholder="John"
            value={personal.first_name} onChange={onPersonalChange}
            hasError={!!formErrors.first_name}
          />
          {formErrors.first_name && <S.FieldError>{formErrors.first_name}</S.FieldError>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel htmlFor="last_name">Last Name <Req /></S.FormLabel>
          <S.FormInput
            id="last_name" name="last_name" type="text" placeholder="Doe"
            value={personal.last_name} onChange={onPersonalChange}
            hasError={!!formErrors.last_name}
          />
          {formErrors.last_name && <S.FieldError>{formErrors.last_name}</S.FieldError>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel htmlFor="nic_number">NIC Number <Req /></S.FormLabel>
          <S.FormInput
            id="nic_number" name="nic_number" type="text" placeholder="911234567V"
            value={personal.nic_number} onChange={onPersonalChange}
            hasError={!!formErrors.nic_number}
          />
          {formErrors.nic_number
            ? <S.FieldError>{formErrors.nic_number}</S.FieldError>
            : <S.FieldHint>Old format (e.g. 911234567V) or new format (12 digits)</S.FieldHint>
          }
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel htmlFor="email">Email <Req /></S.FormLabel>
          <S.FormInput
            id="email" name="email" type="email" placeholder="john@example.com"
            value={personal.email} onChange={onPersonalChange}
            hasError={!!formErrors.email}
          />
          {formErrors.email && <S.FieldError>{formErrors.email}</S.FieldError>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel htmlFor="mobile_number">Mobile Number <Req /></S.FormLabel>
          <S.FormInput
            id="mobile_number" name="mobile_number" type="tel" placeholder="0711234567"
            value={personal.mobile_number} onChange={onPersonalChange}
            hasError={!!formErrors.mobile_number}
          />
          {formErrors.mobile_number && <S.FieldError>{formErrors.mobile_number}</S.FieldError>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>Premium Amount</S.FormLabel>
          <S.ReadOnlyField>{formatCurrency(quote.total_premium)}</S.ReadOnlyField>
          <S.FieldHint>Based on your quote</S.FieldHint>
        </S.FormGroup>

        <div style={{ gridColumn: '1 / -1' }}>
          <AddressInput
            id="address" name="address" label="Address"
            value={personal.address}
            onChange={onAddressChange}
            required
            onValidationComplete={onAddressValidation}
          />
          {formErrors.address && <S.FieldError>{formErrors.address}</S.FieldError>}
        </div>
      </S.FormGrid>

      <S.SectionDivider />

      <S.SectionTitle>Card Payment</S.SectionTitle>
      <S.CardFormWrapper>
        <S.FormGrid>
          <S.FormGroup style={{ gridColumn: '1 / -1' }}>
            <S.FormLabel>Card Type <Req /></S.FormLabel>
            <CardTypeSelector
              selected={cardForm.card_type}
              onChange={onCardTypeChange}
              error={formErrors.card_type}
            />
          </S.FormGroup>

          <S.FormGroup style={{ gridColumn: '1 / -1' }}>
            <S.FormLabel htmlFor="name_on_card">Name on Card <Req /></S.FormLabel>
            <S.FormInput
              id="name_on_card" name="name_on_card" type="text" placeholder="JOHN DOE"
              value={cardForm.name_on_card} onChange={onCardChange}
              hasError={!!formErrors.name_on_card}
            />
            {formErrors.name_on_card && <S.FieldError>{formErrors.name_on_card}</S.FieldError>}
          </S.FormGroup>

          <S.FormGroup style={{ gridColumn: '1 / -1' }}>
            <S.FormLabel htmlFor="card_number">Card Number <Req /></S.FormLabel>
            <S.CardNumberInput
              id="card_number" name="card_number" type="text"
              placeholder={cardForm.card_type === 'amex' ? '3782 822463 10005' : '1234 5678 9012 3456'}
              value={cardForm.card_number} onChange={onCardChange}
              hasError={!!formErrors.card_number}
              maxLength={maxInputLength(cardForm.card_type)}
              disabled={!cardForm.card_type}
            />
            {formErrors.card_number && <S.FieldError>{formErrors.card_number}</S.FieldError>}
          </S.FormGroup>

          <S.FormGroup>
            <S.FormLabel htmlFor="expiry">Expiry (MM/YY) <Req /></S.FormLabel>
            <S.FormInput
              id="expiry" name="expiry" type="text" placeholder="12/27"
              value={cardForm.expiry} onChange={onCardChange}
              hasError={!!formErrors.expiry} maxLength={5}
            />
            {formErrors.expiry && <S.FieldError>{formErrors.expiry}</S.FieldError>}
          </S.FormGroup>

          <S.FormGroup>
            <S.FormLabel htmlFor="cvv">
              CVV {cardForm.card_type === 'amex' ? '(4 digits)' : '(3 digits)'} <Req />
            </S.FormLabel>
            <S.FormInput
              id="cvv" name="cvv" type="password"
              placeholder={cardForm.card_type === 'amex' ? '••••' : '•••'}
              value={cardForm.cvv} onChange={onCardChange}
              hasError={!!formErrors.cvv}
              maxLength={getCardConfig(cardForm.card_type)?.cvvLength ?? 3}
              disabled={!cardForm.card_type}
            />
            {formErrors.cvv && <S.FieldError>{formErrors.cvv}</S.FieldError>}
          </S.FormGroup>
        </S.FormGrid>
      </S.CardFormWrapper>

      <S.FormActions>
        <S.SecondaryButton type="button" onClick={onBack}>Back</S.SecondaryButton>
        <S.PrimaryButton type="button" onClick={onPurchase} disabled={submitting}>
          {submitting
            ? <><S.LoadingSpinner /> Processing…</>
            : `Pay ${formatCurrency(quote.total_premium)} →`
          }
        </S.PrimaryButton>
      </S.FormActions>
    </S.FormCard>
  </>
);

export default DetailsStep;
