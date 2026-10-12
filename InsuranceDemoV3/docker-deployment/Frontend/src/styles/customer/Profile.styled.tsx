import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  background-color: #f5f7fb;
  min-height: calc(100vh - 64px); /* Full height minus header */
`;

export const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

export const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

export const ProfileHeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 500;
  color: #333;
`;

export const UserEmail = styled.p`
  margin: 4px 0 0;
  color: #6c757d;
  font-size: 14px;
`;

export const Button = styled.button`
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  padding: 10px 26px;
`;

export const EditButton = styled(Button)`
  background: #6C5CE7;
  color: white;
  box-shadow: 0 2px 6px rgba(108, 92, 231, 0.2);
  
  &:hover {
    background: #5A4BD1;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(108, 92, 231, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const CancelButton = styled(Button)`
  background: #e9ecef;
  color: #495057;
  margin-right: 12px;
  
  &:hover {
    background: #dee2e6;
  }
`;

export const SaveButton = styled(Button)`
  background: #6C5CE7;
  color: white;
  
  &:hover {
    background: #5A4BD1;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color:rgb(81, 29, 204);
  font-size: 15px;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background-color: #f8f9fa;
  transition: all 0.2s;
  font-size: 14px;
  color: #495057;
  
  &:focus {
    outline: none;
    border-color: #6C5CE7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
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
  background-color: #f8f9fa;
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
  
  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }
`;
