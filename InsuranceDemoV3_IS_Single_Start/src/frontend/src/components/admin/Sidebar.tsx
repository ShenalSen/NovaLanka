import { useLocation } from 'react-router-dom';
import { memo, useMemo } from 'react';
import companyLogo from '../../assets/nova.jpg';
import {
  SidebarContainer,
  LogoSection,
  LogoImg,
  NavItem
} from '../../styles/admin/Sidebar.styled';
import {
  DashboardIcon,
  CustomersIcon,
  ClaimsIcon,
  PoliciesIcon,
  EmployeesIcon,
  ProductsIcon
} from '../common/SidebarIcons';

type NavRoute = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

const Sidebar = memo(() => {
  const location = useLocation();

  const portalPrefix = useMemo(() => {
    if (location.pathname.startsWith('/admin')) return '/admin';
    if (location.pathname.startsWith('/employee')) return '/employee';
    return '';
  }, [location.pathname]);

  const navRoutes: NavRoute[] = useMemo(() => [
    { path: `${portalPrefix}/dashboard`, label: 'Dashboard', icon: <DashboardIcon /> },
    { path: `${portalPrefix}/customers`, label: 'Customers', icon: <CustomersIcon /> },
    { path: `${portalPrefix}/claims`, label: 'Claims', icon: <ClaimsIcon /> },
    { path: `${portalPrefix}/policies`, label: 'Policies', icon: <PoliciesIcon /> },
    { path: `${portalPrefix}/employees`, label: 'Employees', icon: <EmployeesIcon /> },
    { path: `${portalPrefix}/products`, label: 'Products', icon: <ProductsIcon /> }
  ], [portalPrefix]);

  return (
    <SidebarContainer>
      <LogoSection>
        <LogoImg src={companyLogo} alt="Nova Insurance" />
      </LogoSection>
      
      {navRoutes.map((route) => (
        <NavItem 
          key={route.path} 
          to={route.path} 
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          {route.icon}
          {route.label}
        </NavItem>
      ))}
    </SidebarContainer>
  );
});

Sidebar.displayName = 'AdminSidebar';

export default Sidebar;