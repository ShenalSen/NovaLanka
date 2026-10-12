import { createApiClient } from './apiClient';

const apiClient = createApiClient('/policy-validation-api/1.0.0', 8000);

export type ValidatePolicyResponse = {
  valid: number;
  policy_id: string;
  message: string;
};

export const validatePolicy = (policyId: string): Promise<{ data: ValidatePolicyResponse }> =>
  apiClient.get(`/status/${encodeURIComponent(policyId)}`);
