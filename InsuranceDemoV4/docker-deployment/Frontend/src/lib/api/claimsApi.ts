import { createApiClient } from './apiClient';

const apiClient = createApiClient('/claim-api/1.0');

export const getAllClaims = () => apiClient.get(`/claims`);
export const getClaimById = (id: string) => apiClient.get(`/claim/${id}`);
export const updateClaimById = (id: string, payload: any) => apiClient.put(`/claim/${id}`, payload);
export const deleteClaimById = (id: string) => apiClient.delete(`/claim/${id}`);
export const getClaimByCustomerId = (id: string) => apiClient.get(`/claims/customer/${id}`);
export const createClaim = (payload: any) => apiClient.post(`/claim`, payload);
export const getTotalClaims = () => apiClient.get(`/claims/count`);
export const getClaimsByEmployeeId = (employeeId: string) => apiClient.get(`/claims/employee/${employeeId}`);
export const getTotalClaimsByEmployeeId = (employeeId: string) => apiClient.get(`/claims/count/employee/${employeeId}`);