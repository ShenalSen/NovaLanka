import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageContainer,
  FormContainer,
  PageTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  Button,
  EditButton
} from '../../../styles/admin/EmployeeDetail.styled';

interface EmployeeData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

const EmployeeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      import('../../../lib/api/employeesApi')
        .then(({ getEmployeeById }) => {
          getEmployeeById(id)
            .then(res => {
              const employeeDetails = res.data?.Employee || {};
              setEmployeeData(employeeDetails);
              setLoading(false);
            })
            .catch(() => {
              setError('Failed to load employee data');
              setLoading(false);
            });
        });
    }
  }, [id]);

  const handleEditToggle = () => setIsEditing(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (id) {
      import('../../../lib/api/employeesApi')
        .then(({ getEmployeeById }) => {
          getEmployeeById(id)
            .then(res => {
              const employeeDetails = res.data?.Employee || {};
              setEmployeeData(employeeDetails);
            });
        });
    }
  };

  const handleSave = () => {
    if (id) {
      setLoading(true);
      import('../../../lib/api/employeesApi')
        .then(({ updateEmployeeById }) => {
          const allowedFields = [
            'employee_id',
            'first_name',
            'last_name',
            'role',
            'email',
            'phone',
            'address'
          ];
          const filteredEmployeeData = Object.fromEntries(
            Object.entries(employeeData).filter(([key]) => allowedFields.includes(key))
          );
          const payload = { employee: filteredEmployeeData };
          updateEmployeeById(id, payload)
            .then(() => {
              setIsEditing(false);
              setLoading(false);
              navigate('/admin/employees');
            })
            .catch(() => {
              setError('Failed to update employee');
              setLoading(false);
            });
        });
    }
  };

  if (loading) return <PageContainer>Loading employee data...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;

  return (
    <PageContainer>
      <FormContainer>
        <PageTitle>
          {isEditing ? 'Edit Employee' : `Employee - #${employeeData.employee_id}`}
        </PageTitle>
        {!isEditing && <EditButton onClick={handleEditToggle}>Edit</EditButton>}
        <FormGrid>
          <FormGroup>
            <Label>First Name</Label>
            <Input 
              type="text" 
              name="first_name" 
              value={employeeData.first_name || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </FormGroup>
          <FormGroup>
            <Label>Last Name</Label>
            <Input 
              type="text" 
              name="last_name" 
              value={employeeData.last_name || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </FormGroup>
        </FormGrid>
        <FormGrid>
          <FormGroup>
            <Label>Email</Label>
            <Input 
              type="email" 
              name="email" 
              value={employeeData.email || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone number</Label>
            <Input 
              type="tel" 
              name="phone" 
              value={employeeData.phone || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </FormGroup>
        </FormGrid>
        <FormGroup>
          <Label>Address</Label>
          <Input 
            type="text" 
            name="address" 
            value={employeeData.address || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormGroup>
        <FormGroup>
          <Label>Role</Label>
          <Input 
            type="text" 
            name="role" 
            value={employeeData.role || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </FormGroup>
        <ButtonGroup>
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : null}
        </ButtonGroup>
      </FormContainer>
    </PageContainer>
  );
};

export default EmployeeDetail;