import axios from 'axios';

const BASE_URL = 'https://localhost:8243/policy-validation-api/1.0.0';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export type ValidatePolicyResponse = {
  valid: number;
  policy_id: string;
  message: string;
};

export const validatePolicy = (policyId: string): Promise<{ data: ValidatePolicyResponse }> => apiClient.get(`/status/${encodeURIComponent(policyId)}`);
