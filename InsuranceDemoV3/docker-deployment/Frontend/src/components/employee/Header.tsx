import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../../assets/avatar.jpeg';
import { getEmployeeById } from '../../lib/api/employeesApi';
import { ChevronDownIcon, LogoutIcon } from '../../components/common/SidebarIcons';
import { ProfileIcon } from '../common/SidebarIcons';
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

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeId = localStorage.getItem('employeeId') || 'E_001';
        const response = await getEmployeeById(employeeId);
        const data = response.data.Employee || response.data.employee || response.data;
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setEmployee(null);
      }
    };

    fetchEmployeeData();
  }, []);

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
    navigate('/');
    setDropdownOpen(false);
  }, [navigate]);

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
  const employeeId = employee?.employee_id || employee?.employeeId || 'E_001';
  
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
          <ProfileId>{employeeId}</ProfileId>
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