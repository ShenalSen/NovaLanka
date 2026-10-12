import React from 'react';
import type { PolicySummary, PersonalForm, CardForm, FormErrors } from '../../../hooks/useRenewPolicy';
import type { CardType } from '../../../lib/utils/cardValidation';
import { maxInputLength, getCardConfig } from '../../../lib/utils/cardValidation';
import AddressInput from '../../../components/common/AddressInput';
import CardTypeSelector from '../../../components/common/CardTypeSelector';
import * as S from '../../../styles/purchase/BuyPolicy.styled';

interface RenewalDetailsStepProps {
  policy: PolicySummary;
  termYears: number;
  personal: PersonalForm;
  cardForm: CardForm;
  formErrors: FormErrors;
  isAddressValid: boolean | null;
  submitting: boolean;
  submitError: string;
  onTermYearsChange: (years: number) => void;
  onPersonalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardTypeChange: (type: CardType) => void;
  onAddressChange: (val: string) => void;
  onAddressValidation: (isValid: boolean) => void;
  onRenew: () => void;
  onBack: () => void;
  formatCurrency: (amount: number) => string;
}

const Req = () => <span style={{ color: '#ef4444' }}>*</span>;

const TERM_OPTIONS = [1, 2, 3, 4, 5];

const formatDate = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const date = new Date(iso.split('+')[0]);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const addYears = (iso: string | null, years: number): string => {
  if (!iso) return '—';
  const d = new Date(iso.split('+')[0]);
  d.setFullYear(d.getFullYear() + years);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const RenewalDetailsStep: React.FC<RenewalDetailsStepProps> = ({
  policy, termYears, personal, cardForm, formErrors, isAddressValid,
  submitting, submitError,
  onTermYearsChange, onPersonalChange, onCardChange, onCardTypeChange,
  onAddressChange, onAddressValidation, onRenew, onBack, formatCurrency,
}) => (
  <>
    <S.StepHeading>Renewal Details &amp; Payment</S.StepHeading>
    <S.StepSubheading>
      Choose your renewal term, fill in your details, and complete payment to extend your coverage.
    </S.StepSubheading>

    <S.FormCard>
      {submitError && <S.ErrorBanner>{submitError}</S.ErrorBanner>}

      {/* ── Renewal Summary ── */}
      <S.SectionTitle>Renewal Summary</S.SectionTitle>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        background: '#f9fafb', borderRadius: '10px',
        padding: '16px', marginBottom: '24px',
        border: '1px solid #e5e7eb',
      }}>
        {[
          { label: 'Policy',           value: policy.policy_id },
          { label: 'Current End Date', value: formatDate(policy.end_date) },
          { label: 'Premium Amount',   value: formatCurrency(policy.premium_amount) },
          { label: 'New End Date',     value: addYears(policy.end_date, termYears) },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Term Years ── */}
      <S.SectionTitle>Renewal Term</S.SectionTitle>
      <S.FormGroup style={{ marginBottom: '24px' }}>
        <S.FormLabel>Select Number of Years to Extend <Req /></S.FormLabel>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {TERM_OPTIONS.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => onTermYearsChange(y)}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: termYears === y ? '2px solid #6c47ff' : '2px solid #d1d5db',
                background: termYears === y ? 'rgba(108,71,255,0.08)' : '#f9fafb',
                color: termYears === y ? '#6c47ff' : '#374151',
                fontWeight: termYears === y ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {y} {y === 1 ? 'Year' : 'Years'}
            </button>
          ))}
        </div>
        <S.FieldHint>
          Your policy will be extended to {addYears(policy.end_date, termYears)}.
          Premium of {formatCurrency(policy.premium_amount)} applies.
        </S.FieldHint>
      </S.FormGroup>

      <S.SectionDivider />

      {/* ── Personal Information ── */}
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
          <S.FormLabel>Amount to Pay</S.FormLabel>
          <S.ReadOnlyField>{formatCurrency(policy.premium_amount)}</S.ReadOnlyField>
          <S.FieldHint>One-time renewal premium for {policy.policy_id}</S.FieldHint>
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

      {/* ── Card Payment ── */}
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
        <S.PrimaryButton type="button" onClick={onRenew} disabled={submitting}>
          {submitting
            ? <><S.LoadingSpinner /> Processing…</>
            : `Renew for ${formatCurrency(policy.premium_amount)} →`
          }
        </S.PrimaryButton>
      </S.FormActions>
    </S.FormCard>
  </>
);

export default RenewalDetailsStep;
