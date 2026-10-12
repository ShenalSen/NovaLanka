import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  background-color: #f5f7fb;
  min-height: calc(100vh - 64px);
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const PageHeader = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: rgba(42, 14, 77, 0.7);
  margin-bottom: 32px;
`;

export const FormContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FormGroup = styled.div`
  flex: 1;
  margin-bottom: 8px;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: black;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  background-color: #f5f5f5;
  font-size: 14px;
  color: #333;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }
`;

export const FormTextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  background-color: #f5f5f5;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  color: #333;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
`;

export const CancelButton = styled.button`
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: #e2e2e2;
  color: #333;
  transition: all 0.2s;
  
  &:hover {
    background-color: #d5d5d5;
  }
`;

export const SubmitButton = styled.button`
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: #6C5CE7;
  color: white;
  transition: all 0.2s;
  
  &:hover {
    background-color: #5845e0;
  }
`;

export const SuccessContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 48px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 800px;
  margin: 80px auto;
`;

export const SuccessIcon = styled.div`
  font-size: 48px;
  color: #10b981;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
`;

export const SuccessHeading = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #4B0082;
  margin-bottom: 16px;
`;

export const SuccessMessage = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const ReturnButton = styled.button`
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: #6C5CE7;
  color: white;
  transition: all 0.2s;
  float: right;
  
  &:hover {
    background-color: #5845e0;
  }
`;
