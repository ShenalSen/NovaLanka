import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

export const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color:rgb(21, 35, 57);
  margin: 0 0 32px 0;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color:rgb(81, 29, 204);
  margin-bottom: 8px;
`;

export const Input = styled.input`
  padding: 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: ${props => props.variant === 'secondary' ? '#e5e7eb' : '#6366f1'};
  color: ${props => props.variant === 'secondary' ? '#4b5563' : 'white'};
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#d1d5db' : '#4f46e5'};
  }
`;
