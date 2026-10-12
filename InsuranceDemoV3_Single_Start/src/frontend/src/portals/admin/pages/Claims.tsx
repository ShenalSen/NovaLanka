import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClaims, deleteClaimById } from '../../../lib/api/claimsApi';
import {
  PageContainer,
  PageHeader,
  ButtonGroup,
  Button,
  TableContainer,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  DeleteButton
} from '../../../styles/admin/Claims.styled';

interface Claim {
  claim_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  address: string;
  policy_id: string;
  type_of_policy: string;
  policy_value: number;
  submitted_date: string;
  incident_date: string;
  employee_name: string;
  current_status: string;
  incident_details: string;
  loss_damage_details: string;
  note: string;
}

const Claims: React.FC = () => {
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllClaims()
      .then(res => {
        setClaims(res.data.Claims?.Claim || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch claims');
        setLoading(false);
      });
  }, []);

  const handleDeleteModeToggle = () => setDeleteMode(!deleteMode);

  const handleDeleteClaim = async (claim_id: string) => {
    try {
      await deleteClaimById(claim_id);
      setClaims(prev => prev.filter(c => c.claim_id !== claim_id));
    } catch {
      setError('Failed to delete claim');
    }
  };

  const handleRowClick = (id: string) => {
    if (!deleteMode) navigate(`/admin/claims/${id}`);
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;

  return (
    <PageContainer>
      <PageHeader>
        <br />
        <ButtonGroup>
          <Button $variant="danger" onClick={handleDeleteModeToggle}>
            {deleteMode ? 'Cancel' : 'Delete'}
          </Button>
        </ButtonGroup>
      </PageHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Claim_ID</TableHeader>
              <TableHeader>Customer Name</TableHeader>
              <TableHeader>Policy ID</TableHeader>
              <TableHeader>Employee name</TableHeader>
              <TableHeader>Value</TableHeader>
              <TableHeader>Details</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <TableRow 
                key={claim.claim_id} 
                onClick={() => handleRowClick(claim.claim_id)}
                style={{ cursor: deleteMode ? 'default' : 'pointer' }}
              >
                <TableCell>{claim.claim_id}</TableCell>
                <TableCell>{claim.first_name} {claim.last_name}</TableCell>
                <TableCell>{claim.policy_id}</TableCell>
                <TableCell>{claim.employee_name}</TableCell>
                <TableCell>{claim.policy_value}</TableCell>
                <TableCell>{claim.incident_details}</TableCell>
                <TableCell>
                  {deleteMode ? (
                    <DeleteButton onClick={e => { e.stopPropagation(); handleDeleteClaim(claim.claim_id); }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H3.33333H14" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33334 4V2.66667C5.33334 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66668 1.33334H9.33334C9.68697 1.33334 10.0261 1.47381 10.2762 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2762 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97392 14.5262 3.72387 14.2761C3.47382 14.0261 3.33334 13.687 3.33334 13.3333V4H12.6667Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </DeleteButton>
                  ) : (
                    <StatusBadge $status={normalizeStatus(claim.current_status)}>
                      {claim.current_status}
                    </StatusBadge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

function normalizeStatus(status: string) {
  if (!status) return '';
  const s = status.trim().replace(/\s+/g, '');
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default Claims;