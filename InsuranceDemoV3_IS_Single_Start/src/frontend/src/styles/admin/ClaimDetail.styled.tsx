import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px 0 0 0;
  min-height: 100vh;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 24px 0 rgba(99,102,241,0.08);
  padding: 40px 48px 32px 48px;
  margin: 0 auto;
  max-width: 1100px;
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #3730a3;
  letter-spacing: 0.5px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px 32px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 18px 0;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 15px;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 7px;
  letter-spacing: 0.2px;
`;

export const Value = styled.input.attrs<{readOnly: boolean}>(props => ({
  readOnly: props.readOnly,
}))<{readOnly: boolean}>`
  background: ${props => props.readOnly ? '#f8fafc' : '#fff'};
  border: ${props => props.readOnly ? 'none' : '1.5px solid #e5e7eb'};
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
    border-color: ${props => props.readOnly ? 'transparent' : '#6366f1'};
    box-shadow: ${props => props.readOnly ? 'none' : '0 0 0 3px rgba(99,102,241,0.1)'};
  }
`;

export const NoteArea = styled.textarea.attrs<{readOnly: boolean}>(props => ({
  readOnly: props.readOnly,
}))<{readOnly: boolean}>`
  background: ${props => props.readOnly ? '#f8fafc' : '#fff'};
  border: ${props => props.readOnly ? 'none' : '1.5px solid #e5e7eb'};
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
    border-color: ${props => props.readOnly ? 'transparent' : '#6366f1'};
    box-shadow: ${props => props.readOnly ? 'none' : '0 0 0 3px rgba(99,102,241,0.1)'};
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

export const EditButton = styled.button`
  background: #6366f1;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 32px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #4338ca;
  }
`;

export const CancelButton = styled.button`
  background: #e5e7eb;
  color: #22223b;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #d1d5db;
  }
`;

export const SaveButton = styled.button`
  background: #7c3aed;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 32px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #5b21b6;
  }
`;

export const StatusSelect = styled.select<{disabled: boolean}>`
  background: ${props => props.disabled ? '#f8fafc' : '#fff'};
  border: ${props => props.disabled ? 'none' : '1.5px solid #e5e7eb'};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  color: #22223b;
  font-weight: 500;
  outline: none;
  width: 100%;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  appearance: none;
  background-image: ${props => props.disabled ? 'none' : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M3 4.5L6 7.5L9 4.5H3z'/%3E%3C/svg%3E\")"};
  background-repeat: no-repeat;
  background-position: right 16px center;
  transition: border 0.2s;
  &:focus {
    border-color: ${props => props.disabled ? 'transparent' : '#6366f1'};
    box-shadow: ${props => props.disabled ? 'none' : '0 0 0 3px rgba(99,102,241,0.1)'};
  }
`;
