import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
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
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color:#6366f1;
  font-weight: 600;
  font-size: 15px;
  background-color:rgb(230, 231, 235);
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
  color:rgb(21, 22, 23);
  font-size: 15px;
`;
