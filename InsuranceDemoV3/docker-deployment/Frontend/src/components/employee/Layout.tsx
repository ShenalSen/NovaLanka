import React from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 240px; 
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 20px 20px;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <LayoutContainer>
      <Sidebar />
      <ContentArea>
        <Header />
        <MainContent>{children}</MainContent>
      </ContentArea>
    </LayoutContainer>
  );
};

export default Layout;