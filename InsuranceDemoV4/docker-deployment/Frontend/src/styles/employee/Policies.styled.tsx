import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  background-color: #f5f7fb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const ContentContainer = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const PoliciesTable = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.5fr 1.5fr 1.3fr 1.2fr 2.5fr 1fr;
  padding: 18px 32px;
  border-bottom: 1px solid #eaeaea;
  background-color:rgb(230, 231, 235);
`;

export const HeaderCell = styled.div`
  font-size: 15px;
  font-weight: 600;
  color:#6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const DetailsHeaderCell = styled(HeaderCell)`
  justify-content: flex-start;
  text-align: left;
`;

export const TableBody = styled.div``;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.5fr 1.5fr 1.3fr 1.2fr 2.5fr 1fr;
  padding: 18px 32px;
  border-bottom: 1px solid #f1f1f1;
  transition: background-color 0.2s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f8fafd;
  }
`;

export const TableCell = styled.div`
  font-size: 15px;
  color:rgb(13, 13, 15);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const DetailsCell = styled(TableCell)`
  justify-content: flex-start;
  text-align: left;
`;

export const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 36px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${props => props.status === 'active' ? '#ccf1e5' : '#ffccd1'};
  color: ${props => props.status === 'active' ? '#10b981' : '#ef4444'};
  border: none;
  text-align: center;
  white-space: nowrap;
  box-sizing: border-box;
`;
