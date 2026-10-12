import React, { memo } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { 
  LayoutContainer, 
  ContentArea, 
  MainContent 
} from '../../styles/admin/Layout.styled';

interface LayoutProps {
  children: ReactNode;
}

const Layout = memo(({ children }: LayoutProps): React.ReactElement => {
  return (
    <LayoutContainer>
      <Sidebar />
      <ContentArea>
        <Header />
        <MainContent>{children}</MainContent>
      </ContentArea>
    </LayoutContainer>
  );
});

Layout.displayName = 'AdminLayout';

export default Layout;