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
  table-layout: fixed;
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
  width: 14.28%;
`;

export const Tr = styled.tr`
  transition: background 0.18s;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;

export const Td = styled.td`
  padding: 18px 8px;
  font-size: 15px;
  color:rgb(17, 17, 19);
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  width: 14.28%;
  word-break: break-word;
`;

export const statusColors: Record<string, { bg: string; color: string }> = {
  'Payment processing': { bg: '#fef9c3', color: '#b45309' },
  'Submitted': { bg: '#dbeafe', color: '#2563eb' },
  'Closed': { bg: '#fee2e2', color: '#dc2626' },
  'Under review': { bg: '#ede9fe', color: '#7c3aed' },
  'Decision made': { bg: '#ccf1e5', color: '#10b981' },
};

export const StatusBadge = styled.span<{ status: string }>`
  padding: 8px 0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${({ status }) => statusColors[status]?.bg || '#f3f4f6'};
  color: ${({ status }) => statusColors[status]?.color || '#22223b'};
  display: inline-block;
  width: 160px;
  text-align: center;
  border: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
