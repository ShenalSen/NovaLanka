import { createApiClient } from './apiClient';

export type EmailPayload = Record<string, any>;

const apiClient = createApiClient('/email-api/1.0');

export async function sendSubmissionEmail(payload: EmailPayload) {
  try {
    const response = await apiClient.post('/send', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}
