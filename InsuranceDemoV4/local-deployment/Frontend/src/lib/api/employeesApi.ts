import { createApiClient } from './apiClient';

const apiClient = createApiClient('/employee-api/1.0');

export const getAllEmployees = () => apiClient.get(`/employees`);
export const getEmployeeById = (id: string) => apiClient.get(`/employee/${id}`);
export const updateEmployeeById = (id: string, payload: any) => apiClient.put(`/employee/${id}`, payload);
export const deleteEmployeeById = (id: string) => apiClient.delete(`/employee/${id}`);
export const createEmployee = (employeeData: any) => apiClient.post(`/employee`, { employee: employeeData });
