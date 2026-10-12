import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const ContentArea = styled.div`
  flex: 1;
  margin-left: 240px; // Width of sidebar
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 0 20px 20px;
`;
