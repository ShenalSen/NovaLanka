import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SidebarContainer = styled.div`
  background-color: #ffffff;
  width: 240px;
  height: 100vh;
  padding: 20px 0;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
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

export const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 4px 0;
  color: black;
  text-decoration: none;
  border-radius: 0 20px 20px 0;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(79, 70, 229, 0.1);
    color: #4f46e5;
  }
  
  &.active {
    background-color: rgba(79, 70, 229, 0.1);
    color: #4f46e5;
    font-weight: 500;
  }
  
  svg {
    margin-right: 12px;
    width: 20px;
    height: 20px;
  }
`;
