import React, { useEffect, useState } from 'react';
import { getPoliciesDetailsByEmployeeId } from '../../../lib/api/policiesApi';
import { useEmployee } from '../../../lib/auth/employeeContext';
import {
  PageContainer,
  ContentContainer,
  PoliciesTable,
  TableHeader,
  HeaderCell,
  DetailsHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  DetailsCell,
  StatusBadge
} from '../../../styles/employee/Policies.styled';

interface Policy {
  policy_id: string;
  product_id: string;
  employee_id: string;
  customer_id: string;
  start_date: string;
  end_date: string;
  status: string;
  policy_details: string;
}

const Policies: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { employeeId } = useEmployee();

  useEffect(() => {
    const fetchPolicies = async () => {
      const id = employeeId || 'E_001';
      
      try {
        setLoading(true);
        const response = await getPoliciesDetailsByEmployeeId(id);
        if (response.data && response.data.Policies && Array.isArray(response.data.Policies.Policy)) {
          setPolicies(response.data.Policies.Policy);
        } else {
          setPolicies([]);
        }
      } catch {
        setError('Failed to load policies.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, [employeeId]);

  return (
    <PageContainer>
      <ContentContainer>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading policies...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>{error}</div>
        ) : (
          <PoliciesTable>
            <TableHeader>
              <HeaderCell>Policy ID</HeaderCell>
              <HeaderCell>Product ID</HeaderCell>
              <HeaderCell>Customer ID</HeaderCell>
              <HeaderCell>Start Date</HeaderCell>
              <HeaderCell>End Date</HeaderCell>
              <DetailsHeaderCell>Details</DetailsHeaderCell>
              <HeaderCell>Status</HeaderCell>
            </TableHeader>
            <TableBody>
              {policies.map((policy, idx) => (
                <TableRow key={idx}>
                  <TableCell>{policy.policy_id}</TableCell>
                  <TableCell>{policy.product_id}</TableCell>
                  <TableCell>{policy.customer_id}</TableCell>
                  <TableCell>{policy.start_date.split('T')[0].split('+')[0]}</TableCell>
                  <TableCell>{policy.end_date.split('T')[0].split('+')[0]}</TableCell>
                  <DetailsCell>{policy.policy_details}</DetailsCell>
                  <TableCell>
                    <StatusBadge status={policy.status === 'Active' ? 'active' : 'inactive'}>
                      {policy.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </PoliciesTable>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default Policies;