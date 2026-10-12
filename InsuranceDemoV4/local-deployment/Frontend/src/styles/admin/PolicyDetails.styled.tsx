import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px 0 32px 0;
  background: linear-gradient(120deg, #f8fafc 60%, #e0e7ef 100%);
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
  width: 100%;
  max-width: 900px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid #e2e8f0;
  margin: 0 0 8px 0;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #3b3b4f;
  margin: 0;
  letter-spacing: 0.5px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 14px;
  justify-content: flex-end;
  width: 100%;
  margin-top: 8px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'save' | 'cancel' }>`
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border: none;
  background-color: ${props => {
    if (props.variant === 'danger') return '#ef4444';
    if (props.variant === 'secondary') return '#e2e8f0';
    if (props.variant === 'save') return '#338bff';
    if (props.variant === 'cancel') return '#ff9e9e';
    return '#3b82f6';
  }};
  color: ${props => {
    if (props.variant === 'cancel') return '#b91c1c';
    return props.variant === 'secondary' ? '#475569' : 'white';
  }};
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(39, 39, 101, 0.08);
  &:hover {
    background-color: ${props => {
      if (props.variant === 'danger') return '#dc2626';
      if (props.variant === 'secondary') return '#cbd5e1';
      if (props.variant === 'save') return '#1d6fe4';
      if (props.variant === 'cancel') return '#ffd6d6';
      return '#2563eb';
    }};
    box-shadow: 0 2px 8px rgba(60, 60, 100, 0.13);
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(60, 60, 100, 0.10), 0 1.5px 4px rgba(60, 60, 100, 0.07);
  padding: 36px 32px 32px 32px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 900px;
  animation: fadeIn 0.5s cubic-bezier(0.4,0,0.2,1);
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const FormSection = styled.div`
  margin-bottom: 32px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 18px 0;
  }
`;

export const FormLabel = styled.label`
  font-size: 15px;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 7px;
  letter-spacing: 0.2px;
`;

export const ReadOnlyInput = styled.input`
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  color: #22223b;
  font-weight: 500;
  margin-bottom: 0;
  outline: none;
  box-shadow: none;
`;

export const EditableInput = styled.input`
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  color: #22223b;
  font-weight: 500;
  margin-bottom: 0;
  outline: none;
  box-shadow: none;
  transition: all 0.2s;
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
`;

export const ReadOnlyDetailsBox = styled.div`
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  color: #22223b;
  font-weight: 500;
  min-height: 80px;
  margin-top: 8px;
`;

export const EditableTextArea = styled.textarea`
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  color: #22223b;
  font-weight: 500;
  min-height: 80px;
  resize: none;
  margin-top: 8px;
  outline: none;
  transition: all 0.2s;
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
`;
