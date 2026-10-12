import React, { useEffect, useState } from 'react';
import { getTotalCustomers } from '../../../lib/api/customersApi';
import { getTotalPolicies } from '../../../lib/api/policiesApi';
import { getTotalClaims } from '../../../lib/api/claimsApi';
import {
  DashboardContainer,
  StatCardGrid,
  StatCard,
  StatInfo,
  StatIcon,
  PortalSectionadmin,
  StatLabel,
  StatValue
} from '../../../styles/admin/Dashboard.styled';

const Dashboard: React.FC = () => {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [totalPolicies, setTotalPolicies] = useState<number | null>(null);
  const [totalClaims, setTotalClaims] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getTotalCustomers(),
      getTotalPolicies(),
      getTotalClaims()
    ])
      .then(([customersRes, policiesRes, claimsRes]) => {
        let customers = customersRes.data.CustomerCount?.total_customers ?? customersRes.data.total_customers ?? customersRes.data.count ?? customersRes.data ?? 0;
        let policies = policiesRes.data.PolicyCount?.total_policies ?? policiesRes.data.total_policies ?? policiesRes.data.count ?? policiesRes.data ?? 0;
        let claims = claimsRes.data.ClaimSummary?.total_claims ?? claimsRes.data.total_claims ?? claimsRes.data.count ?? claimsRes.data ?? 0;
        setTotalCustomers(Number(customers));
        setTotalPolicies(Number(policies));
        setTotalClaims(Number(claims));
      })
      .catch(() => setError('Failed to fetch dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardContainer>
      <PortalSectionadmin>Nova's Overview</PortalSectionadmin>
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', fontSize: 22 }}>Loading...</div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'red', fontSize: 18 }}>{error}</div>
      ) : (
        <StatCardGrid>
          <StatCard bg="#ffedd5">
            <StatInfo>
              <StatIcon bg="#f97316">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </StatIcon>
              <StatLabel>Total Customers</StatLabel>
            </StatInfo>
            <StatValue>{totalCustomers !== null ? totalCustomers.toLocaleString() : '-'}</StatValue>
          </StatCard>
          <StatCard bg="#fef3c7">
            <StatInfo>
              <StatIcon bg="#f97316">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </StatIcon>
              <StatLabel>Total Policies</StatLabel>
            </StatInfo>
            <StatValue>{totalPolicies !== null ? totalPolicies.toLocaleString() : '-'}</StatValue>
          </StatCard>
          <StatCard bg="#fef9c3">
            <StatInfo>
              <StatIcon bg="#f97316">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </StatIcon>
              <StatLabel>Total Claims</StatLabel>
            </StatInfo>
            <StatValue>{totalClaims !== null ? totalClaims.toLocaleString() : '-'}</StatValue>
          </StatCard>
        </StatCardGrid>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;