import axios from 'axios';

const BASE_URL = 'https://localhost:8246/policies-api/1.0';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
});

export const getAllPolicies = () => apiClient.get(`/policies`);
export const getPolicyById = (id: string) => apiClient.get(`/policy/${id}`);
export const updatePolicyById = (id: string, policy: any) => apiClient.put(`/policy/${id}`, policy);
export const deletePolicyById = (id: string) => apiClient.delete(`/policy/${id}`);
export const createPolicy = (policyData: any) => apiClient.post(`/policy`, policyData);
export const getPolicyByCustomerId = (id: string) => apiClient.get(`/policies/customer/${id}`);
export const getTotalPolicies = () => apiClient.get(`/policies/count`);
export const getTotalPoliciesByEmployeeId = (employeeId: string) => apiClient.get(`/policies/count/employee/${employeeId}`);
export const getPoliciesDetailsByEmployeeId = (employeeId: string) => apiClient.get(`/policies/employee/${employeeId}`);
export const getCustomerCountByEmployeeId = (employeeId: string) => apiClient.get(`/customers/count/employee/${employeeId}`);
