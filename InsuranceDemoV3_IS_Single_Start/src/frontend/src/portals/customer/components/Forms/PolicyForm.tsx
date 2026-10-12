import React, { useState } from 'react';
import AddressInput from '../../../../components/common/AddressInput';
import * as S from '../../../../styles/Forms/customer/PolicyForm.styled';

export interface PolicyFormData {
  firstName: string;
  lastName: string;
  duration: string;
  email: string;
  mobileNumber: string;
  policyType: string;
  address: string;
}

interface PolicyFormProps {
  onCancel: () => void;
  onSubmit: (formData: PolicyFormData) => void;
}

const PolicyForm: React.FC<PolicyFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState<PolicyFormData>({
    firstName: '',
    lastName: '',
    duration: '',
    email: '',
    mobileNumber: '',
    policyType: '',
    address: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitted'>('idle');
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.address.trim() !== "" && (isAddressValid === false || isAddressValid === null)) {
      return;
    }
    
    onSubmit(formData);
    setSubmissionStatus('submitted');
  };

  if (submissionStatus === 'submitted') {
    return (
      <S.FormContainer>
        <S.FormContent>
          <S.SuccessCard>
            <S.SuccessIcon>✓</S.SuccessIcon>
            <S.SuccessTitle>Application Submitted Successfully</S.SuccessTitle>
            <S.SuccessMessage>
              Thank you for your application. Your policy request has been received and is awaiting approval. 
              Our team will review your application and notify you once it has been processed.
            </S.SuccessMessage>
            <S.ButtonGroup>
              <S.SubmitButton type="button" onClick={onCancel}>
                Return to Policies
              </S.SubmitButton>
            </S.ButtonGroup>
          </S.SuccessCard>
        </S.FormContent>
      </S.FormContainer>
    );
  }

  return (
    <S.FormContainer>
      <S.FormContent>
        <S.FormCard>
          <S.FormHeaderSection>
            <S.FormTitle>Apply for a new Policy</S.FormTitle>
          </S.FormHeaderSection>
          
          <form onSubmit={handleSubmit}>
            <S.FormGrid>
              <S.FormGroup>
                <S.Label htmlFor="firstName">First Name</S.Label>
                <S.Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Alexa"
                  required
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label htmlFor="lastName">Last Name</S.Label>
                <S.Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Rawles"
                  required
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label htmlFor="email">Email</S.Label>
                <S.Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rimel1111@gmail.com"
                  required
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label htmlFor="mobileNumber">Mobile number</S.Label>
                <S.Input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+44 2343 2838"
                  required
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label htmlFor="duration">Duration</S.Label>
                <S.Input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="1 year"
                  required
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label htmlFor="policyType">Type of Insurance Policy</S.Label>
                <S.Select
                  id="policyType"
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select policy type</option>
                  <option value="Health Insurance">Health Insurance</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Auto Insurance">Auto Insurance</option>
                  <option value="Home Insurance">Home Insurance</option>
                  <option value="Travel Insurance">Travel Insurance</option>
                </S.Select>
              </S.FormGroup>
              
              <S.FullWidthFormGroup>
                <AddressInput
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
                  label="Address"
                  required={true}
                  onValidationComplete={(isValid) => {
                    setIsAddressValid(isValid);
                  }}
                />
              </S.FullWidthFormGroup>
            </S.FormGrid>
            
            <S.ButtonGroup>
              <S.CancelButton type="button" onClick={onCancel}>
                Cancel
              </S.CancelButton>
              <S.SubmitButton 
                type="submit"
                disabled={formData.address.trim() !== "" && (isAddressValid === false || isAddressValid === null)}
              >
                Submit
              </S.SubmitButton>
            </S.ButtonGroup>
          </form>
        </S.FormCard>
      </S.FormContent>
    </S.FormContainer>
  );
};

export default PolicyForm;