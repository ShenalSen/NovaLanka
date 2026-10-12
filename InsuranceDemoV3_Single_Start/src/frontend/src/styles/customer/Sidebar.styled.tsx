import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.div`
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

export const LogoSection = styled.div`
  padding: 0 8px 24px 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
`;

export const LogoImg = styled.img`
  height: auto;
  width: 180px;
  border-radius: 8px;
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.2));
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

export const MenuItem = styled(Link)<{ active?: boolean }>`
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

export const IconContainer = styled.div<{ active?: boolean }>`
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

export const MenuIcon = styled.span<{ icon: string; active?: boolean }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: ${props => (props.active ? 'white' : '#6C5CE7')};
  mask-image: ${props => `url("data:image/svg+xml,${props.icon}")`};
  mask-size: cover;
  mask-repeat: no-repeat;
  transition: transform 0.2s ease;
`;

export const MenuText = styled.span`
  position: relative;
  color: rgb(0, 0, 0);
  z-index: 1;
`;

export const ArrowIcon = styled.span<{ active?: boolean }>`
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

export const NavSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const FooterSection = styled.div`
  padding: 16px 8px;
  margin-top: auto;
  font-size: 0.75rem;
  color: #a0aec0;
  border-top: 1px solid #f0f0f0;
  text-align: center;
`;
