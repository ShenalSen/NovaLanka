import styled from 'styled-components';

export const SyncMessageContainer = styled.div<{ isError: boolean }>`
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
  background-color: ${props => props.isError ? '#ffe5e5' : '#e6f7ed'};
  color: ${props => props.isError ? '#dc2626' : '#10b981'};
  border: 1px solid ${props => props.isError ? '#fca5a5' : '#6ee7b7'};
`;
