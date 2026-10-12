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
  color: #1e293b;
  margin: 0 0 32px 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
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

export const Select = styled.select`
  padding: 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border: none;
  background-color: ${props => {
    if (props.disabled) return '#a1a1aa';
    return props.$variant === 'secondary' ? '#e5e7eb' : '#6366f1';
  }};
  color: ${props => props.$variant === 'secondary' ? '#4b5563' : 'white'};
  opacity: ${props => props.disabled ? '0.7' : '1'};
  
  &:hover {
    background-color: ${props => {
      if (props.disabled) return '#a1a1aa';
      return props.$variant === 'secondary' ? '#d1d5db' : '#4f46e5';
    }};
  }
`;
