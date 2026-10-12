import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

export const PageHeader = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  align-items: start;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
`;

export const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

export const FormTextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

export const SubmitButton = styled(Button)`
  background-color: #0066cc;
  color: white;
  border: none;

  &:hover {
    background-color: #0052a3;
  }
`;

export const CancelButton = styled(Button)`
  background-color: white;
  color: #666;
  border: 1px solid #ddd;

  &:hover {
    background-color: #f5f5f5;
  }
`;

// Success styles
export const SuccessContainer = styled.div`
  text-align: center;
  padding: 3rem;
`;

export const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 2rem;
`;

export const SuccessHeading = styled.h2`
  color: #4caf50;
  font-size: 1.75rem;
  margin-bottom: 1rem;
`;

export const SuccessMessage = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

export const ReturnButton = styled(Button)`
  background-color: #4caf50;
  color: white;
  border: none;

  &:hover {
    background-color: #3d8b40;
  }
`;
