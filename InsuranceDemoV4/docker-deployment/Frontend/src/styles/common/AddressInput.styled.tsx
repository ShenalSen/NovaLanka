import styled from 'styled-components';

export const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(81, 29, 204);
`;

export const StyledInput = styled.input<{ isValid?: boolean | null }>`
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

  ${props => props.isValid === true && `
    border: 1px solid #4caf50;
    background-color: rgba(76, 175, 80, 0.05);
  `}

  ${props => props.isValid === false && `
    border: 1px solid #f44336;
    background-color: rgba(244, 67, 54, 0.05);
  `}
`;

export const ValidationMessage = styled.div<{ isValid: boolean }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${props => props.isValid ? '#4caf50' : '#f44336'};
  display: flex;
  align-items: center;
`;

export const ValidationIcon = styled.span`
  margin-right: 4px;
`;

export const LoadingIndicator = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: #6c757d;
`;
