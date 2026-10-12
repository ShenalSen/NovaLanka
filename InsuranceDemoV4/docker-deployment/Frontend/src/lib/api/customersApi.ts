import { createApiClient } from './apiClient';

const apiClient = createApiClient('/customer-api/1.0');

export const getAllCustomers = () => apiClient.get(`/customers`);
export const getCustomerById = (id: string) => apiClient.get(`/customer/${id}`);
export const updateCustomerById = (id: string, customer: any) => apiClient.put(`/customer/${id}`, customer);
export const deleteCustomerById = (id: string) => apiClient.delete(`/customer/${id}`);
export const createCustomer = (customerData: any) => apiClient.post(`/customer`, customerData);
export const getTotalCustomers = () => apiClient.get(`/customers/count`);
export const getCustomerDetailsByEmployeeId = (employeeId: string) => apiClient.get(`/customers/byemployee/${employeeId}`);
