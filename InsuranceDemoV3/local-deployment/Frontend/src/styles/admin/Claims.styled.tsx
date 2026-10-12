import styled from 'styled-components';

export const statusColors: Record<string, { bg: string; color: string }> = {
  Active:    { bg: '#dcfce7', color: '#16a34a' },      // green
  Inactive:  { bg: '#f3f4f6', color: '#6b7280' },      // gray
  Pending:   { bg: '#fef9c3', color: '#b45309' },      // yellow
  Approved:  { bg: '#dbeafe', color: '#2563eb' },      // blue
  Rejected:  { bg: '#fee2e2', color: '#ef4444' },      // red
  Cancelled: { bg: '#f3f4f6', color: '#ef4444' },      // light gray/red
  Closed:    { bg: '#e0e7ff', color: '#6366f1' },      // indigo
  Processing:{ bg: '#f0fdf4', color: '#059669' },      // teal
  Submitted: { bg: '#f0fdf4', color: '#059669' },       // purple/blue
  UnderReview: { bg: '#fef9c3', color: '#b45309' }, // yellow
  Declined:  { bg: '#fee2e2', color: '#ef4444' },      // red
};

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
  color: #6366f1;
  background-color: rgb(230, 231, 235);
  font-weight: 600;
  font-size: 14px;
  width: 14.28%;
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
  color: rgb(27, 29, 33);
  font-size: 15px;
  word-break: break-word;
  width: 14.28%;
`;

export const StatusBadge = styled.div<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  min-width: 80px;
  background-color: ${({ $status }) => statusColors[$status]?.bg || '#f3f4f6'};
  color: ${({ $status }) => statusColors[$status]?.color || '#64748b'};
  box-shadow: 0 1px 2px rgba(60,60,100,0.06);
  letter-spacing: 0.02em;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
`;
