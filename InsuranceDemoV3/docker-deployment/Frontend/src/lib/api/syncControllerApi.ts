import axios from 'axios';

const BASE_URL = 'https://localhost:8246/policy-sync-api/1.0.0';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export type SyncTriggerResponse = {
  status: string;
  message: string;
};

export const triggerPolicySync = (): Promise<{ data: SyncTriggerResponse }> => apiClient.post('/trigger-sync', {});

export default apiClient;
