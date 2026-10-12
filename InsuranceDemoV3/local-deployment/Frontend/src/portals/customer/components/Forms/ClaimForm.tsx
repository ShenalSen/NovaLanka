import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '../../../../styles/Forms/customer/ClaimForm.styled';

const ClaimForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Alexa',
    lastName: 'Rawles',
    policyId: 'POL_HI_001',
    email: 'rimel1111@gmail.com',
    mobileNumber: '+44 2343 2838',
    address: 'No. 4ax, saupaulo, trister colony, california - 234',
    policyType: 'Health Insurance',
    incidentDate: '04/06/2025',
    incidentDetails: '',
    lossDamageDetails: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaimId = `ID_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const newClaim = {
      id: newClaimId,
      productId: formData.policyId.replace('POL_', 'P_'),
      startDate: formData.incidentDate,
      endDate: formData.incidentDate,
      details: formData.incidentDetails || 'New insurance claim',
      status: 'Active' as const
    };
    const existingClaimsJSON = localStorage.getItem('insuranceClaims');
    const existingClaims = existingClaimsJSON ? JSON.parse(existingClaimsJSON) : [];
    const updatedClaims = [newClaim, ...existingClaims];
    localStorage.setItem('insuranceClaims', JSON.stringify(updatedClaims));
    setIsSubmitted(true);
  };

  const handleCancel = () => {
    navigate('/customer/claims');
  };

  const handleReturn = () => {
    navigate('/customer/claims');
  };

  if (isSubmitted) {
    return (
      <S.PageContainer>
        <S.ContentContainer>
          <S.SuccessContainer>
            <S.SuccessIcon>✓</S.SuccessIcon>
            <S.SuccessHeading>Claim Submitted Successfully</S.SuccessHeading>
            <S.SuccessMessage>
              Thank you for your application. Your Claim request has been received and is awaiting approval. 
              Our team will review your claim and notify you once it has been processed.
            </S.SuccessMessage>
            <S.ReturnButton onClick={handleReturn}>
              Return to Claims
            </S.ReturnButton>
          </S.SuccessContainer>
        </S.ContentContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.ContentContainer>
        <S.PageHeader>Apply for Claim</S.PageHeader>
        
        <form onSubmit={handleSubmit}>
          <S.FormContainer>
            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>First Name</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.FormLabel>Last Name</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.FormLabel>Policy ID</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="policyId"
                  value={formData.policyId}
                  onChange={handleChange}
                />
              </S.FormGroup>
            </S.FormRow>
            
            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>Email</S.FormLabel>
                <S.FormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.FormLabel>Mobile number</S.FormLabel>
                <S.FormInput
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.FormLabel>Type of Insurance Policy</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                />
              </S.FormGroup>
            </S.FormRow>
            
            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>Address</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </S.FormGroup>
            </S.FormRow>

            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>Incident Date</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                />
              </S.FormGroup>
            </S.FormRow>
            
            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>Incident Details</S.FormLabel>
                <S.FormTextArea
                  name="incidentDetails"
                  value={formData.incidentDetails}
                  onChange={handleChange}
                  placeholder="Describe what happened..."
                />
              </S.FormGroup>
            </S.FormRow>
            
            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>Loss/Damage Details</S.FormLabel>
                <S.FormTextArea
                  name="lossDamageDetails"
                  value={formData.lossDamageDetails}
                  onChange={handleChange}
                  placeholder="Describe any losses or damages..."
                />
              </S.FormGroup>
            </S.FormRow>
            
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
};

export default ClaimForm;