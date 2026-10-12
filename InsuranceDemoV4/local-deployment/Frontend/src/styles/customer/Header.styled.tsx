import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  position: fixed;
  top: 0;
  right: 0;
  left: 250px; /* Width of the sidebar */
  height: 64px; /* Fixed height for header */
  z-index: 100;
`;

export const HeaderSpacer = styled.div`
  height: 64px; /* Same as header height */
  width: 100%;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  cursor: pointer;
`;

export const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f5f7fb;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const UserName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

export const UserId = styled.span`
  font-size: 12px;
  color: #888;
`;

export const DropdownIcon = styled.div`
  margin-left: 4px;
  margin-top: 2px;
  color: #888;
  font-size: 12px;
  transition: transform 0.2s ease;
`;

export const WelcomeText = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin: 0;
`;

export const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 150px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => (props.open ? 1 : 0)};
  transform: ${props => (props.open ? 'translateY(0)' : 'translateY(-10px)')};
  visibility: ${props => (props.open ? 'visible' : 'hidden')};
  z-index: 101;
`;

export const DropdownItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #555;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f7fb;
    color: #6C5CE7;
  }
`;

export const IconWrapper = styled.div`
  width: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
`;
