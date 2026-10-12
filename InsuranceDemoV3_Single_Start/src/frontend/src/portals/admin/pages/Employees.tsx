import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, deleteEmployeeById } from '../../../lib/api/employeesApi';
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
  DeleteButton
} from '../../../styles/admin/Employees.styled';

interface Employee {
  employee_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  role: string;
}

const Employees: React.FC = () => {
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllEmployees()
      .then(res => {
        const employeesList = res.data?.Employees?.Employee || [];
        setEmployees(employeesList);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch employees');
        setLoading(false);
      });
  }, []);

  const handleAddEmployee = () => navigate('/admin/employees/create');
  const handleDeleteModeToggle = () => setDeleteMode(!deleteMode);

  const handleDeleteEmployee = async (employee_id: string) => {
    try {
      await deleteEmployeeById(employee_id);
      setEmployees(prev => prev.filter(e => e.employee_id !== employee_id));
    } catch {
      setError('Failed to delete employee');
    }
  };

  const handleViewEmployee = (employee_id: string) => {
    navigate(`/admin/employees/${employee_id}`);
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;

  return (
    <PageContainer>
      <PageHeader>
        <br />
        <ButtonGroup>
          <Button onClick={handleAddEmployee}>Add</Button>
          <Button variant="danger" onClick={handleDeleteModeToggle}>
            {deleteMode ? 'Cancel' : 'Delete'}
          </Button>
        </ButtonGroup>
      </PageHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Employee ID</TableHeader>
              <TableHeader>First name</TableHeader>
              <TableHeader>Last name</TableHeader>
              <TableHeader>Phone Number</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              {deleteMode ? <TableHeader>Delete here</TableHeader> : <TableHeader>View Details</TableHeader>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <TableRow key={employee.employee_id}>
                <TableCell>{employee.employee_id}</TableCell>
                <TableCell>{employee.first_name}</TableCell>
                <TableCell>{employee.last_name}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  {deleteMode ? (
                    <DeleteButton onClick={() => handleDeleteEmployee(employee.employee_id)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H3.33333H14" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33334 4V2.66667C5.33334 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66668 1.33334H9.33334C9.68697 1.33334 10.0261 1.47381 10.2762 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2762 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97392 14.5262 3.72387 14.2761C3.47382 14.0261 3.33334 13.687 3.33334 13.3333V4H12.6667Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </DeleteButton>
                  ) : (
                    <Button onClick={() => handleViewEmployee(employee.employee_id)}>View</Button>
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

export default Employees;