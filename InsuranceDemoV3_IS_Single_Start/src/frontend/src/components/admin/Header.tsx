import { useState, useCallback, memo, useRef, useEffect } from 'react';
import avatar from '../../assets/avatar.jpeg';
import { useAuthContext } from '@asgardeo/auth-react';
import { ROUTES_CONFIG } from '../../types/routesConfig';
import { 
  HeaderContainer, 
  WelcomeText, 
  ProfileContainer, 
  ProfileImage, 
  ProfileInfo, 
  ProfileName, 
  ChevronIcon, 
  DropdownMenu, 
  MenuItem 
} from '../../styles/admin/Header.styled';
import { ChevronDownIcon, LogoutIcon } from '../common/SidebarIcons';

type HeaderProps = {
  userName?: string;
};

const Header = memo(({ userName = 'Admin' }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuthContext();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen(prev => !prev);
  }, []);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    sessionStorage.removeItem(ROUTES_CONFIG.USER_STORAGE_KEY);
    sessionStorage.removeItem('userDbId_admin');
    signOut();
    setDropdownOpen(false);
  }, [signOut]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleDropdown();
    }
  }, [toggleDropdown]);
  
  return (
    <HeaderContainer>
      <WelcomeText>Welcome, {userName}</WelcomeText>
      <ProfileContainer 
        onClick={toggleDropdown}
        ref={dropdownRef}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <ProfileImage>
          <img src={avatar} alt="Profile" />
        </ProfileImage>
        <ProfileInfo>
          <ProfileName>{userName}</ProfileName>
        </ProfileInfo>
        <ChevronIcon $isOpen={dropdownOpen}>
          <ChevronDownIcon />
        </ChevronIcon>
        
        {dropdownOpen && (
          <DropdownMenu role="menu">
            <MenuItem 
              onClick={handleLogout}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
            >
              <LogoutIcon />
              Logout
            </MenuItem>
          </DropdownMenu>
        )}
      </ProfileContainer>
    </HeaderContainer>
  );
});

Header.displayName = 'Header';

export default Header;