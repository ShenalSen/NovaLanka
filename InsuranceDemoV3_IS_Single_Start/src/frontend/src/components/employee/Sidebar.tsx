import { useLocation } from 'react-router-dom';
import { memo, useMemo, useCallback } from 'react';
import companyLogo from '../../assets/nova.jpg';
import {
  SidebarContainer,
  LogoSection,
  LogoImg,
  NavItem
} from '../../styles/employee/Sidebar.styled';
import {
  DashboardIcon,
  CustomersIcon,
  ClaimsIcon,
  PoliciesIcon,
  ProductsIcon
} from '../common/SidebarIcons';
import type { NavRoute, PortalType } from '../../types/navigation';

const Sidebar = memo(() => {
  const location = useLocation();

  const portalPrefix = useMemo((): PortalType => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/employee')) return 'employee';
    return '';
  }, [location.pathname]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      (e.target as HTMLElement).click();
    }
  }, []);

  const navigationRoutes: NavRoute[] = useMemo(() => [
    {
      path: `/${portalPrefix}/dashboard`,
      label: 'Dashboard',
      icon: <DashboardIcon />,
      requiresAuth: true
    },
    {
      path: `/${portalPrefix}/customers`,
      label: 'Customers',
      icon: <CustomersIcon />,
      requiresAuth: true
    },
    {
      path: `/${portalPrefix}/claims`,
      label: 'Claims',
      icon: <ClaimsIcon />,
      requiresAuth: true
    },
    {
      path: `/${portalPrefix}/policies`,
      label: 'Policies',
      icon: <PoliciesIcon />,
      requiresAuth: true
    },
    {
      path: `/${portalPrefix}/products`,
      label: 'Products',
      icon: <ProductsIcon />,
      requiresAuth: true
    }
  ], [portalPrefix]);

  return (
    <SidebarContainer role="navigation">
      <LogoSection>
        <LogoImg src={companyLogo} alt="Nova Insurance" />
      </LogoSection>
      
      {navigationRoutes.map(route => (
        <NavItem
          key={route.path}
          to={route.path}
          className={({ isActive }) => isActive ? 'active' : ''}
          role="menuitem"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-current={location.pathname === route.path ? 'page' : undefined}
        >
          {route.icon}
          {route.label}
        </NavItem>
      ))}
    </SidebarContainer>
  );
});

Sidebar.displayName = 'EmployeeSidebar';

export default Sidebar;