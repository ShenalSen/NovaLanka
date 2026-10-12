import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomer } from '../../../lib/api/customersApi';
import AddressInput from '../../../components/common/AddressInput';
import {
  PageContainer,
  FormContainer,
  PageTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonGroup,
  Button
} from '../../../styles/admin/CustomerCreate.styled';

const CustomerCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    status: 'active'
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => navigate('/admin/customers');

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      const requiredFields = ['first_name', 'last_name', 'email', 'gender', 'phone'];
      const missingFields = requiredFields.filter(field => !newCustomer[field as keyof typeof newCustomer]);
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ').replace(/_/g, ' ')}`);
        setLoading(false);
        return;
      }
      
      if (newCustomer.address.trim() !== "" && isAddressValid === false) {
        setError('Please enter a valid address');
        setLoading(false);
        return;
      }
      let formattedDob = newCustomer.dob.trim() || '';
      const customerData = {
        customer: {
          first_name: newCustomer.first_name.trim(),
          last_name: newCustomer.last_name.trim(),
          dob: formattedDob,
          gender: newCustomer.gender,
          email: newCustomer.email.trim(),
          phone: newCustomer.phone.trim(),
          address: newCustomer.address.trim(),
          status: newCustomer.status
        }
      };
      await createCustomer(customerData);
      navigate('/admin/customers');
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 500) {
          const errorMessage = err.message || '';
          if (errorMessage.toLowerCase().includes('date') || errorMessage.toLowerCase().includes('dob')) {
            setError('Date of Birth format is incorrect. Please use the date picker to select a valid date.');
          } else if (err.response.data?.includes('duplicate')) {
            setError('A customer with this email already exists. Please use a different email address.');
          } else {
            setError('Server error occurred. This might be due to invalid data format.');
          }
        } else {
          setError(`Failed to create customer: ${err.response?.data?.message || 'Server error'}`);
        }
      } else if (err.request) {
        setError('No response received from server. Please check your connection.');
      } else if (err.message?.includes('certificate') || err.message?.includes('SSL')) {
        setError('Connection security issue: There might be a problem with the server\'s SSL certificate.');
      } else {
        setError(`Error: ${err.message}`);
      }
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <PageTitle>Add a new Customer</PageTitle>
        <FormGrid>
          <FormGroup>
            <Label>First Name</Label>
            <Input 
              type="text" 
              name="first_name" 
              placeholder="Your First Name" 
              value={newCustomer.first_name}
              onChange={handleFormChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Last Name</Label>
            <Input 
              type="text" 
              name="last_name" 
              placeholder="Your Last Name" 
              value={newCustomer.last_name}
              onChange={handleFormChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Gender</Label>
            <Select 
              name="gender" 
              value={newCustomer.gender}
              onChange={handleFormChange}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Date Of Birth</Label>
            <Input 
              type="date" 
              name="dob" 
              placeholder="YYYY-MM-DD"
              value={newCustomer.dob}
              onChange={handleFormChange}
              title="Please enter a date in YYYY-MM-DD format"
            />
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Format: YYYY-MM-DD
            </div>
          </FormGroup>
          <FormGroup>
            <Label>Contact Number</Label>
            <Input 
              type="tel" 
              name="phone" 
              placeholder="Your Phone number"
              value={newCustomer.phone}
              onChange={handleFormChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input 
              type="email" 
              name="email" 
              placeholder="Your Email"
              value={newCustomer.email}
              onChange={handleFormChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <AddressInput
              id="address"
              name="address"
              value={newCustomer.address}
              onChange={(value) => setNewCustomer(prev => ({ ...prev, address: value }))}
              label="Address"
              required={false}
              onValidationComplete={(isValid) => {
                setIsAddressValid(isValid);
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <Select 
              name="status" 
              value={newCustomer.status}
              onChange={handleFormChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FormGroup>
        </FormGrid>
        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
        )}
        <ButtonGroup>
          <Button $variant="secondary" onClick={handleCancel} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </ButtonGroup>
      </FormContainer>
    </PageContainer>
  );
};

export default CustomerCreate;