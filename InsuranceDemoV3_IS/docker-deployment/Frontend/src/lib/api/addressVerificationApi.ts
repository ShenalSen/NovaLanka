import axios from 'axios';

export type AddressVerificationResponse = {
  valid: boolean;
  display_name: string;
};

const api = axios.create({
  baseURL: 'https://localhost:8246/addressverification-api/1.0',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export const verifyAddress = async (address: string) => {
  try {
    return (await api.post('/address', { address })).data;
  } catch {
    return { valid: false, display_name: '' };
  }
};
