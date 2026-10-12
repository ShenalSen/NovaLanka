import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from '../../../lib/api/employeesApi';
import AddressInput from '../../../components/common/AddressInput';
import {
  PageContainer,
  FormContainer,
  PageTitle,
  FormRow,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  Button
} from '../../../styles/admin/EmployeeCreate.styled';

const EmployeeCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => navigate('/admin/employees');

  const handleSave = () => {
    if (!newEmployee.first_name || !newEmployee.last_name || !newEmployee.email) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (newEmployee.address.trim() !== "" && isAddressValid === false) {
      setError('Please enter a valid address');
      return;
    }
    setLoading(true);
    setError(null);
    createEmployee(newEmployee)
      .then(() => {
        navigate('/admin/employees');
      })
      .catch(() => {
        setError('Failed to create employee. Please try again.');
        setLoading(false);
      });
  };

  return (
    <PageContainer>
      <FormContainer>
        <PageTitle>Create a new Employee</PageTitle>
        {error && (
          <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#fff5f5', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        <FormRow>
          <FormGroup>
            <Label>First Name*</Label>
            <Input 
              type="text" 
              name="first_name" 
              placeholder="Alexa" 
              value={newEmployee.first_name}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Last Name*</Label>
            <Input 
              type="text" 
              name="last_name" 
              placeholder="Rawles" 
              value={newEmployee.last_name}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label>Email*</Label>
            <Input 
              type="email" 
              name="email" 
              placeholder="rimel1111@gmail.com" 
              value={newEmployee.email}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone number</Label>
            <Input 
              type="tel" 
              name="phone" 
              placeholder="+44 2343 2838" 
              value={newEmployee.phone}
              onChange={handleInputChange}
              disabled={loading}
            />
          </FormGroup>
        </FormRow>
        <FormGroup>
          <AddressInput
            id="address"
            name="address"
            value={newEmployee.address}
            onChange={(value) => setNewEmployee(prev => ({ ...prev, address: value }))}
            label="Address"
            required={false}
            onValidationComplete={(isValid) => {
              setIsAddressValid(isValid);
            }}
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <Label>Role</Label>
          <Input 
            type="text" 
            name="role" 
            placeholder="Insurance Agent" 
            value={newEmployee.role}
            onChange={handleInputChange}
            disabled={loading}
          />
        </FormGroup>
        <ButtonGroup>
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </ButtonGroup>
      </FormContainer>
    </PageContainer>
  );
};

export default EmployeeCreate;