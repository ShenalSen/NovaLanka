import React, { useState, useEffect } from 'react';
import avatarImage from '../../../../assets/avatar.jpeg';
import { FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import { getCustomerById } from '../../../../lib/api/customersApi';
import * as S from '../../../../styles/customer/Header.styled';

interface HeaderProps {
  setAuthStatus?: (status: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setAuthStatus }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    const customer_id = 'C_002';
    getCustomerById(customer_id)
      .then(res => {
        const data = res.data.Customer || res.data.customer || res.data;
        setCustomer(data);
      })
      .catch(() => {
        setCustomer(null);
      });
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    }
  };

  const handleLogoutClick = () => {
    console.log('Logging out...');
    
    if (setAuthStatus) {
      setAuthStatus(false);
    }
    
    sessionStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    setDropdownOpen(false);
    window.location.href = '/login';
  };

  return (
    <>
      {dropdownOpen && <S.Overlay onClick={handleClickOutside} />}
    
      <S.HeaderContainer>
        <S.WelcomeText>
          Welcome, {customer?.first_name || customer?.firstName || 'Customer'}
        </S.WelcomeText>
        <S.UserInfo onClick={toggleDropdown}>
          <S.UserDetails>
            <S.UserName>
              {customer?.first_name || customer?.firstName || 'Customer'}
            </S.UserName>
            <S.UserId>{customer?.customer_id || 'C_002'}</S.UserId>
          </S.UserDetails>
          <S.Avatar src={avatarImage} alt="User avatar" />
          <S.DropdownIcon>
            {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </S.DropdownIcon>

          <S.DropdownMenu open={dropdownOpen}>
            <S.DropdownItem onClick={handleLogoutClick}>
              <S.IconWrapper><FaSignOutAlt /></S.IconWrapper>
              Logout
            </S.DropdownItem>
          </S.DropdownMenu>
        </S.UserInfo>
      </S.HeaderContainer>
    </>
  );
};

export { S as HeaderStyles };
export default Header;