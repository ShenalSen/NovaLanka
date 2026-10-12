import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  background-color: #f5f7fb;
  min-height: calc(100vh - 64px); /* Full height minus header */
  display: flex;
  flex-direction: column;
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
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
  margin-bottom: 32px;
  line-height: 1.5;
`;

export const PoliciesTable = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 24px;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 16px 24px;
  border-bottom: 1px solid #eaeaea;
  background-color:rgb(230, 231, 235);
`;

export const HeaderCell = styled.div`
  font-size: 15px;
  font-weight: 600;
  color:#6366f1;
  display: flex;
  align-items: center;
  justify-content: center; /* Center align header text */
  text-align: center;
`;

export const TableCell = styled.div`
  font-size: 15px;
  color:rgb(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center; /* Center align cell content */
  text-align: center;
`;

export const DetailsCell = styled(TableCell)`
  justify-content: flex-start; /* Left align content */
  text-align: left;
`;

export const DetailsHeaderCell = styled(HeaderCell)`
  justify-content: flex-start; /* Left align header */
  text-align: left;
`;

export const TableBody = styled.div``;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 16px 24px;
  border-bottom: 1px solid #eaeaea;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${props => {
    switch (props.status) {
      case 'Active': return '#ccf1e5';
      case 'Expired': return '#ffeeba';
      case 'Cancelled': return '#ffccd1';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Active': return '#10b981';
      case 'Expired': return '#ff9800';
      case 'Cancelled': return '#ef4444';
      default: return '#6c757d';
    }
  }};
  display: inline-block;
  min-width: 80px;
  text-align: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0;
  margin-bottom: 24px; /* Space below the button */
`;

export const ApplyButton = styled.button`
  background-color: #6C5CE7;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 12px;
  
  &:hover {
    background-color: #5A4BD1;
  }
`;

export const ValidateButton = styled.button`
  background-color: #1f2937;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #111827;
  }
`;
