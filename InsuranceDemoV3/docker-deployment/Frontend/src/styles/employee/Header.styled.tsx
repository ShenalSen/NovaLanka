import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #ffffff;
  margin-bottom: 20px;
`;

export const WelcomeText = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

export const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileInfo = styled.div`
  margin-left: 10px;
`;

export const ProfileName = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

export const ProfileId = styled.div`
  font-size: 12px;
  color: #888;
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  margin-left: 10px;
  color: #666;
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 55px;
  right: 0;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 8px 0;
  min-width: 160px;
  z-index: 100;
`;

export const MenuItem = styled.div`
  padding: 12px 20px;
  color: #333;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f7fb;
    color: #3730a3;
  }

  svg {
    height: 16px;
    width: 16px;
  }
`;
