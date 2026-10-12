import styled from "styled-components";

export const FloatingButtonContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
`;

export const CircularButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #45ffae;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(69, 255, 174, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(69, 255, 174, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
`;

export const ModalDescription = styled.p`
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

export const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 2px solid ${(props) => (props.error ? "#ff6b6b" : "#e0e0e0")};
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? "#ff6b6b" : "#45ffae")};
  }

  &:placeholder {
    color: #999;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 12px;
  margin: 5px 0 0 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export const SuccessMessage = styled.div`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "✓";
    font-weight: bold;
    font-size: 16px;
  }
`;

export const Button = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.primary
      ? `
    background-color: #45ffae;
    color: #333;

    &:hover {
      background-color: #2fe0a0;
    }

    &:active {
      transform: scale(0.98);
    }
  `
      : `
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #e0e0e0;

    &:hover {
      background-color: #e8e8e8;
    }
  `}
`;
