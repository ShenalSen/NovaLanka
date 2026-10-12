import styled from 'styled-components';

export const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const FormContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #eaeaea;
`;

export const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

export const FormContent = styled.div`
  padding: 24px;
`;

export const FormDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6C5CE7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #ffe5e5;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  border-left: 4px solid #dc2626;
`;

export const SuccessMessage = styled.div`
  background-color: #e6f7ed;
  color: #10b981;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  border-left: 4px solid #10b981;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
    border-color: #bbb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled(Button)`
  background-color: #6C5CE7;
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: #5A4BD1;
  }
`;
