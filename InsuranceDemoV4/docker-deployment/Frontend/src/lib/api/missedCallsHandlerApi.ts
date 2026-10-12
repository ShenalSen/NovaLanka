import { createApiClient } from './apiClient';

const apiClient = createApiClient('/missed-calls-api/1.0.0', 15000, {
  ApiKey: import.meta.env.VITE_MISSED_CALL_API_KEY,
});

export type ReportMissedCallResponse = {
  success?: boolean;
  status?: string;
  message?: string;
};

export const reportMissedCall = (mobileNo: string, signal?: AbortSignal) =>
  apiClient.post<ReportMissedCallResponse>('/notifications', { mobileNo }, { signal });