import { createApiClient } from './apiClient';

const apiClient = createApiClient('/policies-api/1.0');

export const getAllPolicies = () => apiClient.get(`/policies`);
export const patchPolicy = (id: string, nextDueDate: string) =>
  apiClient.patch(`/policy/${id}`, {
    'Update a policy': { policy_id: id, status: 'Active', next_due_date: nextDueDate },
  });
export const getPolicyById = (id: string) => apiClient.get(`/policy/${id}`);
export const updatePolicyById = (id: string, policy: any) => apiClient.put(`/policy/${id}`, policy);
export const deletePolicyById = (id: string) => apiClient.delete(`/policy/${id}`);
export const createPolicy = (policyData: any) => apiClient.post(`/policy`, policyData);
export const getPolicyByCustomerId = (id: string) => apiClient.get(`/policies/customer/${id}`);
export const getTotalPolicies = () => apiClient.get(`/policies/count`);
export const getTotalPoliciesByEmployeeId = (employeeId: string) => apiClient.get(`/policies/count/employee/${employeeId}`);
export const getPoliciesDetailsByEmployeeId = (employeeId: string) => apiClient.get(`/policies/employee/${employeeId}`);
export const getCustomerCountByEmployeeId = (employeeId: string) => apiClient.get(`/customers/count/employee/${employeeId}`);
