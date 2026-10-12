import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCustomers, deleteCustomerById } from '../../../lib/api/customersApi';
import {
  PageContainer,
  PageHeader,
  ButtonGroup,
  Button,
  TableContainer,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  DeleteButton
} from '../../../styles/admin/Customers.styled';

interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  status: string;
  created_at?: string;
}

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllCustomers()
      .then(res => {
        const customersArray = res.data.Customers?.Customer || [];
        setCustomers(customersArray);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch customers');
        setLoading(false);
      });
  }, []);

  const handleAddCustomer = () => navigate('/admin/customers/create');
  const handleDeleteModeToggle = () => setDeleteMode(!deleteMode);

  const handleDeleteCustomer = async (customer_id: string) => {
    try {
      await deleteCustomerById(customer_id);
      setCustomers(prev => prev.filter(c => c.customer_id !== customer_id));
    } catch {
      setError('Failed to delete customer');
    }
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;
  if (customers.length === 0) {
    return (
      <PageContainer>
        <div>No customers found.</div>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <br />
        <ButtonGroup>
          <Button onClick={handleAddCustomer}>Add</Button>
          <Button $variant="danger" onClick={handleDeleteModeToggle}>
            {deleteMode ? 'Cancel' : 'Delete'}
          </Button>
        </ButtonGroup>
      </PageHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Customer Name</TableHeader>
              <TableHeader>Gender</TableHeader>
              <TableHeader>Phone Number</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Address</TableHeader>
              <TableHeader>DOB</TableHeader>
              {deleteMode ? <TableHeader>Delete Here</TableHeader> : <TableHeader>Status</TableHeader>}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <TableRow key={customer.customer_id}>
                <TableCell>{customer.first_name} {customer.last_name}</TableCell>
                <TableCell>{customer.gender}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.dob}</TableCell>
                <TableCell>
                  {deleteMode ? (
                    <DeleteButton onClick={() => handleDeleteCustomer(customer.customer_id)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H3.33333H14" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33334 4V2.66667C5.33334 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66668 1.33334H9.33334C9.68697 1.33334 10.0261 1.47381 10.2762 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2762 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97392 14.5262 3.72387 14.2761C3.47382 14.0261 3.33334 13.687 3.33334 13.3333V4H12.6667Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </DeleteButton>
                  ) : (
                    <StatusBadge $status={customer.status === 'active' ? 'Active' : 'Inactive'}>{customer.status === 'active' ? 'Active' : 'Inactive'}</StatusBadge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default Customers;