import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import novaLogo from '../../../../assets/nova.jpg'; 

const LogoSection = styled.div`
  padding: 0 8px 24px 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
`;

const LogoImg = styled.img`
  height: auto;
  width: 180px;
  border-radius: 8px;
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.2));
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const MenuItem = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  margin: 4px 0;
  color: ${props => (props.active ? '#6C5CE7' : '#4a5568')};
  text-decoration: none;
  border-radius: 8px;
  background: ${props =>
    props.active ? 'linear-gradient(135deg, #6C5CE7 0%, #7d6ef9 100%)' : 'transparent'};
  position: relative;
  transition: all 0.2s ease;
  font-weight: ${props => (props.active ? '500' : '400')};
  box-shadow: ${props =>
    props.active ? '0 4px 12px rgba(108, 92, 231, 0.15)' : 'none'};

  &:hover {
    background: ${props =>
      props.active
        ? 'linear-gradient(135deg, #6C5CE7 0%, #7d6ef9 100%)'
        : '#f0f7ff'};
    transform: translateY(-1px);
  }

  ${props =>
    props.active &&
    `
    color: white;
  `}

  &::before {
    content: '';
    position: absolute;
    left: -16px;
    top: 50%;
    transform: translateY(-50%);
    height: ${props => (props.active ? '60%' : '0%')};
    width: 4px;
    background: #6C5CE7;
    border-radius: 0 4px 4px 0;
    transition: height 0.2s ease;
  }

  &:hover::before {
    height: ${props => (props.active ? '60%' : '30%')};
  }
`;

const IconContainer = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  margin-right: 12px;
  background-color: ${props =>
    props.active ? 'rgba(255, 255, 255, 0.2)' : '#f0f0f0'};
  box-shadow: ${props =>
    props.active ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.04)'};
  transition: all 0.2s ease;

  ${MenuItem}:hover & {
    transform: ${props => (props.active ? 'none' : 'scale(1.05)')};
  }
`;

const MenuIcon = styled.span<{ icon: string; active?: boolean }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: ${props => (props.active ? 'white' : '#6C5CE7')};
  mask-image: ${props => `url("data:image/svg+xml,${props.icon}")`};
  mask-size: cover;
  mask-repeat: no-repeat;
  transition: transform 0.2s ease;
`;

const MenuText = styled.span`
  position: relative;
  color:rgb(0, 0, 0);
  z-index: 1;
`;

const ArrowIcon = styled.span<{ active?: boolean }>`
  margin-left: auto;
  display: flex;
  align-items: center;
  color: ${props => (props.active ? 'white' : '#a0aec0')};
  transition: transform 0.2s ease;
  opacity: ${props => (props.active ? '1' : '0.7')};

  &::before {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8.59 16.59L13.17 12 8.59 7.41L10 6l6 6-6 6-1.41-1.41z'/%3E%3C/svg%3E");
    mask-size: cover;
    background-color: currentColor;
  }

  ${MenuItem}:hover & {
    transform: translateX(3px);
    opacity: 1;
  }
`;

const SidebarContainer = styled.div`
  width: 250px;
  background: linear-gradient(to bottom, #ffffff, #f9fafc);
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 24px 16px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
  z-index: 100;
`;

const NavSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FooterSection = styled.div`
  padding: 16px 8px;
  margin-top: auto;
  font-size: 0.75rem;
  color: #a0aec0;
  border-top: 1px solid #f0f0f0;
  text-align: center;
`;

const Sidebar: React.FC = () => {
  const location = useLocation();

  const icons = {
    profile:
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'%3E%3C/path%3E%3C/svg%3E",
    messages:
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'%3E%3C/path%3E%3C/svg%3E",
    claims:
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1z'%3E%3C/path%3E%3C/svg%3E",
    policies:
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z'%3E%3C/path%3E%3C/svg%3E",
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarContainer>
      <LogoSection>
        <LogoImg src={novaLogo} alt="NOVA Logo" />
      </LogoSection>

      <NavSection>
        <MenuItem to="/customer/profile" active={isActive('/customer/profile')}>
          <IconContainer active={isActive('/customer/profile')}>
            <MenuIcon icon={icons.profile} active={isActive('/customer/profile')} />
          </IconContainer>
          <MenuText>Profile</MenuText>
          <ArrowIcon active={isActive('/customer/profile')} />
        </MenuItem>

        <MenuItem to="/customer/policies" active={isActive('/customer/policies')}>
          <IconContainer active={isActive('/customer/policies')}>
            <MenuIcon icon={icons.policies} active={isActive('/customer/policies')} />
          </IconContainer>
          <MenuText>Policies</MenuText>
          <ArrowIcon active={isActive('/customer/policies')} />
        </MenuItem>

        <MenuItem to="/customer/claims" active={isActive('/customer/claims')}>
          <IconContainer active={isActive('/customer/claims')}>
            <MenuIcon icon={icons.claims} active={isActive('/customer/claims')} />
          </IconContainer>
          <MenuText>Claims</MenuText>
          <ArrowIcon active={isActive('/customer/claims')} />
        </MenuItem>

        
      </NavSection>

      <FooterSection>© 2025 Insurance Portal • v1.0.2</FooterSection>
    </SidebarContainer>
  );
};

export default Sidebar;