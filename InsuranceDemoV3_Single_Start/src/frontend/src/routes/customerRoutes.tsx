import { Navigate } from 'react-router-dom';
import type { RouteItem } from '../types/types';

import Layout from '../portals/customer/components/Layout/Layout';
import Claims from '../portals/customer/pages/Claims';
import ClaimDetail from '../portals/customer/pages/ClaimDetail';
import Policies from '../portals/customer/pages/Policies';
import Profile from '../portals/customer/pages/Profile';
import ClaimForm from '../portals/customer/components/Forms/ClaimForm';
import CreateClaim from '../portals/customer/pages/CreateClaim';

const customerRoutes: RouteItem[] = [
  {
    path: '',
    element: <Layout setAuthStatus={() => {}} />,
    children: [
      {
        path: 'claims',
        element: <Claims />
      },
      {
        path: 'claim-details/:id',
        element: <ClaimDetail />
      },
      {
        path: 'policies',
        element: <Policies />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'claim-form',
        element: <ClaimForm />
      },
      {
        path: 'create-claim',
        element: <CreateClaim />
      },
      {
        path: '',
        element: <Navigate to="profile" />
      },
      {
        path: '*',
        element: <Navigate to="profile" />
      }
    ]
  }
];

export default customerRoutes;
