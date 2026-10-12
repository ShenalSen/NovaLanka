import { createApiClient } from './apiClient';

const apiClient = createApiClient('/policy-sync-api/1.0.0', 8000);

export type SyncTriggerResponse = {
  status: string;
  message: string;
};

export const triggerPolicySync = (): Promise<{ data: SyncTriggerResponse }> =>
  apiClient.post('/trigger-sync', {});
