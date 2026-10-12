import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import * as S from '../../../../styles/customer/Layout.styled';

interface LayoutProps {
  setAuthStatus: (status: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ setAuthStatus }) => {
  return (
    <S.LayoutContainer>
      <Sidebar />
      <S.ContentWrapper>
        <Header setAuthStatus={setAuthStatus} />
        <S.MainContent>
          <Outlet />
        </S.MainContent>
      </S.ContentWrapper>
    </S.LayoutContainer>
  );
};

export default Layout;