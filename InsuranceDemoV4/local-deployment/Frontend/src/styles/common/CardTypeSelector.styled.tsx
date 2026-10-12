import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 4px;

  @media (max-width: 520px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Chip = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 6px;
  border: 2px solid ${p => p.selected ? '#6C5CE7' : '#e2e8f0'};
  border-radius: 10px;
  background: ${p => p.selected ? '#f5f3ff' : '#ffffff'};
  cursor: pointer;
  transition: all 0.18s;
  font-family: 'Poppins', Arial, sans-serif;

  &:hover {
    border-color: #6C5CE7;
    background: #f5f3ff;
  }
`;

export const CardLogo = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`;

export const CardLabel = styled.span<{ selected: boolean }>`
  font-size: 0.65rem;
  font-weight: ${p => p.selected ? '700' : '500'};
  color: ${p => p.selected ? '#6C5CE7' : '#6b7280'};
  white-space: nowrap;
`;

export const ErrorText = styled.span`
  font-size: 0.78rem;
  color: #ef4444;
`;
