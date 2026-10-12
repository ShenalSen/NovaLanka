import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPolicyById, updatePolicyById } from '../../../lib/api/policiesApi';
import {
  PageContainer,
  PageHeader,
  Divider,
  PageTitle,
  ButtonGroup,
  Button,
  Card,
  FormSection,
  FormGrid,
  FormLabel,
  ReadOnlyInput,
  EditableInput,
  ReadOnlyDetailsBox,
  EditableTextArea
} from '../../../styles/admin/PolicyDetails.styled';

interface PolicyDetails {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  product: {
    name: string;
    category: string;
    description: string;
  };
  policy: {
    startDate: string;
    endDate: string;
    duration: string;
    value: string;
    details: string;
    status: 'Active' | 'Inactive';
  };
  employee: {
    name: string;
    id: string;
    department: string;
  };
  payments: {
    lastPayment: string;
    nextPayment: string;
    frequency: string;
    amount: string;
  };
}

const PolicyDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPolicyById(id)
      .then(res => {
        const p = res.data.Policy || res.data.policy || res.data;
        setPolicy(p);
        setFormState(p);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load policy details');
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    setEditMode(true);
    setFormState(policy);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormState(policy);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePolicyById(id!, {
        "Update a policy": {
          policy_id: policy.policy_id,
          customer_id: formState.customer_id,
          product_id: formState.product_id,
          employee_id: formState.employee_id,
          start_date: formState.start_date,
          end_date: formState.end_date,
          status: formState.status,
          policy_details: formState.policy_details
        }
      });
      setPolicy({ ...formState, policy_id: policy.policy_id });
      setEditMode(false);
      setError(null);
      navigate('/admin/policies');
    } catch {
      setError('Failed to update policy');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageContainer>Loading policy details...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;
  if (!policy) return <PageContainer>Policy not found</PageContainer>;

  const isEditing = editMode;
  const values = isEditing ? formState : policy;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Policy Details - {policy.policy_id || policy.id}</PageTitle>
      </PageHeader>
      <Divider />
      <Card>
        <FormSection>
          <FormGrid>
            <div>
              <FormLabel>Policy ID</FormLabel>
              <ReadOnlyInput name="policy_id" value={values.policy_id || ''} disabled />
            </div>
            <div>
              <FormLabel>Customer ID</FormLabel>
              {isEditing ? (
                <EditableInput name="customer_id" value={values.customer_id || ''} disabled={!isEditing} onChange={handleInputChange} />
              ) : (
                <ReadOnlyInput name="customer_id" value={values.customer_id || ''} disabled />
              )}
            </div>
            <div>
              <FormLabel>Product ID</FormLabel>
              {isEditing ? (
                <EditableInput name="product_id" value={values.product_id || ''} disabled={!isEditing} onChange={handleInputChange} />
              ) : (
                <ReadOnlyInput name="product_id" value={values.product_id || ''} disabled />
              )}
            </div>
            <div>
              <FormLabel>Employee ID</FormLabel>
              {isEditing ? (
                <EditableInput name="employee_id" value={values.employee_id || ''} disabled={!isEditing} onChange={handleInputChange} />
              ) : (
                <ReadOnlyInput name="employee_id" value={values.employee_id || ''} disabled />
              )}
            </div>
            <div>
              <FormLabel>Start Date</FormLabel>
              {isEditing ? (
                <EditableInput name="start_date" value={values.start_date?.split('+')[0] || ''} disabled={!isEditing} onChange={handleInputChange} />
              ) : (
                <ReadOnlyInput name="start_date" value={values.start_date?.split('+')[0] || ''} disabled />
              )}
            </div>
            <div>
              <FormLabel>End Date</FormLabel>
              {isEditing ? (
                <EditableInput name="end_date" value={values.end_date?.split('+')[0] || ''} disabled={!isEditing} onChange={handleInputChange} />
              ) : (
                <ReadOnlyInput name="end_date" value={values.end_date?.split('+')[0] || ''} disabled />
              )}
            </div>
            <div>
              <FormLabel>Status</FormLabel>
              {isEditing ? (
                <EditableInput name="status" value={values.status || ''} disabled={!isEditing} onChange={handleInputChange} />
              ) : (
                <ReadOnlyInput name="status" value={values.status || ''} disabled />
              )}
            </div>
            <div>
              <FormLabel>Details</FormLabel>
              {isEditing ? (
                <EditableTextArea
                  name="policy_details"
                  value={values.policy_details || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Enter policy details"
                />
              ) : (
                <ReadOnlyDetailsBox>
                  {values.policy_details || ''}
                </ReadOnlyDetailsBox>
              )}
            </div>
          </FormGrid>
        </FormSection>
        <ButtonGroup>
          {!isEditing && <Button onClick={handleEdit}>Edit</Button>}
          {isEditing && <Button variant="save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>}
          {isEditing && <Button variant="cancel" onClick={handleCancel} disabled={saving}>Cancel</Button>}
        </ButtonGroup>
      </Card>
    </PageContainer>
  );
};

export default PolicyDetails;