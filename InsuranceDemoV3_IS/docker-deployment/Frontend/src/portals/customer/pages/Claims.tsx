import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClaimByCustomerId } from '../../../lib/api/claimsApi';
import { useCustomer } from '../../../lib/auth/customerContext';
import {
  PageContainer,
  ContentContainer,
  PageHeader,
  HeaderTextContainer,
  PageHeading,
  PageDescription,
  ClaimsCard,
  ClaimsTable,
  TableHeader,
  TableHeaderRow,
  TableRow,
  TableCell,
  StatusCell,
  StatusBadge,
  NewClaimButton
} from '../../../styles/customer/Claims.styled';

interface ClaimData {
  claim_id: string;
  policy_id: string;
  type_of_policy: string;
  policy_value: string;
  submitted_date: string;
  incident_date: string;
  current_status: string;
  incident_details: string;
  loss_damage_details: string;
  note: string;
  employee_name: string;
}

const Claims: React.FC = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { customerId } = useCustomer();

  const fetchClaims = async () => {
    const id = customerId || 'C_002';
    
    try {
      setLoading(true);
      const response = await getClaimByCustomerId(id);
      if (response.data && response.data.Claims && Array.isArray(response.data.Claims.Claim)) {
        setClaims(response.data.Claims.Claim);
      } else {
        setClaims([]);
      }
    } catch {
      setError('Failed to load your claims.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [customerId]);

  const handleClaimClick = (claimId: string) => {
    navigate(`/customer/claim-details/${claimId}`);
  };

  const handleNewClaim = () => {
    navigate('/customer/create-claim');
  };

  return (
    <PageContainer>
      <ContentContainer>
        <PageHeader>
          <HeaderTextContainer>
            <PageHeading>Your Claims</PageHeading>
            <PageDescription>
              Track and manage all your insurance claims in one place
            </PageDescription>
          </HeaderTextContainer>
          <NewClaimButton onClick={handleNewClaim}>
            Apply For New Claim
          </NewClaimButton>
        </PageHeader>
        <ClaimsCard>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading your claims...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>{error}</div>
          ) : claims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              You don't have any claims yet. Apply for your first claim today!
            </div>
          ) : (
            <ClaimsTable>
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <TableHeaderRow>
                  <TableHeader>Claim_ID</TableHeader>
                  <TableHeader>Policy_ID</TableHeader>
                  <TableHeader>Type of Policy</TableHeader>
                  <TableHeader>Policy Value</TableHeader>
                  <TableHeader>Employee Name</TableHeader>
                  <TableHeader>Submitted</TableHeader>
                  <TableHeader>Incident Date</TableHeader>
                  <TableHeader>Details</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableHeaderRow>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <TableRow
                    key={index}
                    clickable={true}
                    onClick={() => handleClaimClick(claim.claim_id)}
                  >
                    <TableCell>{claim.claim_id}</TableCell>
                    <TableCell>{claim.policy_id}</TableCell>
                    <TableCell>{claim.type_of_policy}</TableCell>
                    <TableCell>{claim.policy_value}</TableCell>
                    <TableCell>{claim.employee_name}</TableCell>
                    <TableCell>{claim.submitted_date ? claim.submitted_date.split('T')[0].split('+')[0] : ''}</TableCell>
                    <TableCell>{claim.incident_date ? claim.incident_date.split('T')[0].split('+')[0] : ''}</TableCell>
                    <TableCell>{claim.incident_details}</TableCell>
                    <StatusCell>
                      <StatusBadge status={claim.current_status}>
                        {claim.current_status}
                      </StatusBadge>
                    </StatusCell>
                  </TableRow>
                ))}
              </tbody>
            </ClaimsTable>
          )}
        </ClaimsCard>
      </ContentContainer>
    </PageContainer>
  );
};

export default Claims;