import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useAddressValidation } from '../../hooks/useAddressValidation';
import {
  InputWrapper,
  Label,
  StyledInput,
  ValidationMessage,
  ValidationIcon,
  LoadingIndicator
} from '../../styles/common/AddressInput.styled';
import debounce from 'lodash/debounce';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationComplete?: (isValid: boolean, displayName?: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  debounceMs?: number;
}


const AddressInput: React.FC<AddressInputProps> = memo(({
  value,
  onChange,
  onValidationComplete,
  label = 'Address',
  placeholder = '',
  required = false,
  className,
  disabled = false,
  name = 'address',
  id = 'address',
  debounceMs = 500
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [touched, setTouched] = useState(false);
  const { isValidating, validationResult, validateAddress } = useAddressValidation();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedValidateAddress = useMemo(() => 
    debounce(async (address: string) => {
      if (!address.trim()) return;
      
      const result = await validateAddress(address);
      
      if (onValidationComplete) {
        onValidationComplete(result.valid, result.display_name);
      }
    }, debounceMs),
    [validateAddress, onValidationComplete, debounceMs]
  );

  useEffect(() => {
    return () => {
      debouncedValidateAddress.cancel();
    };
  }, [debouncedValidateAddress]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
    
    if (touched) {
      debouncedValidateAddress(newValue);
    }
  }, [onChange, touched, debouncedValidateAddress]);

  const handleBlur = useCallback(async () => {
    if (!touched) {
      setTouched(true);
    }
    
    debouncedValidateAddress.cancel();
    
    if (localValue.trim()) {
      const result = await validateAddress(localValue);
      
      if (onValidationComplete) {
        onValidationComplete(result.valid, result.display_name);
      }
    }
  }, [localValue, validateAddress, onValidationComplete, touched, debouncedValidateAddress]);

  const showValidationUI = touched && localValue.trim() !== '' && validationResult !== null;

  return (
    <InputWrapper className={className}>
      {label && (
        <Label htmlFor={id}>
          {label}{required && <span style={{ color: '#f44336' }}> *</span>}
        </Label>
      )}
      
      <StyledInput
        id={id}
        name={name}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled || isValidating}
        isValid={showValidationUI ? validationResult?.valid : null}
        required={required}
        aria-invalid={showValidationUI ? !validationResult?.valid : undefined}
        aria-describedby={`${id}-validation`}
      />
      
      {isValidating && (
        <LoadingIndicator id={`${id}-validation`}>Validating address...</LoadingIndicator>
      )}
      
      {showValidationUI && !isValidating && (
        <ValidationMessage 
          isValid={validationResult?.valid || false}
          id={`${id}-validation`}
        >
          <ValidationIcon>
            {validationResult?.valid ? '✓' : '✗'}
          </ValidationIcon>
          {validationResult?.valid 
            ? 'Address is valid' 
            : 'Invalid address. Please check your input.'}
        </ValidationMessage>
      )}
    </InputWrapper>
  );
});

AddressInput.displayName = 'AddressInput';

export default AddressInput;
