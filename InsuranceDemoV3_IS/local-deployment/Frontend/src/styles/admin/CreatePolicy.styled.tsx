import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: calc(80vh - 40px);
  width: 100%;
  background: linear-gradient(120deg, #f8fafc 60%, #e0e7ef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(60, 60, 100, 0.18), 0 2px 8px rgba(60, 60, 100, 0.10);
  border: 1.5px solid #e5e7eb;
  padding: 48px 48px 36px 48px;
  margin: 0 auto;
  width: 100%;
  max-width: 1300px;
  min-width: 320px;
  animation: fadeIn 0.3s ease;
  @media (max-width: 1100px) {
    max-width: 98vw;
    padding: 32px 12px 24px 12px;
  }
  @media (max-width: 600px) {
    padding: 16px 4vw 16px 4vw;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: black;
  margin: 0 0 20px 0;
  letter-spacing: 0.2px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px 36px;
  margin-bottom: 28px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 18px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color:rgb(81, 29, 204);
  margin-bottom: 4px;
`;

export const Input = styled.input`
  padding: 16px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8fafc;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.13);
    background: #fff;
  }
`;

export const Select = styled.select`
  padding: 16px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #f8fafc;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.13);
    background: #fff;
  }
`;

export const Textarea = styled.textarea`
  padding: 16px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8fafc;
  width: 100%;
  min-height: 80px;
  box-sizing: border-box;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.13);
    background: #fff;
  }
`;

export const FullWidthFormGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

export const Button = styled.button<{ primary?: boolean }>`
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  background-color: ${props => props.primary ? '#338bff' : '#e5e7eb'};
  color: ${props => props.primary ? 'white' : '#4b5563'};
  box-shadow: 0 1px 4px rgba(60, 60, 100, 0.10);
  transition: all 0.2s;
  &:hover {
    background-color: ${props => props.primary ? '#2563eb' : '#d1d5db'};
  }
  &:active {
    transform: scale(0.98);
  }
`;
