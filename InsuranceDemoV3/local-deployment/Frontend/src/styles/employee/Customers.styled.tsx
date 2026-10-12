import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px 0 0 0;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 24px 0 rgba(99,102,241,0.08);
  padding: 18px 18px 18px 18px;
  margin: 0 auto;
  max-width: 98%;
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  padding: 9px 38px 9px 38px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
  background: #f8fafc;
  &:focus {
    border-color: #6366f1;
    background: #fff;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a3a3a3;
  pointer-events: none;
  display: flex;
  align-items: center;
  font-size: 18px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
`;

export const Th = styled.th`
  text-align: left;
  color:#6366f1;
  background-color:rgb(230, 231, 235);
  font-size: 15px;
  font-weight: 700;
  padding: 14px 8px 14px 8px;
  border-bottom: 2px solid #e5e7eb;
  letter-spacing: 0.2px;
`;

export const Tr = styled.tr`
  transition: background 0.18s;
  &:hover {
    background: #f3f4f6;
  }
`;

export const Td = styled.td`
  padding: 18px 8px;
  font-size: 15px;
  color:rgb(22, 22, 26);
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
`;

export const StatusBadge = styled.span.withConfig({ shouldForwardProp: (prop) => prop !== 'status' })<{ status: 'active' | 'inactive' }>`
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${props => props.status === 'active' ? '#ccf1e5' : '#ffccd1'};
  color: ${props => props.status === 'active' ? '#10b981' : '#ef4444'};
  display: inline-block;
  min-width: 80px;
  text-align: center;
`;
