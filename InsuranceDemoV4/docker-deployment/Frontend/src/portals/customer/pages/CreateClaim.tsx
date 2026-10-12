import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClaim } from '../../../lib/api/claimsApi';
import { sendSubmissionEmail } from '../../../lib/api/EmailApi';
import AddressInput from '../../../components/common/AddressInput';
import {
  PageContainer,
  ContentContainer,
  Heading,
  FormRow,
  FormField,
  Label,
  Input,
  TextArea,
  SubmitButton,
  ErrorMsg,
  DatePicker
} from '../../../styles/customer/CreateClaim.styled';

const CreateClaim: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    address: "",
    policy_id: "",
    type_of_policy: "",
    policy_value: "",
    submitted_date: new Date().toISOString().slice(0, 10),
    incident_date: "",
    employee_name: "Not assigned",
    current_status: "submitted",
    incident_details: "",
    loss_damage_details: "",
    note: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        if (formData.address.trim() !== "" && isAddressValid === null) {
      setError('Please wait for address validation to complete');
      return;
    }
    
    if (formData.address.trim() !== "" && isAddressValid === false) {
      setError('Please enter a valid address');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    const claimData = {
      ...formData,
      policy_value: parseFloat(formData.policy_value),
      submitted_date: new Date().toISOString().slice(0, 10),
      current_status: "submitted"
    };
    const payload = { claim: claimData };
    try {
      await createClaim(payload);
      const emailBody = {
        from: "insurancecompany413@gmail.com",
        to: formData.email,
        subject: "Claim Submission Confirmation",
        content:
          `<p>Dear Valued Customer,</p>\n<p>Thank you for submitting your insurance claim. We have successfully received your claim and it is currently being reviewed by our processing team.</p>\n<p>Our team will assess the information provided and contact you if any additional details are required. You will receive an update regarding the status of your claim within the next few business days.</p>\n<p>If you have any questions or need further assistance, please don’t hesitate to reach out to our support team at <a href="mailto:support@novalanka.lk">support@novalanka.lk</a> or call us at +94 77 123 4567.</p>\n<p>Thank you for choosing our insurance services.</p>\n<p>Best regards,<br>Customer Service Team<br><strong>NOVA Lanka Pvt (Ltd)</strong><br>No. 123, Galle Road, Colombo 03, Sri Lanka</p>\n` +
          `<hr><h4>Your Claim Details:</h4>` +
          `<ul>` +
            `<li><strong>Name:</strong> ${formData.first_name} ${formData.last_name}</li>` +
            `<li><strong>Email:</strong> ${formData.email}</li>` +
            `<li><strong>Mobile Number:</strong> ${formData.mobile_number}</li>` +
            `<li><strong>Address:</strong> ${formData.address}</li>` +
            `<li><strong>Policy ID:</strong> ${formData.policy_id}</li>` +
            `<li><strong>Policy Type:</strong> ${formData.type_of_policy}</li>` +
            `<li><strong>Policy Value:</strong> ${formData.policy_value}</li>` +
            `<li><strong>Incident Date:</strong> ${formData.incident_date}</li>` +
            `<li><strong>Employee Name:</strong> ${formData.employee_name}</li>` +
            `<li><strong>Incident Details:</strong> ${formData.incident_details}</li>` +
            `<li><strong>Loss/Damage Details:</strong> ${formData.loss_damage_details}</li>` +
            (formData.note ? `<li><strong>Additional Notes:</strong> ${formData.note}</li>` : "") +
          `</ul>`,
        contentType: "text/html"
      };
      await sendSubmissionEmail(emailBody);
      navigate('/customer/claims');
    } catch {
      setError('Failed to submit claim. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentContainer>
        <Heading>Submit New Claim</Heading>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormField>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input
                id="mobile_number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                required
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <AddressInput
                id="address"
                name="address"
                value={formData.address}
                onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
                label="Address"
                required={true}
                onValidationComplete={(isValid, displayName) => {
                  setIsAddressValid(isValid);
                  if (isValid && displayName && displayName !== formData.address) {
              
                  }
                }}
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <Label htmlFor="policy_id">Policy ID</Label>
              <Input
                id="policy_id"
                name="policy_id"
                value={formData.policy_id}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <Label htmlFor="type_of_policy">Policy Type</Label>
              <Input
                id="type_of_policy"
                name="type_of_policy"
                value={formData.type_of_policy}
                onChange={handleChange}
                required
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <Label htmlFor="policy_value">Policy Value</Label>
              <Input
                id="policy_value"
                name="policy_value"
                value={formData.policy_value}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <Label htmlFor="incident_date">Incident Date</Label>
              <DatePicker
                id="incident_date"
                name="incident_date"
                type="date"
                value={formData.incident_date}
                onChange={handleChange}
                required
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <Label htmlFor="incident_details">Incident Details</Label>
              <TextArea
                id="incident_details"
                name="incident_details"
                value={formData.incident_details}
                onChange={handleChange}
                required
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <Label htmlFor="loss_damage_details">Loss/Damage Details</Label>
              <TextArea
                id="loss_damage_details"
                name="loss_damage_details"
                value={formData.loss_damage_details}
                onChange={handleChange}
                required
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <Label htmlFor="note">Additional Notes</Label>
              <TextArea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </FormField>
          </FormRow>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          {formData.address.trim() !== "" && isAddressValid === false && (
            <ErrorMsg>Please enter a valid address</ErrorMsg>
          )}
          <SubmitButton 
            type="submit" 
            disabled={isLoading || (formData.address.trim() !== "" && isAddressValid === false)}
          >
            {isLoading ? 'Submitting...' : 'Submit Claim'}
          </SubmitButton>
        </form>
      </ContentContainer>
    </PageContainer>
  );
};

export default CreateClaim;


