import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClaimById, updateClaimById } from '../../../lib/api/claimsApi';
import { sendSubmissionEmail } from '../../../lib/api/EmailApi';
import AddressInput from '../../../components/common/AddressInput';
import {
  Container,
  Card,
  TitleRow,
  Title,
  FormGrid,
  FieldGroup,
  Label,
  Value,
  NoteArea,
  ButtonRow,
  EditButton,
  CancelButton,
  SaveButton,
  StatusSelect
} from '../../../styles/employee/ClaimDetail.styled';

const ClaimDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [claimData, setClaimData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prevStatus, setPrevStatus] = useState<string>('');
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getClaimById(id)
      .then(res => {
        const backend = res.data.Claim || res.data.claim || res.data;
        if (!backend) {
          setClaimData(null);
          setLoading(false);
          return;
        }
        const mapped = {
          claim_id: backend.claim_id,
          first_name: backend.first_name,
          last_name: backend.last_name,
          email: backend.email,
          mobile_number: backend.mobile_number,
          address: backend.address,
          policy_id: backend.policy_id,
          type_of_policy: backend.type_of_policy,
          policy_value: backend.policy_value,
          submitted_date: backend.submitted_date,
          incident_date: backend.incident_date,
          employee_name: backend.employee_name,
          current_status: backend.current_status,
          incident_details: backend.incident_details,
          loss_damage_details: backend.loss_damage_details,
          note: backend.note,
        };
        setClaimData(mapped);
        setStatus(mapped.current_status || '');
        setPrevStatus(mapped.current_status || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch claim details');
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsAddressValid(null); 
  };
  const handleCancel = () => {
    setIsEditing(false);
    navigate('/employee/claims');
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && claimData.address.trim() !== "" && isAddressValid === false) {
      setError('Please enter a valid address before saving');
      return;
    }
    
    try {
      const payload = {
        claim: {
          claim_id: claimData.claim_id,
          first_name: claimData.first_name,
          last_name: claimData.last_name,
          email: claimData.email,
          mobile_number: claimData.mobile_number,
          address: claimData.address,
          policy_id: claimData.policy_id,
          type_of_policy: claimData.type_of_policy,
          policy_value: Number(claimData.policy_value),
          submitted_date: claimData.submitted_date,
          incident_date: claimData.incident_date,
          employee_name: claimData.employee_name,
          current_status: status,
          incident_details: claimData.incident_details,
          loss_damage_details: claimData.loss_damage_details,
          note: claimData.note,
        }
      };
      await updateClaimById(id!, payload);
      if (status !== prevStatus) {
        const today = new Date().toISOString().slice(0, 10);
        if (status === 'Closed') {
          const emailBody = {
            from: "insurancecompany413@gmail.com",
            to: claimData.email,
            subject: `Claim Closed on ${today}`,
            content:
              `<p>Dear Valued Customer,</p>\n\n<p>We are writing to inform you that your insurance claim has been successfully processed and is now closed.</p>\n\n<p><strong>Claim Reference Number:</strong> ${claimData.claim_id}</p>\n<p><strong>Date of Completion:</strong> ${today}</p>\n\n<p>If you have any questions regarding the claim decision or require any additional documentation, please feel free to contact our support team.</p>\n\n<p>You can reach us at <a href=\"mailto:support@novalanka.lk\">support@novalanka.lk</a> or call +94 77 123 4567 during our business hours.</p>\n\n<p>Thank you for trusting NOVA Lanka Pvt (Ltd) with your insurance needs.</p>\n\n<p>Best regards,<br>\nCustomer Service Team<br>\n<strong>NOVA Lanka Pvt (Ltd)</strong><br>\nNo. 123, Galle Road, Colombo 03, Sri Lanka</p>`,
            contentType: "text/html"
          };
          await sendSubmissionEmail(emailBody);
        } else if (status === 'Declined') {
          const emailBody = {
            from: "insurancecompany413@gmail.com",
            to: claimData.email,
            subject: `Claim Declined`,
            content:
              `<p>Dear Valued Customer,</p>\n\n<p>We regret to inform you that after a thorough review, your insurance claim with the reference number <strong>${claimData.claim_id}</strong> has been declined.</p>\n\n<p>The decision was made based on the assessment of the provided information and in accordance with the terms and conditions of your policy.</p>\n\n<p>If you believe this decision was made in error or if you require further clarification, you are welcome to contact our support team. We are here to assist you and address any concerns you may have.</p>\n\n<p><strong>Contact us:</strong><br>\nEmail: <a href=\"mailto:support@novalanka.lk\">support@novalanka.lk</a><br>\nPhone: +94 77 123 4567</p>\n\n<p>We appreciate your understanding and thank you for trusting NOVA Lanka Pvt (Ltd).</p>\n\n<p>Best regards,<br>\nClaims Department<br>\n<strong>NOVA Lanka Pvt (Ltd)</strong><br>\nNo. 123, Galle Road, Colombo 03, Sri Lanka</p>`,
            contentType: "text/html"
          };
          await sendSubmissionEmail(emailBody);
        }
      }
      setPrevStatus(status);
      setIsEditing(false);
      alert('Changes saved successfully!');
      navigate('/employee/claims');
    } catch {
      setError('Failed to update claim');
    }
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setClaimData((prev: any) => ({ ...prev, current_status: e.target.value }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClaimData((prev: any) => ({ ...prev, [name]: value }));
  };
  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!claimData) return <Container>No claim found.</Container>;

  return (
    <Container>
      <Card>
        <TitleRow>
          <Title>Claim Details - <span style={{ color: '#6366f1' }}>#{claimData.claim_id}</span></Title>
          {!isEditing && (
            <EditButton type="button" onClick={handleEdit}>Edit</EditButton>
          )}
        </TitleRow>
        <form onSubmit={handleSave} autoComplete="off" action="javascript:void(0);">
          <FormGrid>
            <FieldGroup>
              <Label>First Name</Label>
              <Value 
                name="first_name"
                value={claimData.first_name} 
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Last Name</Label>
              <Value 
                name="last_name"
                value={claimData.last_name} 
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Policy ID</Label>
              <Value 
                name="policy_id"
                value={claimData.policy_id} 
                readOnly={true}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Email</Label>
              <Value 
                name="email"
                value={claimData.email} 
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Mobile number</Label>
              <Value 
                name="mobile_number"
                value={claimData.mobile_number} 
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Submitted</Label>
              <Value 
                name="submitted_date"
                value={claimData.submitted_date ? claimData.submitted_date.slice(0, 10) : ''} 
                readOnly={true}
              />
            </FieldGroup>
            <FieldGroup style={{ gridColumn: '1 / span 3' }}>
              {isEditing ? (
                <AddressInput
                  id="address"
                  name="address"
                  value={claimData.address}
                  onChange={(value) => setClaimData((prev: any) => ({ ...prev, address: value }))}
                  label="Address"
                  required={true}
                  onValidationComplete={(isValid) => {
                    setIsAddressValid(isValid);
                  }}
                />
              ) : (
                <>
                  <Label>Address</Label>
                  <Value 
                    name="address"
                    value={claimData.address} 
                    readOnly={true}
                  />
                </>
              )}
            </FieldGroup>
            <FieldGroup>
              <Label>Employee Name</Label>
              <Value 
                name="employee_name"
                value={claimData.employee_name} 
                readOnly={true}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Policy Value</Label>
              <Value 
                name="policy_value"
                value={claimData.policy_value} 
                readOnly={true}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Type of Insurance Policy</Label>
              <Value 
                name="type_of_policy"
                value={claimData.type_of_policy} 
                readOnly={true}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Current Status</Label>
              <StatusSelect 
                name="status"
                value={status} 
                onChange={handleStatusChange}
                disabled={!isEditing}
              >
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
                <option value="Payment Processing">Payment Processing</option>
                <option value="Closed">Closed</option>
              </StatusSelect>
            </FieldGroup>
          </FormGrid>
          <FieldGroup style={{ marginBottom: 0 }}>
            <Label>Note</Label>
            <NoteArea 
              name="note"
              value={claimData.note} 
              readOnly={!isEditing}
              onChange={handleChange}
            />
          </FieldGroup>
          {isEditing && (
            <ButtonRow>
              <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
              <SaveButton type="submit">Save</SaveButton>
            </ButtonRow>
          )}
        </form>
      </Card>
    </Container>
  );
};

export default ClaimDetails;