import React, { useState, useEffect } from 'react';
import { getCustomerDetailsByEmployeeId } from '../../../lib/api/customersApi';
import { useEmployee } from '../../../lib/auth/employeeContext';
import {
  PageContainer,
  Card,
  TitleRow,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  Table,
  Th,
  Tr,
  Td,
  StatusBadge
} from '../../../styles/employee/Customers.styled';

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
}

const Customers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { employeeId: contextEmployeeId } = useEmployee();
  const employeeId = contextEmployeeId || 'E_001';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        console.log('Customers page fetching data for employee ID:', employeeId);
        const response = await getCustomerDetailsByEmployeeId(employeeId);
        let customerData: Customer[] = [];
        if (response.data && response.data.Customers && response.data.Customers.Customer) {
          if (Array.isArray(response.data.Customers.Customer)) {
            customerData = response.data.Customers.Customer;
          } else if (typeof response.data.Customers.Customer === 'object') {
            customerData = [response.data.Customers.Customer];
          }
        }
        setCustomers(customerData);
      } catch {
        setError('Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [employeeId]);

  const filteredCustomers = customers.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <Card>
        <TitleRow>
           <br />
          <SearchWrapper>
            <SearchIcon>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchWrapper>
        </TitleRow>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading customers...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>{error}</div>
        ) : (
        <Table>
          <thead>
            <tr>
              <Th>Customer ID</Th>
              <Th>Customer Name</Th>
              <Th>Gender</Th>
              <Th>Phone Number</Th>
              <Th>Email</Th>
              <Th>Address</Th>
              <Th>DOB</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c, i) => (
              <Tr key={i}>
                <Td>{c.customer_id}</Td>
                <Td>{c.first_name} {c.last_name}</Td>
                <Td>{c.gender}</Td>
                <Td>{c.phone}</Td>
                <Td>{c.email}</Td>
                <Td>{c.address}</Td>
                <Td>{c.dob}</Td>
                <Td>
                  <StatusBadge status={c.status.toLowerCase() === 'active' ? 'active' : 'inactive'}>
                    {c.status}
                  </StatusBadge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        )}
      </Card>
    </PageContainer>
  );
};

export default Customers;