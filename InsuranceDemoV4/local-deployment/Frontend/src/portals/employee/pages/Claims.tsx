import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClaimsByEmployeeId } from '../../../lib/api/claimsApi';
import { useEmployee } from '../../../lib/auth/employeeContext';
import {
  PageContainer,
  Card,
  TitleRow,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  Table,
  Th,
  Tr,
  Td,
  StatusBadge
} from '../../../styles/employee/Claims.styled';

const Claims: React.FC = () => {
  const [search, setSearch] = useState('');
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { employeeId: contextEmployeeId } = useEmployee();
  const employeeId = contextEmployeeId || 'E_001';

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        console.log('Claims page fetching data for employee ID:', employeeId);
        const response = await getClaimsByEmployeeId(employeeId);
        let claimData: any[] = [];
        if (response.data && response.data.Claims && response.data.Claims.Claim) {
          if (Array.isArray(response.data.Claims.Claim)) {
            claimData = response.data.Claims.Claim;
          } else if (typeof response.data.Claims.Claim === 'object') {
            claimData = [response.data.Claims.Claim];
          }
        }
        setClaims(claimData);
      } catch {
        setError('Failed to load claims.');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, [employeeId]);

  const filteredClaims = claims.filter(c =>
    (c.claim_id || c.claimId || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (claimId: string) => {
    navigate(`/employee/claims/${claimId}`);
  };

  return (
    <PageContainer>
      <Card>
        <TitleRow>
          <br />
          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder="Search by Claim ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <SearchIcon>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </SearchIcon>
          </SearchWrapper>
        </TitleRow>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading claims...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>{error}</div>
        ) : (
        <Table>
          <thead>
            <tr>
              <Th>Claim_ID</Th>
              <Th>Customer Name</Th>
              <Th>Policy ID</Th>
              <Th>Employee</Th>
              <Th>Value</Th>
              <Th>Details</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((c, i) => (
              <Tr key={i} onClick={() => handleRowClick(c.claim_id || c.claimId)}>
                <Td>{c.claim_id}</Td>
                <Td>{c.first_name} {c.last_name}</Td>
                <Td>{c.policy_id}</Td>
                <Td>{c.employee_name}</Td>
                <Td>{c.policy_value}</Td>
                <Td>{c.incident_details}</Td> 
                <Td>
                  <StatusBadge status={c.current_status}>
                    {c.current_status}
                  </StatusBadge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        )}
      </Card>
    </PageContainer>
  );
};

export default Claims;