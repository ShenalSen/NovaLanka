import { createApiClient } from './apiClient';

const apiClient = createApiClient('/payments-api/1.0.0', 15000);

export interface PaymentRequest {
  policy_id: string;
  first_name: string;
  last_name: string;
  nic_number: string;
  email: string;
  mobile_number: string;
  address: string;
  amount: number;
  tran_date: string;
  payment_method: string;
  status: string;
}

export interface PaymentResponse {
  payment_id: string;
  status: string;
}

export const makePayment = (data: PaymentRequest) =>
  apiClient.post<PaymentResponse>('/', data);
