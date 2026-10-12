import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressInput from '../common/AddressInput';
import { saveClaim } from '../../types/claim';
import type { ClaimFormData } from '../../types/claim';
import { initialFormData } from '../../types/claim';
import * as S from '../../styles/Forms/ClaimForm.styled';

interface FormField {
  label: string;
  name: keyof ClaimFormData;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'address';
  placeholder?: string;
  required?: boolean;
}

const formFields: FormField[][] = [
  [
    { label: 'First Name', name: 'firstName', type: 'text', required: true },
    { label: 'Last Name', name: 'lastName', type: 'text', required: true },
    { label: 'Policy ID', name: 'policyId', type: 'text', required: true }
  ],
  [
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Mobile number', name: 'mobileNumber', type: 'tel', required: true },
    { label: 'Type of Insurance Policy', name: 'policyType', type: 'text', required: true }
  ],
  [
    { label: 'Address', name: 'address', type: 'address', required: true }
  ],
  [
    { label: 'Incident Date', name: 'incidentDate', type: 'text', required: true }
  ],
  [
    { label: 'Incident Details', name: 'incidentDetails', type: 'textarea', placeholder: 'Describe what happened...', required: true }
  ],
  [
    { label: 'Loss/Damage Details', name: 'lossDamageDetails', type: 'textarea', placeholder: 'Describe any losses or damages...', required: true }
  ]
];

const SuccessView = memo(({ onReturn }: { onReturn: () => void }) => (
  <S.PageContainer>
    <S.ContentContainer>
      <S.SuccessContainer>
        <S.SuccessIcon>✓</S.SuccessIcon>
        <S.SuccessHeading>Claim Submitted Successfully</S.SuccessHeading>
        <S.SuccessMessage>
          Thank you for your application. Your Claim request has been received and is awaiting approval. 
          Our team will review your claim and notify you once it has been processed.
        </S.SuccessMessage>
        <S.ReturnButton onClick={onReturn}>
          Return to Claims
        </S.ReturnButton>
      </S.SuccessContainer>
    </S.ContentContainer>
  </S.PageContainer>
));

SuccessView.displayName = 'ClaimFormSuccessView';

const ClaimForm = memo(() => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<ClaimFormData>(initialFormData);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.address.trim() !== "" && isAddressValid === false) {
      alert('Please enter a valid address before submitting');
      return;
    }
    
    saveClaim({
      productId: formData.policyId.replace('POL_', 'P_'),
      startDate: formData.incidentDate,
      endDate: formData.incidentDate,
      details: formData.incidentDetails || 'New insurance claim',
      status: 'Active'
    });

    setIsSubmitted(true);
  }, [formData, isAddressValid]);

  const handleCancel = useCallback(() => {
    navigate('/claims');
  }, [navigate]);

  const handleReturn = useCallback(() => {
    navigate('/claims');
  }, [navigate]);

  if (isSubmitted) {
    return <SuccessView onReturn={handleReturn} />;
  }

  const renderFormField = useCallback((field: FormField) => {
    if (field.type === 'address') {
      return (
        <S.FormGroup key={field.name}>
          <AddressInput
            name={field.name}
            id={field.name}
            value={formData[field.name]}
            onChange={(value) => setFormData(prev => ({ ...prev, [field.name]: value }))}
            label={field.label}
            required={field.required}
            onValidationComplete={(isValid) => setIsAddressValid(isValid)}
          />
        </S.FormGroup>
      );
    }

    const Component = (field.type === 'textarea' ? S.FormTextArea : S.FormInput) as React.ElementType;
    return (
      <S.FormGroup key={field.name}>
        <S.FormLabel htmlFor={field.name}>
          {field.label}
          {field.required && <span style={{ color: '#f44336' }}> *</span>}
        </S.FormLabel>
        <Component
          id={field.name}
          name={field.name}
          type={field.type !== 'textarea' ? field.type : undefined}
          value={formData[field.name]}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
        />
      </S.FormGroup>
    );
  }, [formData, handleChange]);

  return (
    <S.PageContainer>
      <S.ContentContainer>
        <S.PageHeader>Apply for Claim</S.PageHeader>
        
        <form onSubmit={handleSubmit} noValidate>
          <S.FormContainer>
            {formFields.map((row, index) => (
              <S.FormRow key={index}>
                {row.map(field => renderFormField(field))}
              </S.FormRow>
            ))}
            
            <S.ButtonContainer>
              <S.CancelButton type="button" onClick={handleCancel}>
                Cancel
              </S.CancelButton>
              <S.SubmitButton type="submit">
                Submit
              </S.SubmitButton>
            </S.ButtonContainer>
          </S.FormContainer>
        </form>
      </S.ContentContainer>
    </S.PageContainer>
  );
});

ClaimForm.displayName = 'ClaimForm';

export default ClaimForm;