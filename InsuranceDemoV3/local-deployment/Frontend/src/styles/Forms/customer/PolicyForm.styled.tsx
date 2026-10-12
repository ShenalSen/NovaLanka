import styled from 'styled-components';

export const FormContainer = styled.div`
  padding: 32px;
  background-color: #f5f7fb;
  min-height: calc(100vh - 64px);
`;

export const FormContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

export const FormCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const FormHeaderSection = styled.div`
  margin-bottom: 32px;
`;

export const FormTitle = styled.h1`
  font-size: 24px;
  color: black;
  font-weight: 600;
  margin: 0;
`;

export const SuccessCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

export const SuccessIcon = styled.div`
  font-size: 48px;
  color: #10b981;
  margin-bottom: 24px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
`;

export const SuccessTitle = styled.h2`
  font-size: 24px;
  color: #4a148c;
  margin-bottom: 16px;
`;

export const SuccessMessage = styled.p`
  font-size: 16px;
  color: #6c757d;
  margin-bottom: 32px;
  line-height: 1.6;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthFormGroup = styled.div`
  grid-column: 1 / -1;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: rgb(81, 29, 204);
  font-size: 14px;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background-color: #ffffff;
  transition: all 0.2s;
  font-size: 14px;
  color: #495057;
  
  &:focus {
    outline: none;
    border-color: #6C5CE7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background-color: #ffffff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  transition: all 0.2s;
  font-size: 14px;
  color: #495057;
  
  &:focus {
    outline: none;
    border-color: #6C5CE7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
`;

export const CancelButton = styled(Button)`
  background-color: #e9ecef;
  color: #495057;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

export const SubmitButton = styled(Button)`
  background-color: #6C5CE7;
  color: white;
  
  &:hover {
    background-color: #5A4BD1;
  }
`;
