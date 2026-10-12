import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPolicy } from '../../../lib/api/policiesApi';
import {
  PageContainer,
  Card,
  PageTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
  FullWidthFormGroup,
  ButtonContainer,
  Button
} from '../../../styles/admin/CreatePolicy.styled';

interface FormData {
  customer_id: string;
  product_id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  status: string;
  policy_details: string;
}

const CreatePolicy: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    customer_id: '',
    product_id: '',
    employee_id: '',
    start_date: '',
    end_date: '',
    status: '',
    policy_details: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const updatedFormData = { 
      ...formData,
      status: formData.status || 'Active' 
    };
    
    const payload = { "Create a policy": { ...updatedFormData } };
    
    try {
      await createPolicy(payload);
      navigate('/admin/policies');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create policy.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/admin/policies');

  return (
    <PageContainer>
      <Card>
        <PageTitle>Create a New Policy</PageTitle>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{error}</div>
          )}
          <FormGrid>
            <FormGroup>
              <Label>Customer ID</Label>
              <Input
                type="text"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                placeholder="C_002"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Product ID</Label>
              <Input
                type="text"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                placeholder="P_001"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Employee ID</Label>
              <Input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="E_001"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Start Date</Label>
              <Input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>End Date</Label>
              <Input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </FormGroup>
            <FullWidthFormGroup>
              <Label>Policy Details</Label>
              <Textarea
                name="policy_details"
                value={formData.policy_details}
                onChange={handleChange}
                placeholder="Enter policy details..."
                required
                rows={3}
              />
            </FullWidthFormGroup>
          </FormGrid>
          <ButtonContainer>
            <Button type="button" onClick={handleCancel} disabled={loading}>Cancel</Button>
            <Button type="submit" primary disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
          </ButtonContainer>
        </form>
      </Card>
    </PageContainer>
  );
};

export default CreatePolicy;