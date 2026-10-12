import { useState } from 'react';
import {
  type CardType,
  formatCardNumber as _formatCardNumber,
  isValidCardNumber,
  getCardConfig,
} from '../lib/utils/cardValidation';

/* ── Shared form types ── */
export interface PersonalForm {
  first_name: string;
  last_name: string;
  nic_number: string;
  email: string;
  mobile_number: string;
  address: string;
}

export interface CardForm {
  card_type: CardType;
  card_number: string;
  expiry: string;
  cvv: string;
  name_on_card: string;
}

export interface FormErrors {
  first_name?: string;
  last_name?: string;
  nic_number?: string;
  email?: string;
  mobile_number?: string;
  address?: string;
  card_type?: string;
  card_number?: string;
  expiry?: string;
  cvv?: string;
  name_on_card?: string;
}

/* ── Validation constants ── */
const emailRegex  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nicRegex    = /^(\d{9}[VvXx]|\d{12})$/;
const mobileRegex = /^[0-9+\s\-()]{7,15}$/;

/* ── Shared hook ── */
export function usePaymentDetailsForm() {
  const [personal, setPersonal] = useState<PersonalForm>({
    first_name: '', last_name: '', nic_number: '',
    email: '', mobile_number: '', address: '',
  });
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [cardForm, setCardForm] = useState<CardForm>({
    card_type: '', card_number: '', expiry: '', cvv: '', name_on_card: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonal(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors])
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCardTypeChange = (type: CardType) => {
    setCardForm(prev => ({ ...prev, card_type: type, card_number: '', cvv: '' }));
    setFormErrors(prev => ({ ...prev, card_type: undefined, card_number: undefined, cvv: undefined }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'card_number') formatted = _formatCardNumber(value, cardForm.card_type);
    if (name === 'expiry')      formatted = formatExpiry(value);
    if (name === 'cvv') {
      const cfg = getCardConfig(cardForm.card_type);
      formatted = value.replace(/\D/g, '').slice(0, cfg?.cvvLength ?? 3);
    }
    setCardForm(prev => ({ ...prev, [name]: formatted }));
    if (formErrors[name as keyof FormErrors])
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validatePersonalAndCard = (): boolean => {
    const errors: FormErrors = {};

    if (!personal.first_name.trim())    errors.first_name    = 'First name is required.';
    if (!personal.last_name.trim())     errors.last_name     = 'Last name is required.';
    if (!personal.nic_number.trim())    errors.nic_number    = 'NIC number is required.';
    else if (!nicRegex.test(personal.nic_number.trim()))
      errors.nic_number = 'Enter a valid NIC (e.g. 911234567V or 199112345678).';
    if (!personal.email.trim())         errors.email         = 'Email is required.';
    else if (!emailRegex.test(personal.email.trim()))
      errors.email = 'Enter a valid email address.';
    if (!personal.mobile_number.trim()) errors.mobile_number = 'Mobile number is required.';
    else if (!mobileRegex.test(personal.mobile_number.trim()))
      errors.mobile_number = 'Enter a valid mobile number.';
    if (!personal.address.trim())       errors.address       = 'Address is required.';
    else if (isAddressValid === false)  errors.address       = 'Please enter a valid address.';

    if (!cardForm.card_type)
      errors.card_type = 'Please select a card type.';
    const rawCard = cardForm.card_number.replace(/\s/g, '');
    if (!rawCard)
      errors.card_number = 'Card number is required.';
    else if (!isValidCardNumber(rawCard, cardForm.card_type))
      errors.card_number = 'Enter a valid card number for the selected card type.';
    if (!cardForm.expiry.match(/^\d{2}\/\d{2}$/)) errors.expiry = 'Enter expiry as MM/YY.';
    const cvvLen = getCardConfig(cardForm.card_type)?.cvvLength ?? 3;
    if (cardForm.cvv.length < cvvLen)              errors.cvv   = `Enter a valid ${cvvLen}-digit CVV.`;
    if (!cardForm.name_on_card.trim())             errors.name_on_card = 'Name on card is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    personal, setPersonal,
    isAddressValid, setIsAddressValid,
    cardForm, setCardForm,
    formErrors, setFormErrors,
    handlePersonalChange,
    handleCardTypeChange,
    handleCardChange,
    validatePersonalAndCard,
  };
}
