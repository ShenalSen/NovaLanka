import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background: #f4f4f9;
  margin-left: 250px;
  margin-top: 64px; /* Creates space below the header */
`;

export const ContentWrapper = styled.div`
  flex: 1;
`;
