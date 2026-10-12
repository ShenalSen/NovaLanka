import styled, { keyframes } from 'styled-components';

const ORANGE = '#f97316';
const ORANGE_DARK = '#ea580c';

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${ORANGE};
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
  z-index: 1000;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: ${ORANGE_DARK};
    transform: translateY(-2px);
  }
  &:focus-visible {
    outline: 3px solid #fdba74;
    outline-offset: 2px;
  }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const ChatPanel = styled.div`
  position: fixed;
  bottom: 96px;
  right: 24px;
  width: 380px;
  max-width: calc(100vw - 32px);
  height: 520px;
  max-height: calc(100vh - 120px);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  animation: ${slideIn} 0.18s ease-out;
`;

export const PanelHeader = styled.div`
  background: ${ORANGE};
  color: #ffffff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1;

  &:hover { background: rgba(255, 255, 255, 0.15); }
`;

export const CloseButton = styled(IconButton)`
  font-size: 22px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MessagesScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const EmptyState = styled.div`
  margin: auto;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  padding: 0 16px;
`;

export const Bubble = styled.div<{ role: 'user' | 'assistant' }>`
  max-width: 80%;
  padding: 9px 12px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-wrap: break-word;
  align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
  background: ${({ role }) => (role === 'user' ? ORANGE : '#ffffff')};
  color: ${({ role }) => (role === 'user' ? '#ffffff' : '#1f2937')};
  border: ${({ role }) => (role === 'user' ? 'none' : '1px solid #e5e7eb')};
  box-shadow: ${({ role }) =>
    role === 'user' ? 'none' : '0 1px 2px rgba(0,0,0,0.04)'};
`;

const dotBlink = keyframes`
  0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-2px); }
`;

export const TypingDots = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 2px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #9ca3af;
    display: inline-block;
    animation: ${dotBlink} 1.2s infinite ease-in-out;
  }
  span:nth-child(2) { animation-delay: 0.15s; }
  span:nth-child(3) { animation-delay: 0.3s; }
`;

export const ErrorBanner = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  border-top: 1px solid #fecaca;
  padding: 8px 12px;
  font-size: 12px;
`;

export const InputRow = styled.form`
  display: flex;
  gap: 8px;
  padding: 10px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
`;

export const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.4;
  max-height: 120px;
  outline: none;

  &:focus {
    border-color: ${ORANGE};
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.18);
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
  }
`;

export const SendButton = styled.button`
  background: ${ORANGE};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) { background: ${ORANGE_DARK}; }

  &:disabled {
    background: #fcd9b6;
    cursor: not-allowed;
  }
`;
