import { createApiClient } from './apiClient';

const apiClient = createApiClient('/policy-lifecycle-api/1.0.0', 15000);

/* ── Policy Purchase ── */
export interface PolicyPurchaseRequest {
  quote_id: string;
  personal_details: {
    first_name: string;
    last_name: string;
    nic_number: string;
    email: string;
    mobile_number: string;
    address: string;
  };
  payment_method: string;
}

export interface PolicyPurchaseResponse {
  policy_id: string;
  policy_status: string;
  payment_id: string;
  next_due_date: string;
  payment_time: string;
  payment_status: string;
}

export const purchasePolicy = (payload: PolicyPurchaseRequest) =>
  apiClient.post<PolicyPurchaseResponse>('/purchase', payload);

/* ── Policy Renewal ── */
export interface RenewPolicyRequest {
  term_years: number;
  payment_details: {
    first_name: string;
    last_name: string;
    nic_number: string;
    email: string;
    mobile_number: string;
    address: string;
    payment_method: string;
  };
}

export interface RenewPolicyResponse {
  message: string;
  policy_id: string;
  customer_id: string;
  product_id: string;
  status: string;
  start_date: string;
  new_end_date: string;
  premium_amount: number;
  term_years_added: number;
  payment_id: string;
  policy_details: string;
}

export const renewPolicy = (policyId: string, payload: RenewPolicyRequest) =>
  apiClient.post<RenewPolicyResponse>(`/policy/${policyId}/renew`, payload);
