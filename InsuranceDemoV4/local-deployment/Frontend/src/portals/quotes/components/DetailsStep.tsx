import React from 'react';
import type { Product, FormValues, FormErrors } from '../../../hooks/useInstantQuote';
import { FREQUENCY_OPTIONS } from '../../../hooks/useInstantQuote';
import * as S from '../../../styles/quotes/InstantQuote.styled';

interface DetailsStepProps {
  selected: Product;
  form: FormValues;
  errors: FormErrors;
  submitting: boolean;
  apiError: string | null;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onChangePlan: () => void;
}

const Req = () => <span style={{ color: '#ef4444' }}>*</span>;

const DetailsStep: React.FC<DetailsStepProps> = ({
  selected, form, errors, submitting, apiError,
  onFieldChange, onSubmit, onBack, onChangePlan,
}) => (
  <>
    <S.StepHeading>Enter Your Details</S.StepHeading>
    <S.StepSubheading>
      Fill in your information to calculate your personalised premium.
    </S.StepSubheading>

    <S.FormCard>
      <S.SelectedProductBanner>
        <S.SelectedProductName>{selected.name}</S.SelectedProductName>
        <S.ChangePlanLink onClick={onChangePlan}>Change plan</S.ChangePlanLink>
      </S.SelectedProductBanner>

      {apiError && <S.ErrorBanner>{apiError}</S.ErrorBanner>}

      <form onSubmit={onSubmit} noValidate>
        <S.FormGrid>
          <S.FormGroup>
            <S.FormLabel>Age <Req /></S.FormLabel>
            <S.FormInput
              type="number" name="age"
              value={form.age} onChange={onFieldChange}
              placeholder="e.g. 30" min={18} max={60}
              hasError={!!errors.age}
            />
            {errors.age
              ? <S.FieldError>{errors.age}</S.FieldError>
              : <S.FieldHint>Between 18 and 60</S.FieldHint>
            }
          </S.FormGroup>

          <S.FormGroup>
            <S.FormLabel>Sum Assured <Req /></S.FormLabel>
            <S.FormInput
              type="number" name="sum_assured"
              value={form.sum_assured} onChange={onFieldChange}
              placeholder="e.g. 5000000" min={1000000}
              hasError={!!errors.sum_assured}
            />
            {errors.sum_assured
              ? <S.FieldError>{errors.sum_assured}</S.FieldError>
              : <S.FieldHint>Minimum amount - 1,000,000.00</S.FieldHint>
            }
          </S.FormGroup>

          <S.FormGroup>
            <S.FormLabel>Policy Term (Years) <Req /></S.FormLabel>
            <S.FormInput
              type="number" name="term_years"
              value={form.term_years} onChange={onFieldChange}
              placeholder="e.g. 10" min={5} max={30}
              hasError={!!errors.term_years}
            />
            {errors.term_years
              ? <S.FieldError>{errors.term_years}</S.FieldError>
              : <S.FieldHint>Between 5 and 30 years</S.FieldHint>
            }
          </S.FormGroup>

          <S.FormGroup>
            <S.FormLabel>Payment Frequency</S.FormLabel>
            <S.FormSelect name="frequency" value={form.frequency} onChange={onFieldChange}>
              {FREQUENCY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </S.FormSelect>
            <S.FieldHint>How often you'd like to pay</S.FieldHint>
          </S.FormGroup>
        </S.FormGrid>

        <S.FormActions>
          <S.SecondaryButton type="button" onClick={onBack}>Back</S.SecondaryButton>
          <S.PrimaryButton type="submit" disabled={submitting}>
            {submitting ? <><S.LoadingSpinner /> Calculating…</> : 'Generate Quote →'}
          </S.PrimaryButton>
        </S.FormActions>
      </form>
    </S.FormCard>
  </>
);

export default DetailsStep;
