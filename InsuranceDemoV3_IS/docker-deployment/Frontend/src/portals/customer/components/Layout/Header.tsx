import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import avatarImage from '../../../../assets/avatar.jpeg';
import { FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import { getCustomerById } from '../../../../lib/api/customersApi';
import { ROUTES_CONFIG } from '../../../../types/routesConfig';
import { useCustomer } from '../../../../lib/auth/customerContext';
import * as S from '../../../../styles/customer/Header.styled';

interface HeaderProps {
  setAuthStatus?: (status: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setAuthStatus }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const { signOut } = useAuthContext();
  const { customerId } = useCustomer();
  
  const [displayCustomerId, setDisplayCustomerId] = useState<string>(
    customerId || 'C_002'
  );
  
  useEffect(() => {
    if (customerId) {
      console.log('Customer Header updating displayCustomerId to:', customerId);
      setDisplayCustomerId(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    const customer_id = customerId || 'C_002';
    console.log('Customer Header using customer ID:', customer_id);
    getCustomerById(customer_id)
      .then(res => {
        const data = res.data.Customer || res.data.customer || res.data;
        if (data && customerId) {
          data.customer_id = customerId;
        }
        setCustomer(data);
      })
      .catch(() => {
        setCustomer(null);
      });
  }, [customerId]);

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
    sessionStorage.removeItem(ROUTES_CONFIG.USER_STORAGE_KEY);
    sessionStorage.removeItem('userDbId_customer');
    localStorage.removeItem('user');
    
    signOut();
    setDropdownOpen(false);
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
            <S.UserId>{displayCustomerId}</S.UserId>
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