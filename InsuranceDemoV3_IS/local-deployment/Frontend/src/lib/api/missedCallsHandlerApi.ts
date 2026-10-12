import axios from 'axios';

const BASE_URL = 'https://localhost:8243/missed-calls-api/1.0.0'; 
const API_KEY = import.meta.env.VITE_MISSED_CALL_API_KEY;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ApiKey': API_KEY,
  },
});

export type ReportMissedCallResponse = {
  success?: boolean;
  status?: string;
  message?: string;
};

export const reportMissedCall = (mobileNo: string, signal?: AbortSignal) => 
  apiClient.post<ReportMissedCallResponse>('/notifications', { mobileNo }, { signal });