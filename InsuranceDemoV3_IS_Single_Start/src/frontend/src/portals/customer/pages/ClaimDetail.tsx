import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClaimByCustomerId } from '../../../lib/api/claimsApi';
import { useCustomer } from '../../../lib/auth/customerContext';
import {
  PageContainer,
  ContentContainer,
  BackButton,
  ClaimDetailCard,
  ClaimHeader,
  ClaimTitle,
  ProgressTracker,
  ProgressLine,
  ProgressActiveLine,
  ProgressPoint,
  ProgressLabel,
  ProgressContainer,
  CardGrid,
  Card,
  CardTitle,
  CardContent,
  DataRow,
  DataLabel,
  DataValue,
  SummaryCard,
  StatusBadge,
  CardDescription,
  Icon
} from '../../../styles/customer/ClaimDetail.styled';

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

const ClaimDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { customerId: contextCustomerId } = useCustomer();
  const customerId = contextCustomerId || 'C_002';

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('ClaimDetail page fetching data for customer ID:', customerId);
        const response = await getClaimByCustomerId(customerId);
        if (response.data && response.data.Claims && Array.isArray(response.data.Claims.Claim)) {
          const found = response.data.Claims.Claim.find((c: ClaimData) => c.claim_id === id);
          setClaim(found || null);
        } else {
          setClaim(null);
        }
      } catch {
        setError('Failed to load claim details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClaim();
  }, [id, customerId]);

  const handleBackClick = () => {
    navigate('/customer/claims');
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading claim details...</div>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (error || !claim) {
    return (
      <PageContainer>
        <ContentContainer>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>{error || 'Claim not found.'}</div>
          <BackButton onClick={handleBackClick}>
            <Icon>←</Icon> Back to Claims
          </BackButton>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <BackButton onClick={handleBackClick}>
          <Icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Icon> 
          Back to Claims
        </BackButton>
        <ClaimDetailCard>
          <ClaimHeader>
            <div>
              <ClaimTitle>Claim #{claim.claim_id}</ClaimTitle>
            </div>
            <StatusBadge status={claim.current_status}>{claim.current_status}</StatusBadge>
          </ClaimHeader>
          {(() => {
            const steps = ['Submitted', 'Under Review', 'Decision Made', 'Payment Processing', 'Closed'];
            let specialStatus: 'Approved' | 'Declined' | 'Closed'| null = null;
            let currentStatus = claim.current_status;
            if (currentStatus === 'Approved') {
              specialStatus = 'Approved';
              currentStatus = 'Decision Made';
            } else if (currentStatus === 'Declined') {
              specialStatus = 'Declined';
              currentStatus = 'Decision Made';
            } else if (currentStatus === 'Closed') {
              specialStatus = 'Closed';
            }
            const currentIndex = steps.findIndex(step => step === currentStatus);
            const currentStep = currentIndex >= 0 ? currentIndex : 0;
            const progressPercent = currentStep === 0 ? 0 : (currentStep / (steps.length - 1)) * 100;
            return (
              <ProgressTracker>
                <ProgressLine />
                <ProgressActiveLine progress={progressPercent} />
                {steps.map((step, index) => {
                  let status: 'completed' | 'current' | 'pending' = 'pending';
                  if (index < currentStep) {
                    status = 'completed';
                  } else if (index === currentStep) {
                    status = 'current';
                  }
                  const isDecisionStep = step === 'Decision Made';
                  const isClosedStep = step === 'Closed';
                  const showDeclinedIcon = isDecisionStep && specialStatus === 'Declined';
                  const showApprovedIcon = isDecisionStep && specialStatus === 'Approved';
                  const showClosedIcon = isClosedStep && specialStatus === 'Closed';
                  return (
                    <ProgressContainer key={step}>
                      <ProgressPoint 
                        status={status} 
                        $specialStatus={isDecisionStep ? specialStatus : (isClosedStep && specialStatus === 'Closed' ? 'Closed' : null)}
                      >
                        {status === 'completed' || showClosedIcon ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M20 6L9 17L4 12" 
                              stroke="white" 
                              strokeWidth="3" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : showDeclinedIcon ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M18 6L6 18M6 6L18 18" 
                              stroke="#FF3B30" 
                              strokeWidth="3" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : showApprovedIcon ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d="M20 6L9 17L4 12" 
                              stroke="#4CD964" 
                              strokeWidth="3" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : status === 'current' ? index + 1 : index + 1}
                      </ProgressPoint>
                      <ProgressLabel 
                        status={status}
                        $specialStatus={isClosedStep && specialStatus === 'Closed' ? 'Closed' : null}
                      >
                        {step}
                        {isDecisionStep && (specialStatus === 'Approved' || specialStatus === 'Declined') ? (
                          <span style={{ 
                            fontSize: '12px', 
                            display: 'block', 
                            marginTop: '4px',
                            color: specialStatus === 'Approved' ? '#4CD964' : '#FF3B30',
                            fontWeight: '600'
                          }}>
                            ({specialStatus})
                          </span>
                        ) : null}
                      </ProgressLabel>
                    </ProgressContainer>
                  );
                })}
              </ProgressTracker>
            );
          })()}
          <CardGrid>
            <Card>
              <CardTitle>Claim Information</CardTitle>
              <CardContent>
                <DataRow>
                  <DataLabel>Claim ID:</DataLabel>
                  <DataValue>{claim.claim_id}</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel>Policy ID:</DataLabel>
                  <DataValue>{claim.policy_id}</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel>Type of Policy:</DataLabel>
                  <DataValue>{claim.type_of_policy}</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel>Policy Value:</DataLabel>
                  <DataValue>{claim.policy_value}</DataValue>
                </DataRow>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Dates & Timeline</CardTitle>
              <CardContent>
                <DataRow>
                  <DataLabel>Incident Date:</DataLabel>
                  <DataValue>
                    {claim.incident_date ? 
                      claim.incident_date.split('T')[0].split('+')[0] : 'N/A'}
                  </DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel>Submission Date:</DataLabel>
                  <DataValue>
                    {claim.submitted_date ? 
                      claim.submitted_date.split('T')[0].split('+')[0] : 'N/A'}
                  </DataValue>
                </DataRow>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Employee details</CardTitle>
              <CardContent>
                <DataRow>
                  <DataLabel>Handled By:</DataLabel>
                  <DataValue>{claim.employee_name || 'Not assigned yet'}</DataValue>
                </DataRow>
              </CardContent>
            </Card>
            <SummaryCard>
              <CardTitle>Claim Notes</CardTitle>
              <CardContent>
                <CardDescription>{claim.note || 'No additional notes available.'}</CardDescription>
              </CardContent>
            </SummaryCard>
            <Card>
              <CardTitle>Incident Details</CardTitle>
              <CardContent>
                <CardDescription>{claim.incident_details || 'No incident details provided.'}</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Loss/Damage Details</CardTitle>
              <CardContent>
                <CardDescription>{claim.loss_damage_details || 'No loss/damage details provided.'}</CardDescription>
              </CardContent>
            </Card>
          </CardGrid>
        </ClaimDetailCard>
      </ContentContainer>
    </PageContainer>
  );
};

export default ClaimDetail;