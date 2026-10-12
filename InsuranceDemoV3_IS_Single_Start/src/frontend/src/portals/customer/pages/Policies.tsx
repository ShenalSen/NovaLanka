import React, { useState, useEffect } from 'react';
import PolicyForm, { type PolicyFormData } from '../components/Forms/PolicyForm';
import PolicyValidatorForm from '../components/Forms/PolicyValidatorForm';
import { getPolicyByCustomerId } from '../../../lib/api/policiesApi';
import { useCustomer } from '../../../lib/auth/customerContext';
import {
  PageContainer,
  ContentContainer,
  PageHeading,
  PageDescription,
  PoliciesTable,
  TableHeader,
  HeaderCell,
  TableCell,
  DetailsCell,
  DetailsHeaderCell,
  TableBody,
  TableRow,
  StatusBadge,
  ButtonContainer,
  ApplyButton,
  ValidateButton
} from '../../../styles/customer/Policies.styled';

interface Policy {
  policy_id: string;
  customer_id: string;
  product_id: string;
  employee_id?: string;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  policy_details: string;
  created_at?: string;
}

const Policies: React.FC = () => {
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [showValidatorForm, setShowValidatorForm] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { customerId: contextCustomerId } = useCustomer();
  const customerId = contextCustomerId || 'C_002';

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        console.log('Policies page fetching data for customer ID:', customerId);
        const response = await getPolicyByCustomerId(customerId);
        if (response.data && response.data.Policies && Array.isArray(response.data.Policies.Policy)) {
          setPolicies(response.data.Policies.Policy);
        } else {
          setPolicies([]);
        }
      } catch (err: any) {
        setError(`Failed to load your policies: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, [customerId]);

  const handleApplyForNewPolicy = () => setShowPolicyForm(true);
  const handleFormCancel = () => setShowPolicyForm(false);
  const handleValidatorFormCancel = () => setShowValidatorForm(false);

  const handleFormSubmit = async (formData: PolicyFormData) => {
    try {
      setLoading(true);
      const emailBody = {
        from: 'insurancecompany413@gmail.com',
        to: 'insurancecompany413@gmail.com',
        subject: `Customer New Policy Application – ${customerId}`,
        content:
          `<p>Dear Admin,</p>\n\n` +
          `<p>This is to inform you that the customer <strong>${formData.firstName} ${formData.lastName}</strong> (Customer ID: <strong>${customerId}</strong>) has requested to apply for a new insurance policy.</p>\n\n` +
          `<p>Please take the necessary actions to guide the customer through the policy application process and ensure all required documentation is collected.</p>\n\n` +
          `<p><strong>Customer Details:</strong></p>\n` +
          `<ul style='list-style:none;padding-left:0;'>` +
          `<li><strong>Email:</strong> <a href=\"mailto:${formData.email}\">${formData.email}</a></li>` +
          `<li><strong>Phone:</strong> ${formData.mobileNumber}</li>` +
          `<li><strong>Address:</strong> ${formData.address}</li>` +
          `<li><strong>Duration:</strong> ${formData.duration} years</li>` +
          `<li><strong>Type of Insurance Policy:</strong> ${formData.policyType}</li>` +
          `</ul>` +
          `<p>Best regards,<br>\nCustomer Support Team<br>\n<strong>NOVA Lanka Pvt (Ltd)</strong><br>\nNo. 123, Galle Road, Colombo 03, Sri Lanka<br>\nPhone: +94 77 123 4567</p>`,
        contentType: 'text/html'
      };
      try {
        await import('../../../lib/api/EmailApi').then(({ sendSubmissionEmail }) => sendSubmissionEmail(emailBody));
      } catch {
        setError('Failed to send notification email. Please try again.');
      }
    } catch {
      setError('Failed to process your policy application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showPolicyForm) {
    return <PolicyForm onCancel={handleFormCancel} onSubmit={handleFormSubmit} />;
  }

  if (showValidatorForm) {
    return <PolicyValidatorForm onCancel={handleValidatorFormCancel} />;
  }

  return (
    <PageContainer>
      <ContentContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <PageHeading>Your Policies</PageHeading>
            <PageDescription>
              View all your insurance policies in one place. Each policy comes with comprehensive coverage tailored to your specific needs.
            </PageDescription>
          </div>
          <ButtonContainer>
            <ValidateButton onClick={() => setShowValidatorForm(true)}>
              Validate Policy
            </ValidateButton>
            <ApplyButton onClick={handleApplyForNewPolicy}>
              Apply for a New Policy
            </ApplyButton>
          </ButtonContainer>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading your policies...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>{error}</div>
        ) : policies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            You don't have any policies yet. Apply for your first policy today!
          </div>
        ) : (
          <PoliciesTable>
            <TableHeader>
              <HeaderCell>Policy ID</HeaderCell>
              <HeaderCell>Product ID</HeaderCell>
              <HeaderCell>Start Date</HeaderCell>
              <HeaderCell>End Date</HeaderCell>
              <DetailsHeaderCell>Details</DetailsHeaderCell>
              <HeaderCell>Status</HeaderCell>
            </TableHeader>
            <TableBody>
              {policies.map((policy, index) => (
                <TableRow key={index}>
                  <TableCell>{policy.policy_id}</TableCell>
                  <TableCell>{policy.product_id}</TableCell>
                  <TableCell>{policy.start_date.split('T')[0].split('+')[0]}</TableCell>
                  <TableCell>{policy.end_date.split('T')[0].split('+')[0]}</TableCell>
                  <DetailsCell>{policy.policy_details}</DetailsCell>
                  <TableCell>
                    <StatusBadge status={policy.status}>
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