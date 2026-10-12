import { createApiClient } from './apiClient';

const apiClient = createApiClient('/quotes-api/1.0.0', 15000);

export type FrequencyType = 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY' | 'MONTHLY';

export interface QuoteRequest {
  product_id: string;
  coverage_type: string;
  age: number;
  sum_assured: number;
  term_years: number;
  frequency: FrequencyType;
}

export interface QuoteResponse {
  quote_id: string;
  product_id: string;
  coverage_type: string;
  age: number;
  sum_assured: number;
  term_years: number;
  frequency: string;
  base_premium: number;
  total_premium: number;
  status: string;
  valid_until: string;
}

export const createQuote = (payload: QuoteRequest) =>
  apiClient.post<QuoteResponse>('/quote', payload);

export const getQuoteById = (id: string) =>
  apiClient.get<QuoteResponse>(`/quote/${id}`);
