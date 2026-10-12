import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  background-color: #f5f7fb;
  min-height: calc(100vh - 64px);
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const HeaderTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PageHeading = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

export const PageDescription = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.5;
`;

export const ClaimsCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 13px 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const ClaimsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const TableHeader = styled.th`
  text-align: center;
  padding: 16px 12px;
  color:#6366f1;
  background-color:rgb(230, 231, 235);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e9ecef;
  white-space: nowrap;
`;

export const TableHeaderRow = styled.tr`
  background-color: #f9fafb;
`;

export const TableRow = styled.tr<{ clickable?: boolean }>`
  &:hover {
    background-color: #f8f9fa;
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
  }
`;

export const TableCell = styled.td`
  padding: 16px 12px;
  font-size: 15px;
  color:rgb(0, 0, 0);
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StatusCell = styled(TableCell)`
  padding-right: 12px;
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
  background-color: ${({ status }) => {
    switch (status) {
      case 'Approved':
        return '#e6f9ed';
      case 'Declined':
        return '#ffeaea';
      case 'Under Review':
        return '#fff6e0';
      case 'Active':
        return '#e6f4ff';
      case 'Inactive':
        return '#f0f0f0';
      default:
        return '#e6f4ff';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'Approved':
        return '#1db16a';
      case 'Declined':
        return '#e53935';
      case 'Under Review':
        return '#e6a100';
      case 'Active':
        return '#1976d2';
      case 'Inactive':
        return '#888';
      default:
        return '#555';
    }
  }};
`;

export const NewClaimButton = styled.button`
  background-color: #6C5CE7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(108, 92, 231, 0.2);
  
  &:hover {
    background-color: #5845e0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;
