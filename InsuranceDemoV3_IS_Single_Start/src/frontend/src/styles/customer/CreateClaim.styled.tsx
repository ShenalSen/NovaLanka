import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  background-color: #f5f7fb;
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const ContentContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 36px 48px;
`;

export const Heading = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: black;
  margin-bottom: 32px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const FormField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 15px;
  color:rgb(81, 29, 204);
  margin-bottom: 8px;
  font-weight: 600;
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #dde1e6;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  
  &:focus {
    outline: none;
    border-color: #6C5CE7;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #dde1e6;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #6C5CE7;
  }
`;

export const SubmitButton = styled.button`
  background: #6C5CE7;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    background: #5845e0;
  }
  
  &:disabled {
    background: #a8a4dd;
    cursor: not-allowed;
  }
`;

export const ErrorMsg = styled.div`
  color: #e53935;
  background-color: #ffebee;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
`;

export const DatePicker = styled(Input)`
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
  }
`;
