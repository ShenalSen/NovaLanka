import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../../lib/api/productsApi';
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
} from '../../../styles/admin/ProductCreate.styled';

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    coverage_type: '',
    coverage_amount: '',
    deductible: '',
    premium: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  const handleSave = async () => {
    const payload = {
      "Insert New Product": {
        name: newProduct.name,
        description: newProduct.description,
        coverage_type: newProduct.coverage_type,
        coverage_amount: parseFloat(newProduct.coverage_amount),
        deductible: parseFloat(newProduct.deductible),
        premium: newProduct.premium
      }
    };
    try {
      await createProduct(payload);
      navigate('/admin/products');
    } catch {}
  };

  return (
    <PageContainer>
      <FormContainer>
        <PageTitle>Add a new Product</PageTitle>
        
        <FormRow>
          <FormGroup>
            <Label>Name</Label>
            <Input 
              type="text" 
              name="name" 
              placeholder="Aarogya" 
              value={newProduct.name}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Description</Label>
            <Input 
              type="text" 
              name="description" 
              placeholder="Rawles" 
              value={newProduct.description}
              onChange={handleInputChange}
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label>Coverage Type</Label>
            <Input 
              type="text" 
              name="coverage_type" 
              placeholder="Life Insurance" 
              value={newProduct.coverage_type}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Coverage Amount</Label>
            <Input 
              type="text" 
              name="coverage_amount" 
              placeholder="LKR 200 000" 
              value={newProduct.coverage_amount}
              onChange={handleInputChange}
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label>Deductible</Label>
            <Input 
              type="text" 
              name="deductible" 
              placeholder="LKR 10 000" 
              value={newProduct.deductible}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Premium</Label>
            <Input 
              type="text" 
              name="premium" 
              placeholder="Monthly" 
              value={newProduct.premium}
              onChange={handleInputChange}
            />
          </FormGroup>
        </FormRow>
        
        <ButtonGroup>
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </ButtonGroup>
      </FormContainer>
    </PageContainer>
  );
};

export default ProductCreate;