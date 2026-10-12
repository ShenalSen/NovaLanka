import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: ${props => props.$variant === 'danger' ? '#ef4444' : '#3b82f6'};
  color: white;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$variant === 'danger' ? '#dc2626' : '#2563eb'};
  }
`;

export const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
   color:#6366f1;
  background-color:rgb(230, 231, 235);
  font-weight: 600;
  font-size: 14px;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
`;

export const TableCell = styled.td`
  padding: 16px;
  color:rgb(19, 22, 26);
  font-size: 15px;
`;

export const SingleLineTableCell = styled(TableCell)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => props.status === 'Active' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.status === 'Active' ? '#16a34a' : '#ef4444'};
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
`;
