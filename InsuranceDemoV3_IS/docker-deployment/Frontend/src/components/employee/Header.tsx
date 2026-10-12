import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import avatar from '../../assets/avatar.jpeg';
import { getEmployeeById } from '../../lib/api/employeesApi';
import { ChevronDownIcon, LogoutIcon } from '../../components/common/SidebarIcons';
import { ProfileIcon } from '../common/SidebarIcons';
import { ROUTES_CONFIG } from '../../types/routesConfig';
import { useEmployee } from '../../lib/auth/employeeContext';
import type { Employee } from '../../types/employee';
import {
  HeaderContainer,
  WelcomeText,
  ProfileContainer,
  ProfileImage,
  ProfileInfo,
  ProfileName,
  ProfileId,
  ChevronIcon,
  DropdownMenu,
  MenuItem
} from '../../styles/employee/Header.styled';

const Header = memo(() => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuthContext();
  const { employeeId: contextEmployeeId } = useEmployee();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const empId = contextEmployeeId || localStorage.getItem('employeeId') || 'E_001';
        console.log('Header using employee ID:', empId);
        const response = await getEmployeeById(empId);
        const data = response.data.Employee || response.data.employee || response.data;
        if (data && contextEmployeeId) {
          data.employee_id = contextEmployeeId;
        }
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setEmployee(null);
      }
    };

    fetchEmployeeData();
  }, [contextEmployeeId]);

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
    localStorage.removeItem('employeeId');
    sessionStorage.removeItem(ROUTES_CONFIG.USER_STORAGE_KEY);
    sessionStorage.removeItem('userDbId_employee');
    signOut();
    setDropdownOpen(false);
  }, [signOut]);

  const handleProfile = useCallback(() => {
    navigate('/employee/profile');
    setDropdownOpen(false);
  }, [navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleDropdown();
    }
  }, [toggleDropdown]);

  const employeeName = employee?.first_name || employee?.firstName || 'Employee';

  const [displayEmployeeId, setDisplayEmployeeId] = useState<string>(
    contextEmployeeId || employee?.employee_id || employee?.employeeId || 'E_001'
  );
  
  useEffect(() => {
    if (contextEmployeeId) {
      setDisplayEmployeeId(contextEmployeeId);
    }
  }, [contextEmployeeId]);
  
  console.log('Header displaying employeeId:', displayEmployeeId, 'contextEmployeeId:', contextEmployeeId);
  
  return (
    <HeaderContainer>
      <WelcomeText>Welcome, {employeeName}</WelcomeText>
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
          <img src={avatar} alt={`${employeeName}'s profile`} />
        </ProfileImage>
        <ProfileInfo>
          <ProfileName>{employeeName}</ProfileName>
          <ProfileId>{displayEmployeeId}</ProfileId>
        </ProfileInfo>
        <ChevronIcon $isOpen={dropdownOpen}>
          <ChevronDownIcon />
        </ChevronIcon>
        
        {dropdownOpen && (
          <DropdownMenu role="menu">
            <MenuItem 
              onClick={handleProfile}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleProfile()}
            >
              <ProfileIcon />
              Profile
            </MenuItem>
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

Header.displayName = 'EmployeeHeader';

export default Header;