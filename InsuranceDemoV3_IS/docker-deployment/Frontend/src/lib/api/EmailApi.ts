import axios from 'axios';

const EMAIL_API_URL = 'https://localhost:8246/email-api/1.0/send';

export type EmailPayload = Record<string, any>;

export async function sendSubmissionEmail(payload: EmailPayload) {
  try {
    const response = await axios.post(EMAIL_API_URL, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}
